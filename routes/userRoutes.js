import express from 'express';
import {
  getUserProfile,
  loginUser,
  registerUser,
} from '../controllers/userController.js';

const userRoutes = express.Router();

userRoutes.post('/register', registerUser);
userRoutes.post('/login', loginUser);
userRoutes.get('/profile', getUserProfile);

export default userRoutes;
