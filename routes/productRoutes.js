import express from 'express';
import { createNewProduct, getProducts } from '../controllers/productController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const productRoutes = express.Router();

productRoutes.post('/', isLoggedIn, createNewProduct);
productRoutes.get('/', getProducts);

export default productRoutes;
