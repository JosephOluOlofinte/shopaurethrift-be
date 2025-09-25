import express from 'express';
import { createCategory, deleteCategory, getAllCategories, getSingleCategory, updateCategory } from '../controllers/categoriesController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import upload from '../config/fileUpload.js';

const categoryRoutes = express.Router();

categoryRoutes.post('/', isLoggedIn, upload.single('file'), createCategory);
categoryRoutes.get('/', isLoggedIn, getAllCategories);
categoryRoutes.get('/:slug', isLoggedIn, getSingleCategory);
categoryRoutes.put('/:slug', isLoggedIn, updateCategory);
categoryRoutes.delete('/:slug', isLoggedIn, deleteCategory);

export default categoryRoutes;