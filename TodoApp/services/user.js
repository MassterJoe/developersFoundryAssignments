const User = require('../models/User');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const user = new User({ name, username, email, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    logger.error(`Error registering successfully: ${error.message}`, { stack: error.stack });
    res.status(400).json({ error: error.message });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });


    // Send response with token and user details
    res.status(200).json({ 
      message: 'Login successful', 
      token, 
      userId: user._id, 
      username: user.username 
    });
    
  } catch (error) {
    logger.error(`Error login in: ${error.message}`, { stack: error.stack });
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUser = async (req, res) => {
  const authHeader = req.headers.authorization;
 
  const token = authHeader && authHeader.split(" ")[1];
 
  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized: No token provided. Please log in again.",
    });
  }

  try {
    // Verify the JWT
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
 
    const userId = decodedToken.userId;

    // Fetch the user by ID
    const user = await User.findById(userId).populate("tasks");
 
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found. Please log in again.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User record fetched successfully.",
      data: user,
    });
  } catch (error) {
    logger.error(`Error fetching user record: ${error.message}`, { stack: error.stack });
    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
