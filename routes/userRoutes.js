import express from 'express';
import {
  getAllUsers,
  getOneUser,
  getUserProfile,
  loginUser,
  registerUser,
} from '../controllers/userController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import {
  createShippingAddress,
  getShippingAddress,
} from '../controllers/shippingAddress.js';

export const userRoutes = express.Router();

userRoutes.post('/login', loginUser);
userRoutes.post('/register', registerUser);
userRoutes.get('/', isLoggedIn, getAllUsers);
userRoutes.get('/:username', isLoggedIn, getOneUser);
userRoutes.get('/profile', isLoggedIn, getUserProfile);

// shipping address routes
export const shippingAddressRoutes = express.Router();

shippingAddressRoutes.post(
  '/shipping-address',
  isLoggedIn,
  createShippingAddress
);
shippingAddressRoutes.get('/shipping-address', isLoggedIn, getShippingAddress);
shippingAddressRoutes.get('/:addressnickname', isLoggedIn, getShippingAddress);
shippingAddressRoutes.put(
  '/shipping-address/:addressnickname',
  isLoggedIn,
  createShippingAddress
);
shippingAddressRoutes.delete(
  '/shipping-address/:addressnickname',
  isLoggedIn,
  createShippingAddress
);
