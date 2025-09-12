import express from "express";
import { createOrder, deleteOrder, getAllOrders, getOneOrder, updateOrder } from "../controllers/orderController.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const orderRoutes = express.Router();
orderRoutes.post('/', isLoggedIn, createOrder)
orderRoutes.get('/', isLoggedIn, getAllOrders);
orderRoutes.get('/:username/:orderNumber', isLoggedIn, getOneOrder);
orderRoutes.put('/:username/:orderNumber', isLoggedIn, updateOrder);
orderRoutes.delete('/:username/:orderNumber', isLoggedIn, deleteOrder);
export default orderRoutes;