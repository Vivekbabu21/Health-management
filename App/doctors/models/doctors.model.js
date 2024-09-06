const mongoose = require('mongoose');
const moment = require('moment');

const doctorSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },  
  specialization: { type: String, required: true },
  workingHours: [{
    day: { type: String, required: true },  
    startTime: { type: String, required: true }, 
    endTime: { type: String, required: true }    
  }],
});

const Doctor = mongoose.model('Doctor', doctorSchema);

exports.addDoctor = (data) => {
    const doctor = new Doctor(data);
    return doctor.save();        
};

// exports.getDoctors = ()=>{
//     return Doctor.find();
// }

exports.getDoctorById = (doctorId)=>{
    return Doctor.findById(doctorId);
}

exports.editDoctorById = (doctorId,data)=>{
    return Doctor.findByIdAndUpdate(doctorId,{ $set: data },{new:true});
}

exports.deleteDoctorById = (doctorId)=>{
    return Doctor.findByIdAndDelete(doctorId);
}

exports.isDoctorAvailableForAppointment =async(doctorId, timestamp)=>{
    const doctor =await Doctor.findById(doctorId);
    if (!doctor) {
        throw new Error('Doctor not found');
      }

    const appointmentTime = moment(timestamp).utc();

        const appointmentDay = appointmentTime.format('dddd'); 
        const appointmentHour = appointmentTime.format('HH:mm');


    return doctor.workingHours.some(hours => 
        hours.day  === appointmentDay  && 
        appointmentHour  >= hours.startTime && 
        appointmentHour  <= hours.endTime
    );
}

exports.doctorDetails = (doctorId) => {
    return Doctor.aggregate([
        [
            { $match: { _id:new mongoose.Types.ObjectId(doctorId) } },
          
                 {
                  $lookup: {
                    from: 'appointments',
                    localField: '_id',
                    foreignField: 'doctorId',
                    as: 'appointments'
                  }
                },
                {
                  $lookup: {
                    from: 'prescriptions',
                    localField: '_id',
                    foreignField: 'doctorId',
                    as: 'prescriptions'
                  }
                },
                {
                  $lookup: {
                    from: 'diseases',
                    localField: 'prescriptions.diseaseId',
                    foreignField: '_id',
                    as: 'diseasesTreated'
                  }
                },
                {
                  $lookup: {
                    from: 'medicines',
                    localField: 'prescriptions.medicines.medicineId',
                    foreignField: '_id',
                    as: 'medicinesPrescribed'
                  }
                },
          
                {
                  $lookup: {
                    from: 'patients',
                    localField: 'appointments.patientId',
                    foreignField: '_id',
                    as: 'patientsTreated'
                  }
                },
          
                {
                  $lookup: {
                    from: 'doctorleaves',
                    localField: '_id',
                    foreignField: 'doctorId',
                    as: 'leaves'
                  }
                },
          
                {
                  $project: {
                    username: 1,
                    email: 1,
                    specialization: 1,
                    workingHours: 1,
                    appointments: {
                      patientId: 1,
                      timestamp: 1,
                      status: 1,
                    },
                    patientsTreated: {
                      _id: 1,
                      username: 1,
                      email: 1,
                    },
                    medicinesPrescribed: {
                      _id: 1,
                      name: 1,
                      description: 1,
                    },
                    diseasesTreated: {
                      _id: 1,
                      name: 1,
                      description: 1,
                    },
                    leaves: 1,
                    prescriptions: {
                      diseaseId: 1,
                      medicines: 1,
                      startDate: 1,
                      endDate: 1,
                    }
                  }
                }
          ]
    ]);
};



