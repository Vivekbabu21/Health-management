const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },

});

const Disease = mongoose.model('Disease', diseaseSchema);


exports.addDisease = (data) => {
    const disease = new Disease(data);
    return disease.save();        
};

exports.getDiseases = ()=>{
    return Disease.find();
}

exports.getDiseaseById = (diseaseId)=>{
    return Disease.findById(diseaseId);
}

exports.editDiseaseById = (diseaseId,data)=>{
    return Disease.findByIdAndUpdate(diseaseId,{ $set: data },{new:true});
}

exports.deleteDiseaseById = (diseaseId)=>{
    return Disease.findByIdAndDelete(diseaseId);
}

exports.diseaseDetails = (diseaseId)=>{
    return Disease.aggregate(
        [
            { $match: { _id:new mongoose.Types.ObjectId(diseaseId) } },
            {
                $lookup: {
                  from: "prescriptions",
                  localField: "_id",
                  foreignField: "diseaseId",
                  as: "prescriptions"
                }
              },
              {
                $unwind: {
                  path: "$prescriptions",
                  preserveNullAndEmptyArrays: true
                }
              },
              {
                $group: {
                  _id: "$_id",
                  diseaseName: {
                    $first: "$name"
                  },
                  uniquePatients: {
                    $addToSet: "$prescriptions.patientId"
                  },
                  commonMedicines: {
                    $push: {
                      medicineId:
                        "$prescriptions.medicines.medicineId"
                    }
                  }
                }
              },
              {
                $project: {
                  diseaseName: 1,
                  patientCount: {
                    $size: "$uniquePatients"
                  },
                  commonMedicines: 1
                }
              },
              {
                $lookup: {
                  from: "medicines",
                  localField: "commonMedicines.medicineId",
                  foreignField: "_id",
                  as: "medicineNames"
                }
              },
              {
                $project: {
                  diseaseName: 1,
                  patientCount: 1,
                  mostCommonMedicines:  "$medicineNames.name"
                }
              }
        ])

}


exports.avgAgePerDisease =()=>{
    return Disease.aggregate([
        {
            $lookup: {
              from: "prescriptions",
              localField: "_id",
              foreignField: "diseaseId",
              as: "prescriptions"
            }
          },
          {
            $unwind: "$prescriptions"
          },
          {
            $lookup: {
              from: "patients",
              localField: "prescriptions.patientId",
              foreignField: "_id",
              as: "patientDetails"
            }
          },
          {
            $unwind: "$patientDetails"
          },
          {
            $project: {
              diseaseName: "$name",
              age: {
                $floor: {
                  $divide: [
                    { $subtract: [new Date(), "$patientDetails.dateOfBirth"] },
                    1000 * 60 * 60 * 24 * 365.25
                  ]
                }
              }
            }
          },
          {
            $group: {
              _id: "$_id", 
              diseaseName: { $first: "$diseaseName" },
              averageAge: { $avg: "$age" }
            }
          },
          {
            $project: {
              diseaseName: 1,
              averageAge: 1
            }
          }
    ])
}