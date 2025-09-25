import express from 'express';
import {
  getAllUsers,
  getOneUser,
  getUserProfile,
  loginUser,
  makeUserAdmin,
  registerUser,
  updateProfile,
} from '../controllers/userController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { isAdmin, isSuperAdmin } from '../middlewares/isAdmin.js';


const userRoutes = express.Router();

userRoutes.post('/login', loginUser);
userRoutes.post('/register', registerUser);
userRoutes.get('/', isLoggedIn, getAllUsers);
userRoutes.get('/profile', isLoggedIn, getUserProfile);
userRoutes.get('/:username', isLoggedIn, isAdmin, getOneUser);
userRoutes.put('/profile/update', isLoggedIn, updateProfile);
userRoutes.put('/edit/make-admin', isLoggedIn, isSuperAdmin, makeUserAdmin);


export default userRoutes;