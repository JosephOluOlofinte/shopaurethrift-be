import express from 'express';
import { createCategory } from '../controllers/categoriesController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const categoryRoutes = express.Router();

categoryRoutes.post('/', isLoggedIn, createCategory);

export default categoryRoutes;