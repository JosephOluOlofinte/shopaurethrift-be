import {
  CONFLICT,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
} from '../app/constants/httpStatusCodes.js';
import Category from '../models/Category.js';
import convertNameToSlug from '../utils/convertNameToSlug.js';

// @desc    create new category
// @route   POST /api/v1/categories/create-new
// @access  Private/Admin
export const createCategory = async (req, res) => {
  const { name, image } = req.body;

  // check if categorye exists
  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    return res.status(CONFLICT).json({
      status: 'error',
      message: 'This category already exists',
    });
  }

  // create new category
  try {
    const category = await Category.create({
      name: name.toLowerCase(),
      slug: convertNameToSlug(name),
      user: req.userAuthId,
      image,
    });

    return res.status(CREATED).json({
      status: 'success',
      message: 'Category created successfully.',
      category,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Something went wrong. Please try again.',
    });
  }
};

// @desc    fetch all category
// @route   POST /api/v1/categories
// @access  Public
export const getAllCategories = async (req, res) => {
  const categories = await Category.find();

  return res.status(OK).json({
    status: 'success',
    message: 'Categories fetched succesfully',
    categories,
  });
};

// @desc    fetch single category
// @route   POST /api/v1/categories/:slug
// @access  Public
export const getSingleCategory = async (req, res) => {
  const { slug } = req.params;

  const category = await Category.findOne({ slug });

  if (!category) {
    return res.status(NOT_FOUND).json({
      status: 'error',
      message: 'This category does not exist.',
    });
  }

  return res.status(OK).json({
    status: 'success',
    message: 'Category fetched succesfully',
    category,
  });
};

// @desc    update category
// @route   POST /api/v1/categories/:slug
// @access  Private/Admin
export const updateCategory = async (req, res) => {
  const { slug: catSlug } = req.params;

  const { name, slug, image } = req.body;

  // throw error if category does not exist
  const category = await Category.findOne({ slug: catSlug });

  if (!category) {
    return res.status(NOT_FOUND).json({
      status: 'error',
      message: 'This category does not exist.',
    });
  }

  // update category
  const updatedCategory = await Category.findOneAndUpdate(
    {
      slug: catSlug,
    },
    { name, slug: convertNameToSlug(name), image },
    {
      new: true,
    }
  );

  return res.status(OK).json({
    status: 'success',
    message: 'Category updated succesfully.',
    updatedCategory,
  });
};

// @desc    delete category
// @route   POST /api/v1/categories/:slug
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
  const { slug } = req.params;

  // throw error if category does not exist
  const category = await Category.findOne({ slug });

  if (!category) {
    return res.status(NOT_FOUND).json({
      status: 'error',
      message: 'This category does not exist.',
    });
  }

  // delete category
  const deletedCategory = await Category.findOneAndDelete({
    slug,
  });

  return res.status(OK).json({
    status: 'success',
    message: 'Category deleted succesfully. Details provided below.',
    deletedCategory,
  });
};
