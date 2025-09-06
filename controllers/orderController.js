import { OK } from "../app/constants/httpStatusCodes.js";
import Order from "../models/Order.js";

// @desc create orders
// @route Post /api/v1/orders
// @access private

export const createOrder = async (req, res) => {
    return res.status(OK).json({
        status: 'success',
        message: 'Welcome to the order controller'
    })
}