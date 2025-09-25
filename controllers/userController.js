import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
import { getTokenFromHeader } from '../utils/getTokenFromHeader.js';
import { verifyToken } from '../utils/verifyToken.js';
import {
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
} from '../constants/httpStatusCodes.js';
import getAndValidateUser from '../utils/getAndValidateUser.js';

// @desc get all users
// @route GET /api/v1/users/
// @access Private/admin
export const getAllUsers = async (req, res) => {
  const users = await User.find().populate('reviews');

  if (users.length < 1) {
    return res.status(NOT_FOUND).json({
      status: 'error',
      message: 'There are no registered users',
    });
  }

  return res.status(OK).json({
    status: 'success',
    message: 'Users fetched successfully',
    users,
  });
};

// @desc get one user
// @route GET /api/v1/users/:username
// @access Private/admin
export const getOneUser = async (req, res) => {
  const { username } = req.params;

  //check if user exists
  const user = await User.findOne({ username: username }).populate('reviews');

  if (!user) {
    return res.status(NOT_FOUND).json({
      status: 'error',
      message:
        'There are no existing users with the provided credentials. getOneUser',
    });
  }

  return res.status(OK).json({
    status: 'success',
    message: 'User fetched succesffully',
    user,
  });
};

// @desc Register user
// @route POST /api/v1/users/register
// @access Private/admin
export const registerUser = async (req, res) => {
  // Destructure incoming data
  const { fullname, username, email, password } = req.body;

  // Check if user exists and refuse duplicates
  const usernameExists = await User.findOne({ username: username });

  if (usernameExists) {
    return res.status(BAD_REQUEST).json({
      status: 'Error',
      message:
        'Registration failed. There is an exisitng account with this username.',
    });
  }

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return res.status(BAD_REQUEST).json({
      status: 'Error',
      message:
        'Registration failed. There is an exisitng account with this email address.',
    });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  try {
    const user = await User.create({
      fullname,
      username,
      slug: username.toLowerCase(),
      email,
      password: hashedPassword,
    });

    return res.status(CREATED).json({
      status: 'Success',
      message: 'User registered succesffully!',
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
      error,
    });
  }
};

// @desc Login user
// @route POST /api/v1/users/login
// @access public
export const loginUser = async (req, res) => {
  // Destructure incoming data
  const { email, password } = req.body;

  // Check if user exists by email
  const existingUser = await User.findOne({ email: email }).select('+password');
  if (!existingUser) {
    return res.status(NOT_FOUND).json({
      status: 'Error',
      message: 'These credentials do not match any account!',
    });
  }

  //Compare provided password with registered password
  const correctPassword = await bcrypt.compare(
    password,
    existingUser?.password
  );

  if (!correctPassword) {
    return res.status(NOT_FOUND).json({
      status: 'Error',
      message: 'These credentials do not match any account!',
    });
  }

  return res.status(OK).json({
    status: 'OK',
    message: 'Login successful!',
    existingUser,
    token: generateToken(existingUser?._id),
  });
};

// @desc User profile
// @route POST /api/v1/users/profile
// @access Private
export const getUserProfile = async (req, res) => {
  // find the user
  const user = await getAndValidateUser(
    req.userAuthId,
    'orders',
    'The provided user does not exist'
  );

  return res.json({
    status: 'success',
    message: 'User profile fetched succesffully',
    user,
  });
};


// @desc User profile
// @route PUT /api/v1/users/profile/update
// @access Private
export const updateProfile = async (req, res) => {
  // destructure incoming data
  const { fullname, email, password } = req.body;
  // find the user
  const user = await getAndValidateUser(req.userAuthId, 'You must be logged in to access this page');

  // update the user profile
  const updatedUser = await User.findByIdAndUpdate(user._id, {
    fullname
  },
    {
      new: true,
    }
  );

  return res.status(OK).json({
    status: '200. OK',
    message: 'Profile updated succesffully',
    updatedUser
  })
}

// @desc User profile
// @route PUT /api/v1/users/edit/make-admin
// @access Private/superAdmin
export const makeUserAdmin = async (req, res) => {
  // destructure incoming data
  const { username, isAdmin, isSuperAdmin, isModerator } = req.body;

  // update the user profile
  const user = await User.findOneAndUpdate(
    { username: username },
    { isAdmin, isSuperAdmin, isModerator },
    { new: true }
  );

  return res.status(OK).json({
    status: '200. OK',
    message: 'User updated succesffully',
    user
  })
}
