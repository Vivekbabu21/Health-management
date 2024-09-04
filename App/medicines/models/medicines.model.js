const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }
});

const Medicine = mongoose.model('Medicine', medicineSchema);


exports.addMedicine = (data) => {
    const medicine = new Medicine(data);
    return medicine.save();        
};

exports.getMedicines = ()=>{
    return Medicine.find();
}

exports.getMedicineById = (medicineId)=>{
    return Medicine.findById(medicineId);
}

exports.editMedicineById = (medicineId,data)=>{
    return Medicine.findByIdAndUpdate(medicineId,{ $set: data },{new:true});
}

exports.deleteMedicineById = (medicineId)=>{
    return Medicine.findByIdAndDelete(medicineId);
}