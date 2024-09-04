const express = require('express');
const router = express.Router();


const diseaseController = require('./controllers/diseases.controller');

router.get('/', diseaseController.getDiseases);
router.post('/', diseaseController.addDisease);
router.get('/:id', diseaseController.getDiseaseById);
router.put('/:id', diseaseController.editDiseaseById);
router.delete('/:id', diseaseController.deleteDisease);
router.get('/disease/:diseaseId',diseaseController.getDiseaseDetails);
router.get('/diseases/avgAgePerDisease',diseaseController.avgAgePerDisease);








module.exports = router;

