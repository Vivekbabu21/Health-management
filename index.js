const mongoose = require('mongoose');
const express = require('express');
const app = express();
// const usersRouter = require('./App/users/userRoutes');
const patientsRouter = require('./App/patients/patientRoutes');
const doctorsRouter = require('./App/doctors/doctorRoutes');
const appointmentsRouter = require('./App/appointments/appointmentRoutes');
const diseasesRouter = require('./App/diseases/diseaseRoutes');
const medicinesRouter = require('./App/medicines/medicineRoutes');
const prescriptionsRouter = require('./App/prescriptions/prescriptionRoutes');
const doctorLeavesRouter = require('./App/doctorLeaves/doctorLeaveRoutes');

require('dotenv').config();




const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

app.use(express.json());
// app.use('/users', usersRouter);
app.use('/patients', patientsRouter);
app.use('/doctors', doctorsRouter);
app.use('/appointments', appointmentsRouter);
app.use('/diseases', diseasesRouter);
app.use('/medicines', medicinesRouter);
app.use('/prescriptions', prescriptionsRouter);
app.use('/leave', doctorLeavesRouter);










const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});