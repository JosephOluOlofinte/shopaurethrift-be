import dotenv from 'dotenv';
dotenv.config();
import Stripe from 'stripe';
import express, { response } from 'express';
import dbConnect from '../config/dbConnect.js';
import userRoutes from '../routes/userRoutes.js';
import productRoutes from '../routes/productRoutes.js';
import categoryRoutes from '../routes/categoryRoutes.js';
import brandRoutes from '../routes/brandRoutes.js';
import colorRoutes from '../routes/colorRoutes.js';
import reviewRoutes from '../routes/reviewRoutes.js';
import orderRoutes from '../routes/orderRoutes.js';
import shippingAddressRoutes from '../routes/shippingAddressRoutes.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// connect database
dbConnect();
const app = express();

// Stripe webhook
// stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

// Stripe CLI webhook secret key for local testing
const endpointSecret =
  'whsec_1a09c83b1d5b99c7e9ae6d9ccb1a79596df47856c30b072540daeeeaaaa45881';

app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log(event);
    } catch (err) {
      res.status(400).send(`webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      // update the order
      const session = event.data.object;
      const orderId = session.metadata.orderId;
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total;
      const currency = session.currency;

      // find the order and update it
      if (!orderId) {
        console.error(
          'No orderId found in session metadata:',
          session.metadata
        );
        return res.status(400).send('Missing orderId');
      }
      // const parsedOrderId = JSON.parse(orderId);
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          totalPrice: totalAmount / 100,
          currency,
          paymentMethod,
          paymentStatus,
          orderStatus: 'processing',
        },
        {
          new: true,
        }
      );

      console.log('Updated order:', updatedOrder);

      // Update product quantity sold and quantity left
      const products = await Product.find({ _id: { $in: updatedOrder.orderItems } });
      updatedOrder.orderItems.map(async (order) => {
        const product = products.find((product) => {
          return product._id.toString() === order._id.toString();
        });

        if (product) {
          product.totalSold += order.qty;
        }

        await product.save();
      });

    } else {
      return;
    }
    // switch (event.type) {
    //   case "payment_intent.succeeded":
    //     const paymentIntent = event.data.object;

    //     // Define and call a function to handle the evemt payment_intent.succeeded

    //     break;

    //   default: console.log(`Unhandled event type ${event.type}`);
    // }

    // return a 200 response to acknowledge receipt of the event
    return res.status(200).end();
  }
);

// pass incoming data to server
app.use(express.json());

// Routes
// API health check endpoint
app.get('/', (req, res, next) => {
  return res.status(200).json({
    status: 'Healthy',
    message:
      'Your connection is healthy, and you are now in the root directory!',
  });
});


app.use('/api/v1/users/', userRoutes);
app.use('/api/v1/products/', productRoutes);
app.use('/api/v1/categories/', categoryRoutes);
app.use('/api/v1/brands/', brandRoutes);
app.use('/api/v1/colors/', colorRoutes);
app.use('/api/v1/reviews/', reviewRoutes);
app.use('/api/v1/orders/', orderRoutes);
app.use('/api/v1/shipping-addresses/', shippingAddressRoutes);

export default app;
