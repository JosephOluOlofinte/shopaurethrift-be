import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// @desc Register user
// @route POST /api/v1/user/register
// @access Private/admin

export const registerUser = async (req, res) => {
  // Destructure incoming data
  const { fullname, email, password } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    // refuse registration

    return res.status(400).json({
      status: 'Error',
      message: 'Registration failed. User already exists.',
      error: error,
    });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  try {
    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      status: 'Success',
      message: 'User registered succesffully!',
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Something went wrong',
      error,
    });
  }
};
