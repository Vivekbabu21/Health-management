const patientModel = require('../models/patients.model');

exports.getPatients = async(req, res) => {
    try {
        const patients = await patientModel.getPatients();
        res.json(patients);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while retrieving patients.' });
    }
};

exports.addPatient = async(req, res) => {
    try {
        const patient = await patientModel.addPatient(req.body);
        res.status(200).send(patient);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while adding the patient.' });
    }
};

exports.getPatientById = async (req, res) => {
    try {
        const patient = await patientModel.getPatientById(req.params.id);
        if (!patient) {
            return res.status(404).send({ message: 'Patient not found.' });
        }
        res.status(200).send(patient);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while fetching the patient.' });
    }
};

exports.editPatientById = async (req, res) => {
    try {
        const updatedPatient = await patientModel.editPatientById(req.params.id, req.body);
        if (!updatedPatient) {
            return res.status(404).send({ message: 'Patient not found.' });
        }
        res.status(200).send(updatedPatient);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while updating the patient.' });
    }
};

exports.deletePatient = async (req, res) => {
    try {
        const deletedPatient = await patientModel.deletePatientById(req.params.id);
        res.status(200).send(deletedPatient);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while deleting the patient.' });
    }
};

exports.getPatientDetails = async(req,res)=>{
    try {
        const patientDetails = await patientModel.patientDetails(req.params.patientId);
        res.status(200).send(patientDetails);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while fetching the patient details.' });
    }

}

exports.getPatientsByAgeGroups = async(req,res)=>{
    try {
        const patientDetails = await patientModel.getPatientsByAgeGroups();
        res.status(200).send(patientDetails);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while fetching the patient details.' });
    }

}
