import dotenv from 'dotenv';
dotenv.config();
import {
  BAD_REQUEST,
  NOT_FOUND,
  OK,
} from '../app/constants/httpStatusCodes.js';
import Order from '../models/Order.js';
// import Product from '../models/Product.js';
import User from '../models/User.js';
import Stripe from 'stripe';
import ShippingAddress from '../models/ShippingAddress.js';
import generateUniqueOrderNumber from '../utils/generateUniqueOrderNumber.js';
import Coupon from '../models/Coupon.js';

// @desc create orders
// @route Post /api/v1/orders
// @access private
export const createOrder = async (req, res) => {
  const messages = [];

  // get the coupon from url query
  const { coupon } = req.query;
  let existingCoupon;

  if (coupon) {
    existingCoupon = await Coupon.findOne({
      code: coupon?.toUpperCase(),
    });

    if (existingCoupon?.isExpired) {
      messages.push({
        coupon: coupon,
        message: 'The coupon code you entered has expired',
      });
    }

    if (!existingCoupon) {
      messages.push({
        coupon: coupon,
        message: 'The coupon you entered does not exist',
      });
    }
  }

  

  // get discount
  const discount = coupon ? existingCoupon.discount / 100 : 0;
  if (discount > 0) {
    messages.push({
      coupon: coupon,
      discount: `${existingCoupon.discount}% discount added successfully`,
    });
  } else {
    messages.push({
      coupon: 'Not provided',
      discount: 'No discount has been added to your order',
    });
  }
  


  // get the payload (customer, orderItems, shippingAddress, totalPrice)
  const { orderItems, shippingAddress, totalPrice } = req.body;

  // find and validate the user
  const user = await User.findById(req.userAuthId).populate(
    'shippingAddresses'
  );
  if (!user) {
    return res.status(NOT_FOUND).json({
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

  // get selected address from user data
  const addressExistsOnUser = user.shippingAddresses.find((eachAddress) => {
    return (
      eachAddress.addressNickname.toLowerCase() ===
      shippingAddress.toLowerCase()
    );
  });

  if (!addressExistsOnUser) {
    return res.status(NOT_FOUND).json({
      status: '404 ERROR',
      message:
        'The provided address does not exist in your account. Please check add it to your shipping addresses',
    });
  }

  const address = await ShippingAddress.findById(addressExistsOnUser._id);

  // check if order is not empty
  if (orderItems.length <= 0) {
    return res.status(BAD_REQUEST).json({
      status: 'Error. Bad request',
      message: 'You have not selected any products',
    });
  }

  let orderNumber;

  // create order, save to db, and initiate checkout
  try {
    // generate orderNumber
    orderNumber = await generateUniqueOrderNumber();

    const order = await Order.create({
      user: user._id,
      orderItems,
      orderNumber,
      slug: `${user.username}/${orderNumber}`,
      shippingAddress: address,
      coupon,
      discount: `${coupon ? `${existingCoupon.discount}%` : 'Not applicable'}`,
      totalPrice: existingCoupon ? totalPrice - totalPrice * discount : totalPrice,
    });

    console.log(order)

    // push order into user
    user.orders.push(order._id);
    await user.save();

    // Stripe checkout logic
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
        quantity: item.orderQty,
      };
    });

    //creat an instance of stripe and start the checkout session
    const stripe = new Stripe(process.env.STRIPE_KEY);
    const session = await stripe.checkout.sessions.create({
      line_items: convertedOrders,
      metadata: {
        orderId: order._id.toString(),
      },
      mode: 'payment',
      success_url: 'https://localhost:4040/',
      cancel_url: 'https://localhost:4040/',
    });

    res.status(OK).json({ status: '200 OK', messages, order, url: session.url });
  } catch (err) {
    if (err.code === 11000) {
      // duplicate key error from Mongo
      console.warn('Order number collision detected at DB level, retrying...');
      // regenerate and retry once more
      orderNumber = await generateUniqueOrderNumber();
      // save again
    } else {
      throw err;
    }
  }
};

// @desc get all orders
// @route Post /api/v1/orders
// @access private/Admin
export const getAllOrders = async (req, res) => {
  // fetch all orders
  const orders = await Order.find();

  if (orders <= 0 ) {
    return res.status(NOT_FOUND).json({
      status: '404 NOT FOUND',
      message: 'There are no orders yet',
      orders,
    });
  }

  return res.status(OK).json({
    status: '200 OK',
    message: 'Orders fetched successfully',
    orders,
  });
};

// @desc get one order
// @route Post /api/v1/orders/:username/:orderNumber
// @access private/Admin
export const getOneOrder = async (req, res) => {
  // destructure the slug
  const { username, orderNumber } = req.params;

  // construct the order slug
  const slug = `${username}/${orderNumber}`;

  // find the order
  const order = await Order.findOne({ slug });

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
// @route Post /api/v1/orders/:username/:orderNmuber
// @access private/Admin
export const updateOrder = async (req, res) => {
  // destructure the slug and incoming data
  const { username, orderNumber } = req.params;
  const { orderStatus } = req.body;

  // construct slug
  const slug = `${username}/${orderNumber}`;

  // check if order exists
  const existingOrder = await Order.findOne({ slug });
  if (!existingOrder) {
    return res.status(NOT_FOUND).json({
      status: '404 error',
      message: 'The provided order does not exist or has been deleted',
    });
  }

  // update the order
  const updatedOrder = await Order.findOneAndUpdate(
    { slug },
    {
      orderStatus: orderStatus,
    },
    {
      new: true,
    }
  );

  return res.status(OK).json({
    status: '200 OK',
    message: 'Order updated successfully',
    updatedOrder,
  });
};

// @desc delete one order
// @route DELETE /api/v1/orders/:username/:orderNumber
// @access private/Admin
export const deleteOrder = async (req, res) => {
  // destructure the slug
  const { username, orderNumber } = req.params;

  // construct the slug
  const slug = `${username}/${orderNumber}`;

  // find the order and delete it from db
  const deletedOrder = await Order.findOneAndDelete({ slug });

  if (!deletedOrder) {
    res.status(NOT_FOUND).json({
      status: '400. NOT FOUND',
      message: 'The provided order does not exist or has already been deleted',
    });
  }

  if (deletedOrder) {
    await User.updateMany(
      { orders: order._id },
      { $pull: { orders: order._id } }
    );
  }


  res.status(OK).json({
    status: '200. OK',
    message: 'Order deleted successfully.',
    deletedOrder,
  });
};


// @desc delete all orders
// @route DELETE /api/v1/orders/
// @access private/Admin
export const deleteAllOrders = async (req, res) => {

  // find the order and delete it from db
  const deletedOrders = await Order.findOneAndDelete();

  if (!deletedOrders) {
    res.status(NOT_FOUND).json({
      status: '400. NOT FOUND',
      message: 'There are no existing orders or have already been deleted',
    });
  }

  res.status(OK).json({
    status: '200. OK',
    message: 'Orders deleted successfully.',
    deletedOrders,
  });
};
