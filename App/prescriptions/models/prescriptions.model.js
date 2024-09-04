const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  diseaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Disease', required: true },
  medicines: [{
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    dosage: { type: String, required: true },
    instructions:{ type: String, required: true }
  }],
  startDate: { type: Date, required: true },
  endDate: { type: Date }
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);


exports.addPrescription = (data) => {
    const prescription = new Prescription(data);
    return prescription.save();        
};

exports.getPrescriptions = ()=>{
    return Prescription.find();
}

exports.getPrescriptionById = (prescriptinId)=>{
    return Prescription.findById(prescriptinId);
}

exports.editPrescriptionById = (prescriptinId,data)=>{
    return Prescription.findByIdAndUpdate(prescriptinId,{ $set: data },{new:true});
}

exports.mostPrescribedMedicines = async()=>{
  return await Prescription.aggregate([
    {
      $unwind: "$medicines"
    },
    {
      $group: {
        _id: "$medicines.medicineId",
        count: {
          $sum: 1
        }
      }
    },
    {
      $lookup: {
        from: "medicines",
        localField: "_id",
        foreignField: "_id",
        as: "medicine"
      }
    },
    {
      $unwind: "$medicine"
    },
    {
      $project: {
        medicineName: "$medicine.name",
        description: "$medicine.description",
        count: 1
      }
    },
    {
      $sort: {
        count: -1
      }
    }

  ])
}
