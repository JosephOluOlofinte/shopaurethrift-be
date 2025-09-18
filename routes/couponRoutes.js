import express from 'express'
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createCoupon, getAllCoupons } from '../controllers/couponController.js';


const couponRoutes = express.Router();

couponRoutes.post('/', isLoggedIn, createCoupon)
couponRoutes.get('/', isLoggedIn, getAllCoupons);

export default couponRoutes;