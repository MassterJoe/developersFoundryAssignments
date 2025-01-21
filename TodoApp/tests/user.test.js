const mongoose = require('mongoose');
const User = require('../models/User');

beforeAll(async () => {
  // Set up a test database connection (you can replace the URL with your test database URL)
  await mongoose.connect('mongodb://localhost:27017/test_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Clean up after tests by closing the database connection
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('User Model', () => {
  it('should hash password before saving', async () => {
    const user = new User({
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password123',
    });

    // Save the user
    await user.save();

    // Check that the password is hashed
    expect(user.password).not.toBe('password123');
    // Optionally, you can also check the structure of the hashed password
    expect(user.password).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash pattern
  });

  it('should compare passwords correctly', async () => {
    const user = new User({
      name: 'Jane Doe',
      username: 'janedoe',
      email: 'jane@example.com',
      password: 'password123',
    });

    // Save the user
    await user.save();

    // Check if the password matches
    const isMatch = await user.comparePassword('password123');
    expect(isMatch).toBe(true);

    // Check if a wrong password does not match
    const isMismatch = await user.comparePassword('wrongpassword');
    expect(isMismatch).toBe(false);
  });
});

