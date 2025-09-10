import express from "express";
import { createOrder, getAllOrders, getOneOrder, updateOrder } from "../controllers/orderController.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const orderRoutes = express.Router();
orderRoutes.post('/', isLoggedIn, createOrder)
orderRoutes.get('/', isLoggedIn, getAllOrders);
orderRoutes.get('/:slug', isLoggedIn, getOneOrder);
orderRoutes.put('/update/:slug', isLoggedIn, updateOrder);
export default orderRoutes