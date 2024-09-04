const prescriptionModel = require('../models/prescriptions.model');



exports.addPrescription = async(req, res) => {
    try {
        const prescription = await prescriptionModel.addPrescription(req.body);
        res.status(200).send(prescription);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while adding the prescription.' });
    }
};