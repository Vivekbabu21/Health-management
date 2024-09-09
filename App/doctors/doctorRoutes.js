const express = require('express');
const router = express.Router();


const doctorController = require('./controllers/doctors.controller');

router.get('/',doctorController.getDoctors);
router.post('/',doctorController.addDoctor);
router.get('/:id', doctorController.getDoctorById);
router.put('/:id', doctorController.editDoctorById);
router.delete('/:id', doctorController.deleteDoctor);
router.get('/doctorDetails/:doctorId',doctorController.getDoctorDetails);







module.exports = router;

