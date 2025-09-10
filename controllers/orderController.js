import dotenv from 'dotenv';
dotenv.config();
import {
  BAD_REQUEST,
  NOT_FOUND,
  OK,
} from '../app/constants/httpStatusCodes.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Stripe from 'stripe';

// @desc create orders
// @route Post /api/v1/orders
// @access private
export const createOrder = async (req, res) => {
  // get the payload (customer, orderItems, shippingAddress, totalPrice)
  const { orderItems, shippingAddress, totalPrice } = req.body;

  // find and validate the user
  const user = await User.findById(req.userAuthId);
  if (!user) {
    return req.status(NOT_FOUND).json({
      status: '404 - User not found',
      message: 'You must be logged in to place an order.',
    });
  }

  // check if user has shipping address
  if (user.hasShippingAddress == false) {
    return res.status(NOT_FOUND).json({
      status: '404. Error',
      message: 'You must add a shipping address to place an order.',
    });
  }

  // check if order is not empty
  if (orderItems.length <= 0) {
    return res.status(BAD_REQUEST).json({
      status: 'Error. Bad request',
      message: 'You have not selected any products',
    });
  }

  // generate orderNumber
  const randomTxt = Math.random().toString(36).substring(7).toLocaleUpperCase();
  const randomNumbers = Math.floor(1000 + Math.random() * 90000);
  const randomResult = randomTxt + randomNumbers;

  // generate order slug
  const orderSlug = `${user.slug}-${randomResult}`.toLowerCase();

  // create and save the order to db
  const order = await Order.create({
    user: user._id,
    orderItems,
    orderNumber: randomResult,
    slug: orderSlug,
    shippingAddress,
    totalPrice,
  });

  // debit user via Stripe
  // convert orderItems to Stripe structure
  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.qty,
    };
  });

  //stripe instance
  const stripe = new Stripe(process.env.STRIPE_KEY);
  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: {
      orderId: JSON.stringify(order._id),
    },
    mode: 'payment',
    success_url: 'https://localhost:4040/',
    cancel_url: 'https://localhost:4040/',
  });

  res.send({ url: session.url });

  // Update product quantity sold and quantity left
  const products = await Product.find({ _id: { $in: orderItems } });
  orderItems.map(async (order) => {
    const product = products.find((product) => {
      return product._id.toString() === order._id.toString();
    });

    if (product) {
      product.totalSold += order.qty;
    }

    await product.save();
  });

  // push order into user
  user.orders.push(order._id);
  await user.save();
};

// @desc get all orders
// @route Post /api/v1/orders
// @access private/Admin
export const getAllOrders = async (req, res) => {
  // fetch all orders
  const orders = await Order.find();

  return res.status(OK).json({
    status: '200 OK',
    message: 'Orders fetched successfully',
    orders,
  });
};

// @desc get one order
// @route Post /api/v1/orders/:slug
// @access private/Admin
export const getOneOrder = async (req, res) => {
  // destructure the slug
  const { slug: slug } = req.params;

  const order = await Order.findOne({ slug: slug });

  if (!order) {
    res.status(NOT_FOUND).json({
      status: '404 ERROR',
      message: 'The requested order does not exist',
    });
  }

  return res.status(OK).json({
    status: '200 OK',
    message: 'Order fetched successfully',
    order,
  });
};

// @desc update one order
// @route Post /api/v1/orders/update/:slug
// @access private/Admin
export const updateOrder = async (req, res) => {
  // destructure the slug
  const { slug: slug } = req.params;

  const order = await Order.findOneAndUpdate(
    { slug: slug },
    {
      orderStatus: req.body.status,
    },

    {
      new: true,
    }
  );

  if (!order) {
    res.status(NOT_FOUND).json({
      status: '404 ERROR',
      message: 'The requested order does not exist',
    });
  }

  return res.status(OK).json({
    status: '200 OK',
    message: 'Order updated successfully',
    order,
  });
};
