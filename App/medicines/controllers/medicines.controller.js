const medicineModel = require('../models/medicines.model');

exports.getMedicines = async(req, res) => {
    try {
        const medicines = await medicineModel.getMedicines();
        res.json(medicines);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while retrieving medicines.' });
    }
};

exports.addMedicine = async(req, res) => {
    try {
        const medicine = await medicineModel.addMedicine(req.body);
        res.status(200).send(medicine);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while adding the medicine.' });
    }
};

exports.getMedicineById = async (req, res) => {
    try {
        const medicine = await medicineModel.getMedicineById(req.params.id);
        if (!medicine) {
            return res.status(404).send({ message: 'Medicine not found.' });
        }
        res.status(200).send(medicine);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while fetching the medicine.' });
    }
};

exports.editMedicineById = async (req, res) => {
    try {
        const updatedMedicine = await medicineModel.editMedicineById(req.params.id, req.body);
        if (!updatedMedicine) {
            return res.status(404).send({ message: 'Medicine not found.' });
        }
        res.status(200).send(updatedMedicine);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while updating the medicine.' });
    }
};

exports.deleteMedicine = async (req, res) => {
    try {
        const deletedMedicine = await medicineModel.deleteMedicineById(req.params.id);
        res.status(200).send(deletedMedicine);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while deleting the medicine.' });
    }
};