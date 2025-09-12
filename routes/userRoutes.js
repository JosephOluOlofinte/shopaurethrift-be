import express from 'express';
import {
  getAllUsers,
  // getOneUser,
  getUserProfile,
  loginUser,
  registerUser,
} from '../controllers/userController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';


const userRoutes = express.Router();

userRoutes.post('/login', loginUser);
userRoutes.post('/register', registerUser);
userRoutes.get('/', isLoggedIn, getAllUsers);
// userRoutes.get('/:username', isLoggedIn, getOneUser);
userRoutes.get('/profile', isLoggedIn, getUserProfile);

export default userRoutes;