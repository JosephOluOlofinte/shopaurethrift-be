import {
  CONFLICT,
  CREATED,
  INTERNAL_SERVER_ERROR,
} from '../app/constants/httpStatusCodes.js';
import Category from '../models/Category.js';
import convertNameToSlug from '../utils/convertNameToSlug.js';

// @desc    create new category
// @route   POST /api/v1/category/create-new
// @access  Private/Admin
export const createCategory = async (req, res) => {
  const { name, image } = req.body;

  // check if categorye exists
  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    res.status(CONFLICT).json({
      status: 'error',
      message: 'This category already exists',
    });
  }

  // create new category
  try {
    const category = await Category.create({
      name,
      slug: convertNameToSlug(name),
      user: req.userAuthId,
      image,
    });

    res.status(CREATED).json({
      status: 'success',
      message: 'Category created successfully.',
      category,
    });
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Something went wrong. Please try again.',
    });
  }
};
