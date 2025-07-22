import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.post('/api/v1/user/register', registerUser);
userRoutes.post('/api/v1/user/login', loginUser);

export default userRoutes;