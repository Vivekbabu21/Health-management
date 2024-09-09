const express = require('express');
const router = express.Router();


const appointmentController = require('./controllers/appointments.controller');


router.post('/', appointmentController.addAppointment);
router.get('/', appointmentController.getAppointments);
router.get('/scheduledAppointments', appointmentController.getScheduledAppointments);
router.get('/completedAppointments', appointmentController.getCompletedAppointments);
router.get('/canceledAppointments', appointmentController.getCanceledAppointments);
router.post('/complete', appointmentController.completeAppointment);
router.post('/cancel', appointmentController.cancelAppointment);
router.post('/reschedule', appointmentController.rescheduleAppointment);
router.get('/monthlyDetails', appointmentController.getMonthlyAppointmentTrends);
router.get('/dayWiseDetails', appointmentController.getAppointmentDetailsDaywise);
router.get('/monthlyDoctorAppointments/:doctorId', appointmentController.getMonthlyAppointmentsByDoctor);
router.get('/UpcomingDoctorAppointments/:doctorId', appointmentController.getDoctorUpcomingAppointments);
router.get('/appointmentsByDate/:date', appointmentController.getAppointmentsByDate);





module.exports = router;

