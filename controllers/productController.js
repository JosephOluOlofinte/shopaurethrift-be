import { CONFLICT, CREATED, OK } from '../app/constants/httpStatusCodes.js';
import Product from '../models/Product.js';

// @desc    create new product
// @route   POST /api/v1/products/create-new
// @access  Private/Admin
export const createNewProduct = async (req, res) => {
  const {
    name,
    description,
    brand,
    category,
    sizes,
    colors,
    user,
    price,
    totalQty,
  } = req.body;

  // check if product exists
  const productExists = await Product.findOne({ name });

  if (productExists) {
    res.status(CONFLICT).json({
      status: 'error',
      message: 'Product already exists!',
    });
  }

  // Create poduct
  const product = await Product.create({
    name,
    description,
    brand,
    category,
    sizes,
    colors,
    user: req.userAuthId,
    price,
    totalQty,
  });
    
    // push product into its category

    // send response
    res.status(CREATED).json({
        status: 'success',
        message: 'Product created successfully',
        product,
    })
};


// @desc    fetch all products
// @route   POST /api/v1/products/get-products
// @access  Public
export const getProducts = async (req, res) => {
    const products = await Product.find();

    res.status(OK).json({
        status: 'success',
        message: 'Products fetched successfully.',
        products
    });
}