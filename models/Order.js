import mongoose from "mongoose";

const Schema = mongoose.Schema;

// generate random numbers for ordernumber
const randomTxt = Math.random().toString(36).substring(7).toUpperCase();
const randomNumber = Math.floor(1000 + Math.random() * 90000);

const OrderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [
      {
        type: Object,
        required: true,
      },
    ],
    shippingAddress: {
      type: Object,
      required: true,
    },
    orderNumber: {
      type: String,
      defaultVal: randomTxt + randomNumber,
    },
    paymentStatus: {
      type: String,
      default: 'Not paid',
    },
    paymentMethod: {
      type: String,
      default: 'Not specified',
    },
    currency: {
      type: String,
      default: 'Not specified',
    },
    // For admin
    orderStatus: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// compile to form model
const Order = mongoose.model('Order', OrderSchema);
export default Order;