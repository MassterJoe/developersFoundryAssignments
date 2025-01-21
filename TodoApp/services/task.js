const Task = require('../models/Task');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); 
const logger = require('../config/logger');

exports.createTask = async (req, res) => {
  try {
    // Ensure the user is authenticated
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: No token provided. Please log in again.',
      });
    }

    // Verify JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Create a new task
    const { title, description, deadline, priority, status } = req.body;

    const newTask = new Task({
      user: userId,
      title,
      description,
      deadline,
      priority,
      status,
    });

    await newTask.save();

    logger.info(`Task created successfully for user ${userId}: ${title}`);
    // Respond with the created task
    res.status(201).json({
      status: 'success',
      message: 'Task created successfully!',
      task: newTask,
    });
  } catch (error) {
    logger.error(`Error creating task: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      status: 'error',
      message: 'Internal server error.',
    });
  }
};


// Controller to get tasks for the authenticated user
exports.getTasks = async (req, res) => {
  try {
    // Ensure the user is authenticated
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: No token provided. Please log in again.',
      });
    }

    // Verify JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Fetch tasks associated with the authenticated user
    const tasks = await Task.find({ user: userId });

    // If no tasks found, send a message
    if (tasks.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No tasks found for this user.',
      });
    }


    // Respond with the tasks
    res.status(200).json({
      status: 'success',
      message: 'Tasks fetched successfully.',
      tasks,
    });
  } catch (error) {
    logger.error(`Error fetching task: ${error.message}`, { stack: error.stack }); 
    res.status(500).json({
      status: 'error',
      message: 'Internal server error.',
    });
  }
};



// Controller to get a specific task by its ID
exports.getTaskById = async (req, res) => {
  const { taskId } = req.params;  // Extract taskId from the URL parameters

  // Validate that taskId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid task ID format.',
    });
  }

  try {
    // Ensure the user is authenticated
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: No token provided. Please log in again.',
      });
    }

    // Verify JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Find the task by its ID and ensure it belongs to the authenticated user
    const task = await Task.findOne({ _id: taskId, user: userId });

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found or not authorized to view this task.',
      });
    }

    // Respond with the task details
    res.status(200).json({
      status: 'success',
      message: 'Task fetched successfully.',
      task,
    });
  } catch (error) {
  logger.error(`Error fetching task by ID:,${ error.message }`, { stack: error.stack });
    res.status(500).json({
      status: 'error',
      message: 'Internal server error.',
    });
  }
};


// Controller to update a task
exports.updateTask = async (req, res) => {
  const { taskId } = req.params;  // Task ID from the URL parameter
  const { title, description, deadline, priority, status } = req.body;  // Data to update

  // Validate that taskId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid task ID format.',
    });
  }

  try {
    // Ensure the user is authenticated
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: No token provided. Please log in again.',
      });
    }

    // Verify JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Find the task by its ID
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found.',
      });
    }

    // Check if the task belongs to the authenticated user
    if (task.user.toString() !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to update this task.',
      });
    }

    // Update task details if provided
    task.title = title || task.title;
    task.description = description || task.description;
    task.deadline = deadline || task.deadline;
    task.priority = priority || task.priority;
    task.status = status || task.status;

    // Save the updated task
    await task.save();

    // Return the updated task in the response
    res.status(200).json({
      status: 'success',
      message: 'Task updated successfully.',
      task,
    });
  } catch (error) {
    logger.error(`Error updating task:, ${error.message}`, {stack: error.stack });
    res.status(500).json({
      status: 'error',
      message: 'Internal server error.',
    });
  }
};




// Controller to delete a task
exports.deleteTask = async (req, res) => {
  const { taskId } = req.params; // Task ID from the URL parameter
  

  try {
    // Ensure the user is authenticated
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized: No token provided. Please log in again.",
      });
    }

    // Verify JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Find the task by ID
    const task = await Task.findOne({ _id: taskId });

    if (!task) {
      return res.status(404).json({
        status: "error",
        message: "Task not found.",
      });
    }

    // Check if the task belongs to the authenticated user
    if (task.user.toString() !== userId) {
      return res.status(403).json({
        status: "error",
        message: "You are not authorized to delete this task.",
      });
    }

    // Delete the task using deleteOne
    await task.deleteOne();

    // Return success response
    res.status(200).json({
      status: "success",
      message: "Task deleted successfully.",
    });
  } catch (error) {
    logger.error(`Error deleting task:, ${ error.message }`, {stack: error.stack });
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};

exports.searchTasks = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: No token provided. Please log in again.',
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const query = req.query.query;
    console.log("Search query:", query);
    
    if (!query) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required.',
      });
    }

    // Ensure the query only targets title or description fields
    const tasks = await Task.find({
      user: userId,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    });

    if (tasks.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No tasks found matching the search criteria.',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Tasks fetched successfully.',
      tasks,
    });

  } catch (error) {
    logger.error(`Error searching tasks:, ${error.message}`, {stack: error.stack });
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error.',
    });
  }
};
