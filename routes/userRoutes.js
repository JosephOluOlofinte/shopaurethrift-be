import express from "express";
import { registerUser } from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.post('/api/v1/user/register', registerUser);

export default userRoutes;