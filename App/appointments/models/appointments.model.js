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

exports.getAppointmentDetailsDaywise = async () => {
    return Appointment.aggregate([
        {
            $project: {
              dayOfWeek: {
                $dayOfWeek: "$timestamp"
              },
              patientId: 1,
              doctorId: 1,
              timestamp: 1,
              status: 1
            }
          },
          {
            $group: {
              _id: "$dayOfWeek",
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
              _id: 1
            }
          },
          {
            $project: {
              dayOfWeek: {
                $switch: {
                  branches: [
                    {
                      case: {$eq: ["$_id", 1]},then: "Sunday"
                    },
                    {
                      case: {$eq: ["$_id", 2]},then: "Monday"
                    },
                    {
                      case: {$eq: ["$_id", 3]},then: "Tuesday"
                    },
                    {
                      case: {$eq: ["$_id", 4]},then: "Wednesday"
                    },
                    {
                      case: {$eq: ["$_id", 5]},then: "Thursday"
                    },
                    {
                      case: {$eq: ["$_id", 6]},then: "Friday"
                    },
                    {
                      case: {$eq: ["$_id", 7]},then: "Saturday"
                    }
                  ],
                  default: "Unknown"
                }
              },
              totalAppointments: 1,
              appointments: 1
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

  exports.getMonthlyAppointmentsByDoctor = async (doctorId) => {
    return await Appointment.aggregate([
        {
            $match: { 
              doctorId:new mongoose.Types.ObjectId(doctorId) 
            }
          },
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

  exports.getDoctorUpcomingAppointments = async (doctorId) => {
    return await Appointment.aggregate([
      {
        $match: {
          doctorId:new mongoose.Types.ObjectId(doctorId),
          timestamp: {
            $gte: new Date()
          }
        }
      },
      {
        $lookup: {
          from: "patients",
          localField: "patientId",
          foreignField: "_id",
          as: "patientDetails"
        }
      },
      {
        $unwind: "$patientDetails"
      },
      {
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "_id",
          as: "doctorDetails"
        }
      },
      {
        $unwind: "$doctorDetails"
      },
      {
        $addFields: {
          doctorName: "$doctorDetails.username"
        }
      },
      {
        $project: {
          _id: 0,
          patientId: "$patientId",
          timestamp: "$timestamp",
          status: "$status",
          doctorName: "$doctorName",
          "patientDetails.username": 1,
          "patientDetails.email": 1
        }
      },
      {
        $sort: {
          timestamp: -1
        }
      }
    ]);
  };


  exports.getAppointmentsByDate = (date) => {
    return Appointment.aggregate([
        {
            $match: {
                timestamp: { $gte: new Date(date), $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)) }
            }
        },
        {
          $lookup: {
            from: "patients",
            localField: "patientId",
            foreignField: "_id",
            as: "patientDetails"
          }
        },
        {
          $lookup: {
            from: "doctors",
            localField: "doctorId",
            foreignField: "_id",
            as: "doctorDetails"
          }
        },
        {
          $unwind: "$patientDetails"
        },
        {
          $unwind: "$doctorDetails"
        },
        {
          $addFields: {
            doctorName: "$doctorDetails.username",
            patientName: "$patientDetails.username"
          }
        },
        {
          $project: {
            _id: 0,
            timestamp: "$timestamp",
            status: "$status",
            patientName: 1,
            doctorName: 1
          }
        }
    ]);
};

exports.getScheduledAppointments = async () => {
  return Appointment.aggregate([
    {
      $match: {
        status: "scheduled"
      }
    },
    {
      $lookup: {
        from: "patients",
        localField: "patientId",
        foreignField: "_id",
        as: "patientDetails"
      }
    },
    {
      $unwind: "$patientDetails"
    },
    {
      $lookup: {
        from: "doctors",
        localField: "doctorId",
        foreignField: "_id",
        as: "doctorDetails"
      }
    },
    {
      $unwind: "$doctorDetails"
    },
    {
      $addFields: {
        doctorName: "$doctorDetails.username",
        patientName: "$patientDetails.username"
      }
    },
    {
      $project: {
        _id: 0,
        timestamp: "$timestamp",
        status: "$status",
        patientName: 1,
        doctorName: 1
      }
    },
    {
      $sort: {
        timestamp: -1
      }
    }
  ]);
};

exports.getCompletedAppointments = async () => {
  return Appointment.aggregate([
    {
      $match: {
        status: "completed"
      }
    },
    {
      $lookup: {
        from: "patients",
        localField: "patientId",
        foreignField: "_id",
        as: "patientDetails"
      }
    },
    {
      $unwind: "$patientDetails"
    },
    {
      $lookup: {
        from: "doctors",
        localField: "doctorId",
        foreignField: "_id",
        as: "doctorDetails"
      }
    },
    {
      $unwind: "$doctorDetails"
    },
    {
      $addFields: {
        doctorName: "$doctorDetails.username",
        patientName: "$patientDetails.username"
      }
    },
    {
      $project: {
        _id: 0,
        timestamp: "$timestamp",
        status: "$status",
        patientName: 1,
        doctorName: 1
      }
    },
    {
      $sort: {
        timestamp: -1
      }
    }
  ]);
};

exports.getCanceledAppointments = async () => {
  return Appointment.aggregate([
    {
      $match: {
        status: "canceled"
      }
    },
    {
      $lookup: {
        from: "patients",
        localField: "patientId",
        foreignField: "_id",
        as: "patientDetails"
      }
    },
    {
      $unwind: "$patientDetails"
    },
    {
      $lookup: {
        from: "doctors",
        localField: "doctorId",
        foreignField: "_id",
        as: "doctorDetails"
      }
    },
    {
      $unwind: "$doctorDetails"
    },
    {
      $addFields: {
        doctorName: "$doctorDetails.username",
        patientName: "$patientDetails.username"
      }
    },
    {
      $project: {
        _id: 0,
        timestamp: "$timestamp",
        status: "$status",
        patientName: 1,
        doctorName: 1
      }
    },
    {
      $sort: {
        timestamp: -1
      }
    }
  ]);
};

