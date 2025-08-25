import { CREATED, NOT_FOUND } from '../app/constants/httpStatusCodes.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import User from '../models/User.js';


// @desc    Create new review
// @route   POST /api/v1/reviews/:slug
// @access  Private/Admin

export const createReviews = async (req, res) => {
  const { slug: productSlug } = req.params;
  const { message, rating } = req.body;
  
  // find the product by slug
  const existingProduct = await Product.findOne({ slug: productSlug });
  if (!existingProduct) {
    return res.status(NOT_FOUND).json({
      status: 'error',
      message: 'Product does not exists',
    });
  }
  

  // Create the review
  const review = await Review.create({
    user: req.userAuthId,
    slug: `${existingProduct.slug}/reviews/`,
    product: existingProduct?._id,
    message,
    rating,
  });

  // Push the review into 'existingProduct'
  existingProduct.reviews.push(review?._id);

  // resave
  await existingProduct.save();
  
  res.status(CREATED).json({
    status: 'success',
    message: 'Review successfully added.',
    review
  });
};
