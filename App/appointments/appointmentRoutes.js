const express = require('express');
const router = express.Router();


const appointmentController = require('./controllers/appointments.controller');


router.post('/', appointmentController.addAppointment);
router.post('/complete', appointmentController.completeAppointment);
router.post('/cancel', appointmentController.cancelAppointment);
router.post('/reschedule', appointmentController.rescheduleAppointment);
router.get('/monthlyDetails', appointmentController.getMonthlyAppointmentTrends);
router.get('/dayWiseDetails', appointmentController.getAppointmentDetailsByDay);










module.exports = router;

