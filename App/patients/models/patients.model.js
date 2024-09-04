const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },  
  dateOfBirth: { type: Date, required: true },  
  gender: { type: String ,required: true },
  phoneNumber: { type: Number, required: true },
});

const Patient = mongoose.model('Patient', patientSchema);

exports.addPatient = (data) => {
    const patient = new Patient(data);
    return patient.save();        
};

exports.getPatients = ()=>{
    return Patient.find();
}

exports.getPatientById = (patient_id)=>{
    return Patient.findById(patient_id);
}

exports.editPatientById = (patient_id,data)=>{
    return Patient.findByIdAndUpdate(patient_id,{ $set: data },{new:true});
}

exports.deletePatientById = (patient_id)=>{
    return Patient.findByIdAndDelete(patient_id);
}

exports.patientDetails = (patientId) => {
    return Patient.aggregate(
        [
            { $match: { _id:new mongoose.Types.ObjectId(patientId) } },
          
            {
                $lookup: {
                  from: "appointments",
                  localField: "_id",
                  foreignField: "patientId",
                  as: "appointments"
                }
              },
              {
                $lookup: {
                  from: "prescriptions",
                  localField: "_id",
                  foreignField: "patientId",
                  as: "prescriptions"
                }
              },
              {
                $lookup: {
                  from: "doctors",
                  localField: "appointments.doctorId",
                  foreignField: "_id",
                  as: "doctorsConsulted"
                }
              },
              {
                $lookup: {
                  from: "diseases",
                  localField: "prescriptions.diseaseId",
                  foreignField: "_id",
                  as: "diseasesDiagnosed"
                }
              },
              {
                $unwind: {
                  path: "$prescriptions",
                  preserveNullAndEmptyArrays: true
                }
              },
              {
                $unwind: "$prescriptions.medicines"
              },
              {
                $lookup: {
                  from: "medicines",
                  localField:
                    "prescriptions.medicines.medicineId",
                  foreignField: "_id",
                  as: "prescriptions.medicineDetails"
                }
              },
              {
                $unwind: {
                  path: "$prescriptions.medicineDetails",
                  preserveNullAndEmptyArrays: true
                }
              },
              {
                $group: {
                  _id: "$_id",
                  username: {
                    $first: "$username"
                  },
                  email: {
                    $first: "$email"
                  },
                  dateOfBirth: {
                    $first: "$dateOfBirth"
                  },
                  gender: {
                    $first: "$gender"
                  },
                  phoneNumber: {
                    $first: "$phoneNumber"
                  },
                  appointments: {
                    $first: "$appointments"
                  },
                  doctorsConsulted: {
                    $first: "$doctorsConsulted"
                  },
                  diseasesDiagnosed: {
                    $first: "$diseasesDiagnosed"
                  },
                  prescriptions: {
                    $push: {
                      diseaseId: "$prescriptions.diseaseId",
                      medicines: {
                        name: "$prescriptions.medicineDetails.name",
                        doasge:
                          "$prescriptions.medicines.dosage",
                        instructions:
                          "$prescriptions.medicines.instructions"
                      },
                      startDate: "$prescriptions.startDate",
                      endDate: "$prescriptions.endDate"
                    }
                  }
                }
              },
              {
                $project: {
                  username: 1,
                  email: 1,
                  dateOfBirth: 1,
                  gender: 1,
                  phoneNumber: 1,
                  appointments: {
                    doctorId: 1,
                    timestamp: 1,
                    status: 1
                  },
                  doctorsConsulted: {
                    _id: 1,
                    username: 1,
                    email: 1,
                    specialization: 1
                  },
                  diseasesDiagnosed: {
                    _id: 1,
                    name: 1,
                    description: 1
                  },
                  prescriptions: 1
                }
              }
    ]);
};

exports.getPatientsByAgeGroups = () => {
    return Patient.aggregate(
        [
            {
                $addFields: {
                  age: {
                    $floor: {
                      $divide: [
                        {
                          $subtract: [
                            new Date(),
                            "$dateOfBirth"
                          ]
                        },
                        1000 * 60 * 60 * 24 * 365.25
                      ]
                    }
                  }
                }
              },
              {
                $bucket: {
                  groupBy: "$age",
                  boundaries: [
                    0, 18, 30, 40, 50, 60, 70, 80, 90, 100
                  ],
                  default: "Other",
                  output: {
                    count: {
                      $sum: 1
                    },
                    patients: {
                      $push: {
                        username: "$username",
                        email: "$email",
                        age: "$age"
                      }
                    }
                  }
                }
              }
    ]);
};