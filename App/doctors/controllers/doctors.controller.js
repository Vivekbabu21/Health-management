const doctorModel = require('../models/doctors.model');

exports.getDoctors = async(req, res) => {
    try {
        const doctors = await doctorModel.getDoctors();
        res.json(doctors);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while retrieving doctors.' });
    }
};

exports.addDoctor = async(req, res) => {
    try {
        const doctor = await doctorModel.addDoctor(req.body);
        res.status(200).send(doctor);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while adding the doctor.' });
    }
};

exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await doctorModel.getDoctorById(req.params.id);
        if (!doctor) {
            return res.status(404).send({ message: 'Doctor not found.' });
        }
        res.status(200).send(doctor);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while fetching the Doctor.' });
    }
};

exports.editDoctorById = async (req, res) => {
    try {
        const updatedDoctor = await doctorModel.editDoctorById(req.params.id, req.body);
        if (!updatedDoctor) {
            return res.status(404).send({ message: 'Doctor not found.' });
        }
        res.status(200).send(updatedDoctor);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while updating the doctor.' });
    }
};

exports.deleteDoctor = async (req, res) => {
    try {
        const deletedDoctor = await doctorModel.deleteDoctorById(req.params.id);
        res.status(200).send(deletedDoctor);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while deleting the doctor.' });
    }
};

exports.getDoctorDetails = async(req,res)=>{
    try {
        const doctorDetails = await doctorModel.doctorDetails(req.params.doctorId);
        res.status(200).send(doctorDetails);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while fetching the doctor details.' });
    }

}