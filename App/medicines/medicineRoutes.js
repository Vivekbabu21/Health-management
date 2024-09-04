const express = require('express');
const router = express.Router();


const medicineController = require('./controllers/medicines.controller');

router.get('/', medicineController.getMedicines);
router.post('/', medicineController.addMedicine);
router.get('/:id', medicineController.getMedicineById);
router.put('/:id', medicineController.editMedicineById);
router.delete('/:id', medicineController.deleteMedicine);






module.exports = router;

