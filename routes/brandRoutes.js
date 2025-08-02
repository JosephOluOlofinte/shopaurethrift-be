import express from 'express';
import { createBrand, deleteBrand, getAllBrands, getSingleBrand, updateBrand } from '../controllers/brandsController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const brandRoutes = express.Router();

brandRoutes.post('/', isLoggedIn, createBrand);
brandRoutes.get('/', isLoggedIn, getAllBrands);
brandRoutes.get('/:slug', isLoggedIn, getSingleBrand);
brandRoutes.put('/:slug', isLoggedIn, updateBrand);
brandRoutes.delete('/:slug', isLoggedIn, deleteBrand);

export default brandRoutes;