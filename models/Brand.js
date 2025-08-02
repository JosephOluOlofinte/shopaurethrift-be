//Brand schema
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const BrandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        slug: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const Brand = mongoose.model('Brand', BrandSchema);

export default Brand;
