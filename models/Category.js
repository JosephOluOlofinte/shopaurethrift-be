//category schema
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
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
    image: {
      type: String,
      default: 'https://picsum.photos/200/300',
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
          unique: true,
        }
      },
    ],
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', CategorySchema);

export default Category;
