import { CONFLICT, CREATED, NOT_FOUND } from '../constants/httpStatusCodes.js';
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
  const existingProduct = await Product.findOne({ slug: productSlug }).populate(
    'reviews'
  );
  if (!existingProduct) {
    return res.status(NOT_FOUND).json({
      status: 'error',
      message: 'Product does not exists',
    });
  }

  // Check if user has reviewed the product
  const hasReviewed = existingProduct?.reviews?.find((review) => {
    return review?.user?.toString() === req?.userAuthId?.toString();
  });

  if (hasReviewed) {
    return res.status(CONFLICT).json({
      status: 'error',
      message: 'You have already reviewed this product!',
    });
  }

  // generate the review slug
  const userId = req.userAuthId;
  const user = await User.findById(userId);
  const reviewSlug = `${existingProduct.slug}/reviews/${user.slug}`;

  // Create the review
  const review = await Review.create({
    user: req.userAuthId,
    slug: reviewSlug,
    product: existingProduct?._id,
    message,
    rating,
  });

  // Push the review into 'existingProduct'
  existingProduct.reviews.push(review?._id);
  await existingProduct.save();

  // push the review into user
  user.reviews.push(review._id);
  await user.save();

  return res.status(CREATED).json({
    status: 'success',
    message: 'Review successfully added.',
    review,
  });
};
