import express from 'express'
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createCoupon, deleteCoupon, getAllCoupons, getCoupon, updateCoupon } from '../controllers/couponController.js';


const couponRoutes = express.Router();

couponRoutes.post('/', isLoggedIn, createCoupon)
couponRoutes.get('/', isLoggedIn, getAllCoupons);
couponRoutes.get('/:coupon', isLoggedIn, getCoupon);
couponRoutes.put('/:coupon', isLoggedIn, updateCoupon);
couponRoutes.put('/:coupon', isLoggedIn, deleteCoupon);

export default couponRoutes;