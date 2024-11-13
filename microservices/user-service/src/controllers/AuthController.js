const User = require('../models/user');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const amqp = require('amqplib');
// const { publishUserRegistrationEvent } = require('../services/amqpService');



//<<<<<<<======================  Register a new user ================>>>>>>>>

exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const newUser = new User({
      username,
      email,
      password,
      tokens: [],
    });

    await newUser.save();
    const authToken = await newUser.generateAuthToken();  
    
    // await publishAllUsersToQueue();
    return res.status(201).json({ message: 'User registered successfully' , token : authToken , success : true });
  } catch (error) {
    console.log('User Register error===>', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


//<<<<<<<======================  Login user ================>>>>>>>>


exports.login = async (req , res)=>{
  try {
    
    const {email , password} = req.body;

    const user = await User.findOne({email});

    if(!user){
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password , user.password)
    if(!isPasswordValid){
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const authToken = await user.generateAuthToken()
    return res.status(200).json({ message: 'Login successful', token: authToken , success : true });

  } catch (error) {
    console.log('User Register error===>', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}

