import express from 'express';
import { createReviews } from '../controllers/reviewsController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const reviewRoutes = express.Router();

reviewRoutes.post('/', isLoggedIn, createReviews);

export default reviewRoutes;