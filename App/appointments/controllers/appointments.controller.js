const appointmentModel = require('../models/appointments.model');
const doctorModel = require('../../doctors/models/doctors.model');
const doctorLeaveModel = require('../../doctorLeaves/models/doctorLeave.model');
const APPOINTMENT_STATUS = require('../../../constants/status');
const moment = require('moment');





exports.addAppointment = async(req, res) => {
    try {
        const appointmentTimestamp = moment(req.body.timestamp).utc();

        if (appointmentTimestamp.isBefore(moment().utc())) {
            return res.status(400).send("Cannot book an appointment for a past date.");
        }

        const formattedDate = appointmentTimestamp.format('YYYY-MM-DD');

        const isDoctorOnLeave = await doctorLeaveModel.findDoctorLeave(req.body.doctorId,formattedDate);
        if(isDoctorOnLeave){
            return res.status(400).send("Doctor is on Leave");
        }

        const isAvailable = await doctorModel.isDoctorAvailableForAppointment(req.body.doctorId,req.body.timestamp);
        if(!isAvailable){
            return res.status(400).send("Doctor is not available");
        }

        const isAppointmentExist = await appointmentModel.existingAppointment(req.body.doctorId,req.body.timestamp);
        if(isAppointmentExist){
            const conflictingTime = moment(isAppointmentExist.timestamp).utc().format('YYYY-MM-DD HH:mm:ss');
            const nextAvailableTime = moment(isAppointmentExist.timestamp).utc().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
            
            return res.status(400).send(`Appointment already exists at ${conflictingTime}. Please book after ${nextAvailableTime}.`);
       
        }
        const appointment = await appointmentModel.addAppointment(req.body);
        res.status(200).send(appointment);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while adding the appointment.' });
    }
};

exports.completeAppointment = async(req, res) => {
    try {
        const { appointmentId } = req.body;

        if (!appointmentId) {
            return res.status(400).send({ message: 'Appointment ID is required.' });
        }

        const appointment = await appointmentModel.getAppointmentById(appointmentId);
        if (!appointment) {
            return res.status(404).send({ message: 'Appointment not found.' });
        }

        if (appointment.status === APPOINTMENT_STATUS.COMPLETED) {
            return res.status(400).send({ message: 'Appointment is already completed.' });
        }

        const updatedAppointment = await appointmentModel.editAppointmentById(appointmentId, { status: APPOINTMENT_STATUS.COMPLETED });
        if (!updatedAppointment) {
            return res.status(404).send({ message: 'Appointment not found.' });
        }

        res.status(200).send(updatedAppointment);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while completing the appointment.' });
    }
};

exports.cancelAppointment = async(req, res) => {
    try {
        const { appointmentId } = req.body;

        if (!appointmentId) {
            return res.status(400).send({ message: 'Appointment ID is required.' });
        }

        const appointment = await appointmentModel.getAppointmentById(appointmentId);
        if (!appointment) {
            return res.status(404).send({ message: 'Appointment not found.' });
        }

        if (appointment.status === APPOINTMENT_STATUS.CANCELED) {
            return res.status(400).send({ message: 'Appointment is already canceled.' });
        }

        const updatedAppointment = await appointmentModel.editAppointmentById(appointmentId, { status: APPOINTMENT_STATUS.CANCELED,timestamp:null});
        if (!updatedAppointment) {
            return res.status(404).send({ message: 'Appointment not found.' });
        }

        res.status(200).send(updatedAppointment);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while canceling the appointment.' });
    }
};

exports.rescheduleAppointment = async(req, res) => {
    try {
        const { appointmentId,timestamp } = req.body;

        if (!appointmentId) {
            return res.status(400).send({ message: 'Appointment ID is required.' });
        }

        if (!timestamp) {
            return res.status(400).send({ message: 'Provide rescheduling time.' });
        }

        const appointment = await appointmentModel.getAppointmentById(appointmentId);
        if (!appointment) {
            return res.status(404).send({ message: 'Appointment not found.' });
        }
        const appointmentDetails =await appointmentModel.getAppointmentById(appointmentId);

        const appointmentTimestamp = moment(req.body.timestamp).utc();

        if (appointmentTimestamp.isBefore(moment().utc())) {
            return res.status(400).send("Cannot book an appointment for a past date.");
        }

        const formattedDate = appointmentTimestamp.format('YYYY-MM-DD');

        const isDoctorOnLeave = await doctorLeaveModel.findDoctorLeave(appointmentDetails.doctorId,formattedDate);
        if(isDoctorOnLeave){
            return res.status(400).send("Doctor is on Leave");
        }

        const isAvailable = await doctorModel.isDoctorAvailableForAppointment(appointmentDetails.doctorId,req.body.timestamp);
        if(!isAvailable){
            return res.status(400).send("Doctor is not available");
        }

        const isAppointmentExist = await appointmentModel.existingAppointment(appointmentDetails.doctorId,req.body.timestamp);
        if(isAppointmentExist){
            const conflictingTime = moment(isAppointmentExist.timestamp).utc().format('YYYY-MM-DD HH:mm:ss');
            const nextAvailableTime = moment(isAppointmentExist.timestamp).utc().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
            
            return res.status(400).send(`Appointment already exists at ${conflictingTime}. Please book after ${nextAvailableTime}.`);
       
        }

        const updatedAppointment = await appointmentModel.editAppointmentById(appointmentId, { status: APPOINTMENT_STATUS.RESCHEDULED,timestamp:timestamp });
        if (!updatedAppointment) {
            return res.status(404).send({ message: 'Appointment not found.' });
        }

        res.status(200).send(updatedAppointment);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while rescheduling the appointment.' });
    }
};

exports.getMonthlyAppointmentTrends = async(req, res) => {
    try {
        const monthlyAppointmentTrends = await appointmentModel.getMonthlyAppointmentTrends();
        res.status(200).send(monthlyAppointmentTrends);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while getting details.' });
    }
};

exports.getAppointmentDetailsByDay = async(req, res) => {
    try {
        const appointmentDetailsByDay = await appointmentModel.getAppointmentDetailsByDay();
        res.status(200).send(appointmentDetailsByDay);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while getting details.' });
    }
};

exports.getMonthlyAppointmentsByDoctor = async(req, res) => {
    try {
        const monthlyAppointmentTrends = await appointmentModel.getMonthlyAppointmentsByDoctor(req.params.doctorId);
        res.status(200).send(monthlyAppointmentTrends);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while getting details.' });
    }
};

exports.getDoctorUpcomingAppointments = async(req, res) => {
    try {
        const upcomingAppointments = await appointmentModel.getDoctorUpcomingAppointments(req.params.doctorId);
        res.status(200).send(upcomingAppointments);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while getting details.' });
    }
};

exports.getAppointmentsAndPrescriptionsByDate = async(req, res) => {
    try {
        const upcomingAppointments = await appointmentModel.getAppointmentsAndPrescriptionsByDate(req.params.date);
        res.status(200).send(upcomingAppointments);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while getting details.' });
    }
};