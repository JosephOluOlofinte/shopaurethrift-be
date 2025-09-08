import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
    },
    slug: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    wishLists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WishList',
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    hasShippingAddress: {
      type: Boolean,
      default: false,
    },
    shippingAddress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShippingAddress',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// compile the schema to model

const User = mongoose.model('User', UserSchema);

export default User;
