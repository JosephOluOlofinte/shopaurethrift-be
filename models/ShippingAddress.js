import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ShippingAddressSchema = new Schema(
  {
    addressNickname: {
      type: String,
      required: [true, 'Enter a name to save this address.'],
    },
    slug: {
      type: String,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
    },
    address: {
      type: String,
      required: [true, 'Address  is required'],
    },
    city: {
      type: String,
      required: [true, 'City name is required'],
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required'],
    },
    province: {
      type: String,
      required: [true, 'State/province name is required'],
    },
    country: {
      type: String,
      default: 'Nigeria',
      required: [true, 'Country name is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
  },
  {
    timestamps: true,
  }
);

// compile the schema to model
const ShippingAddress = mongoose.model(
  'ShippingAddress',
  ShippingAddressSchema
);

export default ShippingAddress;
