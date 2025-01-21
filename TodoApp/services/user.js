const User = require('../models/User');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');


// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Validate input fields
    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required: name, username, email, and password.' });
    }

    // Check if the email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res.status(400).json({
        error: 'A user with this email or username already exists. Please try a different one.',
      });
    }

    // Create and save the new user
    const user = new User({ name, username, email, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    // Log detailed error information
    logger.error('Error during user registration', {
      message: error.message,
      stack: error.stack,
      additionalInfo: {
        body: req.body,
        endpoint: req.originalUrl,
        method: req.method,
      },
    });

    // Respond with a generic error message for unexpected errors
    res.status(500).json({
      error: 'An unexpected error occurred while registering the user. Please try again later.',
    });
  }
};



// Login a user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({
        error: 'Both email and password are required to log in.',
      });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials. Please check your email or password.',
      });
    }

    // Verify the password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials. Please check your email or password.',
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Send response with token and user details
    res.status(200)
    .header('Authorization', `Bearer ${token}`)
    .json({
      message: 'Login successful',
      userId: user._id,
      username: user.username,
    });
  } catch (error) {
    // Log detailed error information
    logger.error('Error during user login', {
      message: error.message,
      stack: error.stack,
      additionalInfo: {
        body: req.body,
        endpoint: req.originalUrl,
        method: req.method,
      },
    });

    // Respond with a generic error message for unexpected errors
    res.status(500).json({
      error: 'An unexpected error occurred while logging in. Please try again later.',
    });
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
