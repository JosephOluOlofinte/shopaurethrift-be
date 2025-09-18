import mongoose from 'mongoose';

const Schema = mongoose.Schema;


const OrderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderNumber: {
      type: String,
      unique: true,
    },
    slug: {
      type: String,
    },
    orderItems: [
      {
        _id: {
          type: String,
        },
        name: {
          type: String,
        },
        description: {
          type: String,
        },
        orderQty: {
          type: Number,
        },
        price: {
          type: Number,
        }
      },
    ],
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
    coupon: {
      type: String,
      default: 'Not provided'
    },
    discount: {
      type: String,
      default: 'No discount'
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
