const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const patientRoutes = require('./routes/patientRoutes')
const appointmentRoutes = require('./routes/appointmentRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const patientHealthMetricsRoutes = require('./routes/patientHealthMetricsRoutes');
const { verifyToken } = require('./jwt-middleware');


const app = express();
app.use(bodyParser.json());

//!______________________________________________________________________________________________
// Use a configuration object for more control over CORS
const corsOptions = {
   origin: [
   'http://localhost:5173',  // Allow requests from your development server
      'https://tiny-churros-d64551.netlify.app/',// Allow requests from your Netlify deployment
  // Add any other origins that should be allowed here
  ],
 methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify allowed HTTP methods
  credentials: true, // If you need to handle cookies, authorization headers, etc.
  };
  app.use(cors(corsOptions)); // Use the cors middleware with the configuration
//!______________________________________________________________________________________________


//!______________________________________________________________________________________________
// MongoDB Connection
// mongodb+srv;//test:<123>@testing.nnnbqo7.mongodb.net/?retryWrites=true&w=majority&appName=Testing;
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

//!______________________________________________________________________________________________
  
mongoose.connection.on('connected', () => console.log('Connected to MongoDB'));
mongoose.connection.on('error', (err) => console.log('Error connecting to MongoDB:', err));

app.use('/api/doctors', doctorRoutes);
app.use(verifyToken)
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/patient-health-metrics', patientHealthMetricsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
