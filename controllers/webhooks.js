import dotenv from 'dotenv';
dotenv.config();
import Stripe from "stripe";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { NOT_FOUND, OK } from "../app/constants/httpStatusCodes.js";




// Stripe webhook
// stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

// Stripe CLI webhook secret key for local testing
const endpointSecret = process.env.STRIPE_SIGNING_SECRET;


  export const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      res.status(400).send(`Webhook verification failed`);
      return;
    }

    console.log('Webhook hit!');

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total;
      const currency = session.currency;

      // check that orderId is undefined
      if (!orderId) {
        console.error('No orderId found in session metadata');
        return res.status(NOT_FOUND).json({
          status: '404 NOT FOUND',
          message: 'orderId is missing.'
        });
      }

      // find the order and update necessary data
      try {
        // mark order as paid and set order status
        const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          {
            totalPrice: totalAmount / 100,
            currency,
            paymentMethod,
            paymentStatus,
            orderStatus: 'processing',
          },
          { new: true }
        );

        console.log({
          status: '200 OK',
          message: 'Payment received. Order is now being processed',
          updatedOrder,
        });

        // Update product quantity sold and quantity left
        for (const item of updatedOrder.orderItems) {
          await Product.findByIdAndUpdate(item._id, {
            $inc: { totalQty: -item.orderQty },
          });
        }
        
      } catch (error) {
        
      }
  
    } else {
      return;
    }

    // return a 200 response to acknowledge receipt of the event
    return res.send();
  };


