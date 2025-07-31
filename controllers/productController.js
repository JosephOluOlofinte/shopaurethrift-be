import { CONFLICT, CREATED, NOT_FOUND, OK } from '../app/constants/httpStatusCodes.js';
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
  });
};

// @desc    fetch all products
// @route   get /api/v1/products/get-products
// @access  Public
export const getProducts = async (req, res) => {
  // query
  let productQuery = Product.find();
  console.log(productQuery);

  // search products by name
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


  // search product by price range
  const price = req.query.price;
  if (price) {
    const priceRange = price.split('-');
    // gte: greater than or equal to
    // lte: less than or equal to
    productQuery = productQuery.find({
      price: { $gte: priceRange[0], $lte: priceRange[1] },
    });
  }

  // pagination
  // page
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  // limit
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  // startIndex
  const startIndex = (page - 1) * limit;
  // endIndex
  const endIndex = page * limit
  // total
  const totalProducts = await Product.countDocuments();

  productQuery = productQuery.skip(startIndex).limit(limit);

  //  pagination results
  const pagination = {}

  if (endIndex < totalProducts) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if ((startIndex > 0)) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }

  // await the query
  const products = await productQuery;

  return res.status(OK).send({
    status: 'success',
    message: 'Products fetched successfully.',
    totalProducts,
    results: products.length,
    products,
    pagination
  });
};


// @desc    fetch single products
// @route   get /api/v1/products/:id
// @access  Public
export const getSingleProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(NOT_FOUND).json({
      status: 'error',
      message: 'Product not found'
    })
  }

  res.status(OK).json({
    status: 'success',
    message: 'Product fetched successfully',
    product
  })
}

// @desc    update single product
// @route   PUT /api/v1/products/:id
// @access  Private /Admin
export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);


  
  if (!product) {
    res.status(NOT_FOUND).json({
      status: 'error',
      message: 'Product not found',
    });
  }

  res.status(OK).json({
    status: 'success',
    message: 'Product updated successfully',
    product,
  });
};