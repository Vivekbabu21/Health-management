const express = require('express');
const router = express.Router();


const prescriptionController = require('./controllers/prescriptions.controller');


router.post('/', prescriptionController.addPrescription);





module.exports = router;

