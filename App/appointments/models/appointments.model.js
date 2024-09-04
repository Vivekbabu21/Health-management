const mongoose = require('mongoose');
const APPOINTMENT_STATUS=require('../../../constants/status');
const moment = require('moment');

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  timestamp: { type: Date, required: true }, 
  status: { type: String, default: APPOINTMENT_STATUS.SCHEDULED }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

exports.addAppointment = (data) => {
    const appointment = new Appointment(data);
    return appointment.save();        
};

exports.getAppointments = ()=>{
    return Appointment.find();
}

exports.getAppointmentById = (appointmentId)=>{
    return Appointment.findById(appointmentId);
}

exports.editAppointmentById = (appointmentId,data)=>{
    return Appointment.findByIdAndUpdate(appointmentId,{ $set: data },{new:true});
}

exports.deleteTimestamp = (data)=>{
    return Appointment.findOneAndDelete(data);
}

exports.existingAppointment = (doctor_id,time)=>{
    const startTime = moment(time).utc().subtract(30, 'minutes').toDate();
    const endTime = moment(time).utc().add(30, 'minutes').toDate();
    return Appointment.findOne({
        doctorId:doctor_id,
        timestamp:{ $gte: startTime, $lte: endTime }
    });

}

exports.getAppointmentDetailsByDay = async () => {
    return Appointment.aggregate([
        {
            $project: {
                dayOfWeek: { $dayOfWeek: '$timestamp' } 
            }
        },
        {
            $group: {
                _id: '$dayOfWeek',
                totalAppointments: { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 } 
        },
        {
            $project: {
                dayOfWeek: {
                    $switch: {
                        branches: [
                            { case: { $eq: ['$_id', 1] }, then: 'Sunday' },
                            { case: { $eq: ['$_id', 2] }, then: 'Monday' },
                            { case: { $eq: ['$_id', 3] }, then: 'Tuesday' },
                            { case: { $eq: ['$_id', 4] }, then: 'Wednesday' },
                            { case: { $eq: ['$_id', 5] }, then: 'Thursday' },
                            { case: { $eq: ['$_id', 6] }, then: 'Friday' },
                            { case: { $eq: ['$_id', 7] }, then: 'Saturday' }
                        ],
                        default: 'Unknown'
                    }
                },
                totalAppointments: 1
            }
        }
    ]);
};

exports.getMonthlyAppointmentTrends = async () => {
    return await Appointment.aggregate([
        {
            $addFields: {
              month: {
                $month: "$timestamp"
              },
              year: {
                $year: "$timestamp"
              }
            }
          },
          {
            $group: {
              _id: {
                year: "$year",
                month: "$month"
              },
              totalAppointments: {
                $sum: 1
              },
              appointments: {
                $push: {
                  patientId: "$patientId",
                  doctorId: "$doctorId",
                  timestamp: "$timestamp",
                  status: "$status"
                }
              }
            }
          },
          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1
            }
          },
          {
            $project: {
              _id: 0,
              year: "$_id.year",
              month: "$_id.month",
              totalAppointments: 1,
              appointments: 1
            }
          }
    ]);
  };
