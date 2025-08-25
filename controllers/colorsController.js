import {
  CONFLICT,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
} from '../app/constants/httpStatusCodes.js';
import Color from '../models/Color.js';
import convertNameToSlug from '../utils/convertNameToSlug.js';

// @desc    create new color
// @route   POST /api/v1/colors/create-new
// @access  Private/Admin
export const createColor = async (req, res) => {
  const { name } = req.body;

  // check if color exists
  const existingColor = await Color.findOne({ name });

  if (existingColor) {
    return res.status(CONFLICT).json({
      status: 'error',
      message: 'This color already exists',
    });
  }

  // create new color
  try {
    const color = await Color.create({
      name: name.toLowerCase(),
      slug: convertNameToSlug(name),
      user: req.userAuthId,
    });

    return res.status(CREATED).json({
      status: 'success',
      message: 'Color created successfully.',
      color,
    });
  } catch (error) {
    console.log(error);
    
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Something went wrong. Please try again.',
    });
  }
};

// @desc    fetch all color
// @route   POST /api/v1/colors
// @access  Public
export const getAllColors = async (req, res) => {
  const colors = await Color.find();

  if (!colors) {
    return res.status(NOT_FOUND).json({
      status: 'error',
      message: 'There are no existing colors',
    });
  }
  return res.status(OK).json({
    status: 'success',
    message: 'Colors fetched succesfully',
    colors,
  });
};

// @desc    fetch single color
// @route   POST /api/v1/colors/:slug
// @access  Public
export const getSingleColor = async (req, res) => {
  const { slug } = req.params;

  const color = await Color.findOne({ slug });

  if (!color) {
    return res.status(NOT_FOUND).json({
      status: 'error',
      message: 'This color does not exist.',
    });
  }

  return res.status(OK).json({
    status: 'success',
    message: 'Color fetched succesfully',
    color,
  });
};

// @desc    update color
// @route   POST /api/v1/colors/:slug
// @access  Private/Admin
export const updateColor = async (req, res) => {
  const { slug: colorSlug } = req.params;

  const { name, slug } = req.body;

  // throw error if color does not exist
  const color = await Color.findOne({ slug: colorSlug });

  if (!color) {
    return res.status(NOT_FOUND).json({
      status: 'error',
      message: 'This color does not exist.',
    });
  }

  // update color
  const updatedColor = await Color.findOneAndUpdate(
    {
      slug: colorSlug,
    },
    {
      name: name.toLowerCase(),
      slug: convertNameToSlug(name),
    },
    {
      new: true,
    }
  );

  return res.status(OK).json({
    status: 'success',
    message: 'Color updated succesfully.',
    updatedColor,
  });
};

// @desc    delete color
// @route   POST /api/v1/colors/:slug
// @access  Private/Admin
export const deleteColor = async (req, res) => {
  const { slug } = req.params;

  // throw error if color does not exist
  const color = await Color.findOne({ slug });

  if (!color) {
    return res.status(NOT_FOUND).json({
      status: 'error',
      message: 'This color does not exist.',
    });
  }

  // delete color
  const deletedColor = await Color.findOneAndDelete({
    slug,
  });

  return res.status(OK).json({
    status: 'success',
    message: 'Color deleted succesfully. Details provided below.',
    deletedColor,
  });
};
