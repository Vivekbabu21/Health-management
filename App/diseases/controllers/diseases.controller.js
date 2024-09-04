const diseaseModel = require('../models/diseases.model');

exports.getDiseases = async(req, res) => {
    try {
        const diseases = await diseaseModel.getDiseases();
        res.json(diseases);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while retrieving diseases.' });
    }
};

exports.addDisease = async(req, res) => {
    try {
        const disease = await diseaseModel.addDisease(req.body);
        res.status(200).send(disease);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while adding the disease.' });
    }
};

exports.getDiseaseById = async (req, res) => {
    try {
        const disease = await diseaseModel.getDiseaseById(req.params.id);
        if (!disease) {
            return res.status(404).send({ message: 'Disease not found.' });
        }
        res.status(200).send(disease);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while fetching the disease.' });
    }
};

exports.editDiseaseById = async (req, res) => {
    try {
        const updatedDisease = await diseaseModel.editDiseaseById(req.params.id, req.body);
        if (!updatedDisease) {
            return res.status(404).send({ message: 'Disease not found.' });
        }
        res.status(200).send(updatedDisease);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while updating the Disease.' });
    }
};

exports.deleteDisease = async (req, res) => {
    try {
        const deletedDisease = await diseaseModel.deleteDiseaseById(req.params.id);
        res.status(200).send(deletedDisease);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while deleting the disease.' });
    }
};

exports.getDiseaseDetails = async(req,res)=>{
    try {
        const diseaseDetails = await diseaseModel.diseaseDetails(req.params.diseaseId);
        res.status(200).send(diseaseDetails);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while fetching the disease details.' });
    }

}

exports.avgAgePerDisease = async(req,res)=>{
    try {
        const diseaseDetails = await diseaseModel.avgAgePerDisease();
        res.status(200).send(diseaseDetails);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while fetching the disease details.' });
    }

}
