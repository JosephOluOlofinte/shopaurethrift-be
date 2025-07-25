import express from 'express';
import { createNewProduct } from '../controllers/productController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const productRoutes = express.Router();

productRoutes.post('/create-new', isLoggedIn, createNewProduct);

export default productRoutes;
