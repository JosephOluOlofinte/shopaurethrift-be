import {
  BAD_REQUEST,
  NOT_FOUND,
  OK,
} from '../app/constants/httpStatusCodes.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

// @desc create orders
// @route Post /api/v1/orders
// @access private
export const createOrder = async (req, res) => {
  // get the payload (customer, orderItems, shippingAddress, totalPrice)
  const { orderItems, shippingAddress, totalPrice } = req.body;

  // find amd validate the user
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
  const orderSlug = `${user.slug}/orders/${randomResult}`.toLowerCase();

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
      quantity: item.quantity,
    };
  });


  //  pass converted payload to Stripe
  const stripe = new Stripe(process.env.STRIPE_KEY);
  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    mode: 'payment',
    success_url: 'https://localhost:3000/payment/success',
    cancel_url: 'https://localhost:3000/payment/cancel',
  });

  res.send({ url: session.url });

  // implement payment webhook

  // Update product quantity sold and quantity left
  const products = await Product.find({ _id: { $in: orderItems } });
  orderItems.map(async (order) => {
    const product = products.find((product) => {
      return product._id.toString() === order._id.toString();
    });

    if (product) {
      product.totalSold += order.totalQtyBuying;
    }

    await product.save();
  });

  // push order into user
  user.orders.push(order._id);
  await user.save();

  // update user order details

  return res.status(OK).json({
    status: 'success',
    message: 'Order created successfully',
    order,
  });
};
