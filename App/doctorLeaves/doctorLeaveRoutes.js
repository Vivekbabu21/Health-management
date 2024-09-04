const express = require('express');
const router = express.Router();


const doctorLeaveController = require('./controllers/doctorLeave.controller');


router.post('/',doctorLeaveController.addLeave);





module.exports = router;

