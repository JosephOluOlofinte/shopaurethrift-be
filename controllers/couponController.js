import {
  CONFLICT,
  CREATED,
  FORBIDDEN,
  NOT_FOUND,
  OK,
} from '../app/constants/httpStatusCodes.js';
import Coupon from '../models/Coupon.js';

// @desc    create new coupon
// @route   POST /api/v1/coupons
// @access  Private/Admin
export const createCoupon = async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  // check if admin
  // check if coupon exists
  const existingCoupon = await Coupon.findOne({
    code: code,
  });

  if (existingCoupon) {
    return res.status(CONFLICT).json({
      status: '401. CONFLICT',
      message: 'Coupon already exists',
    });
  }

  // check if discount is a number
  if (isNaN(discount)) {
    return res.status(FORBIDDEN).json({
      status: '403. FORBIDDEN',
      message: 'Discount value must be a number.',
    });
  }

  // create the coupon
  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    startDate,
    endDate,
    discount,
    user: req.userAuthId,
  });

  // return response
  return res.status(CREATED).json({
    status: '201. CREATED',
    message: 'Coupon created successfully',
    coupon,
  });
};

// @desc    fetch all coupons
// @route   GET /api/v1/coupons
// @access  Private/Admin
export const getAllCoupons = async (req, res) => {
  const coupons = await Coupon.find();

  // return response
  return res.status(OK).json({
    status: '200. OK',
    message: 'Coupons fetched successfully',
    coupons,
  });
};


// @desc    fetch one coupon
// @route   GET /api/v1/coupons/:coupon
// @access  Private/Admin
export const getCoupon = async (req, res) => {
  const { coupon } = req.params;
   console.log(req.params);

  const existingCoupon = await Coupon.findOne({ coupon });
    if (!existingCoupon) {
      return res.status(NOT_FOUND).json({
        status: '404. NOT FOUND',
        message: 'Coupon does not exist',
      });
    }

  return res.status(OK).json({
    status: '200. OK',
    message: 'Coupon fetched successfully',
    existingCoupon,
  });
}

// @desc    fetch all coupons
// @route   PUT /api/v1/coupons/:coupon
// @access  Private/Admin
export const updateCoupon = async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  const { coupon } = req.params;
 

  const existingCoupon = await Coupon.findOneAndUpdate({coupon}, {
    code: code.toUpperCase(),
    discount,
    startDate,
    endDate
  },
    {
    new: true,
  });
  if (!existingCoupon) {
    return res.status(NOT_FOUND).json({
      status: '404. NOT FOUND',
      message: 'Coupon does not exist',
      existingCoupon,
    });
  }

  return res.status(OK).json({
    status: '200. OK',
    message: 'Coupon updated successfully',
    existingCoupon,
  });

  
}

// @desc    delete coupon
// @route   GET /api/v1/coupons/:coupon
// @access  Private/Admin
export const deleteCoupon = async (req, res) => {
  const { coupon } = req.params;

  const existingCoupon = await Coupon.findOneAndDelete({coupon});
  if (!existingCoupon) {
    return res.status(NOT_FOUND).json({
      status: '404. NOT FOUND',
      message: 'Coupon does not exist',
      existingCoupon,
    });
  }

  return res.status(OK).json({
    status: '200. OK',
    message: 'Coupon deleted successfully',
    existingCoupon,
  });
  
}