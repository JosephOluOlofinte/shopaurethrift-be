import express from 'express';
import { createNewProduct, deleteProduct, getProducts, getSingleProduct, updateProduct } from '../controllers/productController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const productRoutes = express.Router();

productRoutes.post('/', isLoggedIn, createNewProduct);
productRoutes.get('/', getProducts);
productRoutes.get('/:slug', getSingleProduct);
productRoutes.put('/:slug', isLoggedIn, updateProduct);
productRoutes.delete('/:slug', isLoggedIn, deleteProduct);

export default productRoutes;
