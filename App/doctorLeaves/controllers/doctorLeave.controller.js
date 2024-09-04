const doctorLeaveModel = require('../models/doctorLeave.model');



exports.addLeave = async(req, res) => {
    try {
        const leave = await doctorLeaveModel.addLeave(req.body);
        res.status(200).send(leave);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while adding the leave.' });
    }
};