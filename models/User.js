import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    orders: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Order',
        },
        slug: {
          type: String,
        },
      },
    ],
    wishLists: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'WishList',
        },
        slug: {
          type: String,
        },
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
    shippingAddress: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      address: {
        type: String,
      },
      city: {
        type: String,
      },
      postalCode: {
        type: String,
      },
      province: {
        type: String,
      },
      country: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

// compile the schema to model

const User = mongoose.model('User', UserSchema);

export default User;