import mongoose from 'mongoose';

const Schema = mongoose.Schema;


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
    orderNumber: {
      type: String,
    },
    slug: {
      type: String,
    },
    shippingAddress: {
      type: Object,
      required: true,
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
    totalPrice: {
      type: Number,
      default: '0.0',
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
