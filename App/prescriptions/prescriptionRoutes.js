const express = require('express');
const router = express.Router();


const prescriptionController = require('./controllers/prescriptions.controller');


router.post('/', prescriptionController.addPrescription);
router.get('/', prescriptionController.getPrescriptions);
router.get('/mostPrescribedMedicines', prescriptionController.mostPrescribedMedicines);






module.exports = router;

