const express = require('express');
const router = express.Router();


const patientController = require('./controllers/patients.controller');

router.get('/', patientController.getPatients);
router.post('/', patientController.addPatient);
router.get('/:id', patientController.getPatientById);
router.put('/:id', patientController.editPatientById);
router.delete('/:id', patientController.deletePatient);
router.get('/getPatientDetails/:patientId',patientController.getPatientDetails);
router.get('/patient/patientsByAge',patientController.getPatientsByAgeGroups);








module.exports = router;

