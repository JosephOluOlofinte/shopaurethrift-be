import express from 'express';
import { createColor, deleteColor, getAllColors, getSingleColor, updateColor } from '../controllers/colorsController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const colorRoutes = express.Router();

colorRoutes.post('/', isLoggedIn, createColor);
colorRoutes.get('/', isLoggedIn, getAllColors);
colorRoutes.get('/:slug', isLoggedIn, getSingleColor);
colorRoutes.put('/:slug', isLoggedIn, updateColor);
colorRoutes.delete('/:slug', isLoggedIn, deleteColor);

export default colorRoutes;