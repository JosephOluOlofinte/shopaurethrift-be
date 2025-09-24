import {
  CONFLICT,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
} from '../app/constants/httpStatusCodes.js';
import Brand from '../models/Brand.js';
import convertNameToSlug from '../utils/convertNameToSlug.js';

// @desc    create new brand
// @route   POST /api/v1/brands/create-new
// @access  Private/Admin
export const createBrand = async (req, res) => {
  const { name } = req.body;

  // check if brand exists
  const existingBrand = await Brand.findOne({ name });

  if (existingBrand) {
    return res.status(CONFLICT).json({
      status: 'error',
      message: 'This brand already exists',
    });
  }

  // create new brand
  try {
    const brand = await Brand.create({
      name: name.toLowerCase(),
      slug: convertNameToSlug(name),
      user: req.userAuthId,
    });

    return res.status(CREATED).json({
      status: 'success',
      message: 'Brand created successfully.',
      brand,
    });
  } catch (error) {
    console.log(error);
    
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Something went wrong. Please try again.',
    });
  }
};

// @desc    fetch all brand
// @route   POST /api/v1/brands
// @access  Public
export const getAllBrands = async (req, res) => {
  const brands = await Brand.find().populate({path: 'products', select: 'name slug'});

  if (!brands) {
    return res.status(NOT_FOUND).json({
      status: 'error',
      message: 'There are no existing brands',
    });
  }
  return res.status(OK).json({
    status: 'success',
    message: 'Brands fetched succesfully',
    brands,
  });
};

// @desc    fetch single brand
// @route   POST /api/v1/brands/:slug
// @access  Public
export const getSingleBrand = async (req, res) => {
  const { slug } = req.params;

  const brand = await Brand.findOne({ slug: slug }).populate({
    path: 'products',
    select: 'name slug',
  });

  if (!brand) {
    return res.status(NOT_FOUND).json({
      status: 'error',
      message: 'This brand does not exist.',
    });
  }

  return res.status(OK).json({
    status: 'success',
    message: 'Brand fetched succesfully',
    brand,
  });
};

// @desc    update brand
// @route   POST /api/v1/brands/:slug
// @access  Private/Admin
export const updateBrand = async (req, res) => {
  const { slug: brandSlug } = req.params;

  const { name, image } = req.body;

  // throw error if brand does not exist
  const brand = await Brand.findOne({ slug: brandSlug });

  if (!brand) {
    return res.status(NOT_FOUND).json({
      status: 'error',
      message: 'This brand does not exist.',
    });
  }

  // update brand
  const updatedBrand = await Brand.findOneAndUpdate(
    {
      slug: brandSlug,
    },
    {
      name: name.toLowerCase(),
      slug: convertNameToSlug(name),
      image
    },
    {
      new: true,
    }
  );

  return res.status(OK).json({
    status: 'success',
    message: 'Brand updated succesfully.',
    updatedBrand,
  });
};

// @desc    delete brand
// @route   POST /api/v1/brands/:slug
// @access  Private/Admin
export const deleteBrand = async (req, res) => {
  const { slug } = req.params;

  // throw error if brand does not exist
  const brand = await Brand.findOne({ slug: slug });

  if (!brand) {
    return res.status(NOT_FOUND).json({
      status: 'error',
      message: 'This brand does not exist.',
    });
  }

  // delete brand
  const deletedBrand = await Brand.findOneAndDelete({
    slug,
  });

  return res.status(OK).json({
    status: 'success',
    message: 'Brand deleted succesfully. Details provided below.',
    deletedBrand,
  });
};
