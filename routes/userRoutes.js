import express from 'express';
import {
  getAllUsers,
  getOneUser,
  getUserProfile,
  loginUser,
  registerUser,
} from '../controllers/userController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createShippingAddress } from '../controllers/shippingAddress.js';

const userRoutes = express.Router();

userRoutes.post('/login', loginUser);
userRoutes.post('/register', registerUser);
userRoutes.get('/', isLoggedIn, getAllUsers);
userRoutes.get('/:username', isLoggedIn, getOneUser);
userRoutes.get('/profile', isLoggedIn, getUserProfile);

// shipping address routes
userRoutes.post('/shipping-address', isLoggedIn, createShippingAddress);
userRoutes.get('shipping-address/:addressnickname', isLoggedIn, createShippingAddress);
userRoutes.put('/shipping-address/:addressnickname',
  isLoggedIn,
  createShippingAddress
);
userRoutes.delete(
  '/shipping-address/:addressnickname',
  isLoggedIn,
  createShippingAddress
);

export default userRoutes;
