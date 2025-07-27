import { CONFLICT, CREATED, OK } from '../app/constants/httpStatusCodes.js';
import Product from '../models/Product.js';
import findProductsBy from '../utils/findProductBy.js';

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
  });
};

// @desc    fetch all products
// @route   POST /api/v1/products/get-products
// @access  Public
export const getProducts = async (req, res) => {
  // query
  let productQuery = Product.find();
  console.log(productQuery);

  // search product by name
  const name = req.query.name;
  if (name) {
    productQuery = productQuery.find({
      name: { $regex: name, $options: 'i' },
    });
  }

  // search product by brand
  const brand = req.query.brand;
  if (brand) {
    productQuery = productQuery.find({
      brand: { $regex: brand, $options: 'i' },
    });
  }

  // search product by category
  const category = req.query.category;
  if (category) {
    productQuery = productQuery.find({
      category: { $regex: category, $options: 'i' },
    });
  }

  // search product by color
  const color = req.query.colors;
  if (color) {
    productQuery = productQuery.find({
      colors: { $regex: color, $options: 'i' },
    });
  }

  // search product by size
  const size = req.query.sizes;
  if (size) {
    productQuery = productQuery.find({
      sizes: { $regex: size, $options: 'i' },
    });
  }

  // findProductsBy(size, sizes);

  // search product by price range
  // const priceRange = req.query.price.split('-');
  // if (priceRange) {
  //   productQuery = productQuery.find({
  //     size: { $regex: size, $options: 'i' },
  //   });
  // }

  // await the query
  const product = await productQuery;

  return res.status(OK).send({
    status: 'success',
    message: 'Products fetched successfully.',
    product,
  });
};
