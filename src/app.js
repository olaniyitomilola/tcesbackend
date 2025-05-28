const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const vehicleRoutes = require('../routes/vehicleRoutes.js');
const staffRoute = require(`../routes/staffRoute.js`);
const authRoute = require('../routes/authRoute.js')
const garageRoute = require(`../routes/garageRoute.js`);
const clientRoute = require('../routes/clientRoute.js');
const projectRoute = require('../routes/projectRoute.js')
const errorHandler = require(`../middlewares/errorHandler.js`);


dotenv.config();
const app = express();

app.use(cors());

app.use(express.json());



//Routes

app.use(`/api/vehicles`, vehicleRoutes);
app.use(`/api/staff`,staffRoute);
app.use(`/api/auth`,authRoute);
app.use('/api/garage',garageRoute);
app.use('/api/client',clientRoute);
app.use('/api/projects',projectRoute);
//handle unknown routes
app.use((req, res) => {
  res.status(404).json({
      error: 'Route not found'
  });
});
//app.use(errorHandler)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});