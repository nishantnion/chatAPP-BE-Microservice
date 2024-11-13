require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoute');
// const consumeMessageFromQueue = require('./userService');
const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());


mongoose.connect('mongodb+srv://nishantsisodiya:4wiUCULHoY3a1XUT@chathub-cluster.mk2kv8m.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser:true,
  useUnifiedTopology:true
})
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error(err);
  });


  app.use('/auth', authRoutes);
  app.use('/', userRoutes);


  app.listen(port, () => {
    console.log(`User registration microservice started on port ${port}`);
  });