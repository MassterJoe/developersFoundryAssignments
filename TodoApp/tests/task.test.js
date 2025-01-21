const mongoose = require('mongoose');
const Task = require('../models/Task'); // Assuming the model file is in models directory
const User = require('../models/User'); // Assuming User model is available for creating tasks

describe('Task Model', () => {
  let user;

  // Create a user for associating tasks
  beforeAll(async () => {
    user = new User({
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password123',
    });

    await user.save();
  });

  it('should create a task with required fields', async () => {
    const task = new Task({
      user: user._id,
      title: 'Test Task',
      description: 'This is a test task.',
      deadline: new Date(),
      priority: 'medium',
      status: 'pending',
    });

    await task.save();

    expect(task.title).toBe('Test Task');
    expect(task.description).toBe('This is a test task.');
    expect(task.priority).toBe('medium');
    expect(task.status).toBe('pending');
    expect(task.user.toString()).toBe(user._id.toString()); // Check user reference
  });

  it('should throw an error if required fields are missing', async () => {
    const task = new Task({
      user: user._id,
      // Missing title
      description: 'This is a test task.',
      deadline: new Date(),
    });

    let error;
    try {
      await task.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.title).toBeDefined();
  });

  it('should accept valid priority values', async () => {
    const taskLow = new Task({
      user: user._id,
      title: 'Low Priority Task',
      description: 'Task with low priority.',
      deadline: new Date(),
      priority: 'low',
      status: 'pending',
    });

    const taskMedium = new Task({
      user: user._id,
      title: 'Medium Priority Task',
      description: 'Task with medium priority.',
      deadline: new Date(),
      priority: 'medium',
      status: 'pending',
    });

    const taskHigh = new Task({
      user: user._id,
      title: 'High Priority Task',
      description: 'Task with high priority.',
      deadline: new Date(),
      priority: 'high',
      status: 'pending',
    });

    await taskLow.save();
    await taskMedium.save();
    await taskHigh.save();

    expect(taskLow.priority).toBe('low');
    expect(taskMedium.priority).toBe('medium');
    expect(taskHigh.priority).toBe('high');
  });

  it('should throw an error if an invalid priority is provided', async () => {
    const task = new Task({
      user: user._id,
      title: 'Invalid Priority Task',
      description: 'Task with invalid priority.',
      deadline: new Date(),
      priority: 'invalid', // Invalid priority
      status: 'pending',
    });

    let error;
    try {
      await task.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.priority).toBeDefined();
  });

  it('should accept valid status values', async () => {
    const taskPending = new Task({
      user: user._id,
      title: 'Pending Task',
      description: 'Task with pending status.',
      deadline: new Date(),
      priority: 'medium',
      status: 'pending',
    });

    const taskInProgress = new Task({
      user: user._id,
      title: 'In Progress Task',
      description: 'Task with in progress status.',
      deadline: new Date(),
      priority: 'medium',
      status: 'in progress',
    });

    const taskCompleted = new Task({
      user: user._id,
      title: 'Completed Task',
      description: 'Task with completed status.',
      deadline: new Date(),
      priority: 'medium',
      status: 'completed',
    });

    await taskPending.save();
    await taskInProgress.save();
    await taskCompleted.save();

    expect(taskPending.status).toBe('pending');
    expect(taskInProgress.status).toBe('in progress');
    expect(taskCompleted.status).toBe('completed');
  });

  it('should throw an error if an invalid status is provided', async () => {
    const task = new Task({
      user: user._id,
      title: 'Invalid Status Task',
      description: 'Task with invalid status.',
      deadline: new Date(),
      priority: 'medium',
      status: 'invalid', // Invalid status
    });

    let error;
    try {
      await task.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.status).toBeDefined();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});
    mongoose.connection.close();
  });
});
