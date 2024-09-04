const mongoose = require('mongoose');

const doctorLeaveSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  leaveDate: { type: Date, required: true }
});

const DoctorLeave = mongoose.model('DoctorLeave', doctorLeaveSchema);

exports.addLeave = (data) => {
    const leave = new DoctorLeave(data);
    return leave.save();        
};

exports.findDoctorLeave = (doctorId,date)=>{
    return DoctorLeave.findOne({doctorId:doctorId,leaveDate:date})
}
