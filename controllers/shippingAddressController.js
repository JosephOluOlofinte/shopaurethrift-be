import { NOT_FOUND, OK } from '../app/constants/httpStatusCodes.js';
import ShippingAddress from '../models/ShippingAddress.js';
import User from '../models/User.js';

// @desc create shipping address
// @route Post /api/v1/shipping-addresses
// @access private
export const createShippingAddress = async (req, res) => {
  // get the user
  const user = await User.findById(req.userAuthId);

  if (!user) {
    return req.status(NOT_FOUND).json({
      status: 'Error 404. Not Found',
      message: 'You must be logged in to create a shipping address!',
    });
  }

  // get the payload
  const {
    addressNickname,
    firstName,
    lastName,
    address,
    city,
    postalCode,
    province,
    country,
    phone,
  } = req.body;

  // create and save shipping address to db
  const shippingAddress = await ShippingAddress.create({
    user: user._id,
    addressNickname,
    slug: addressNickname.toLowerCase(),
    firstName,
    lastName,
    address,
    city,
    postalCode,
    province,
    country,
    phone,
  });

  // push address into user and update hasShippingAddress
  user.shippingAddresses.push(shippingAddress._id);
  user.hasShippingAddress = true;
  await user.save();

  // return success message
  return res.status(OK).json({
    status: '200. success',
    message:
      'Shipping address added successfully. You can modify the details at any time.',
    shippingAddress,
  });
};

// @desc get all shipping addresses
// @route get /api/v1/shipping-addresses
// @access private

// @desc get one shipping address
// @route get /api/v1/shipping-addresses/:addressnickname
// @access private
export const getShippingAddress = async (req, res) => {
  // get and validate user
  const user = await User.findById(req.userAuthId).populate('shippingAddresses');
  if (!user) {
    return res.status(NOT_FOUND).json({
      status: 'Error 404',
      message: 'You must be logged in to see your shipping address',
    });
  }

  // find shipping address by nickname
  const { addressnickname } = req.params;
  const existingAddress = user.shippingAddresses.find((address) => {
    return address.addressNickname.toLowerCase() === addressnickname.toLowerCase();
  });

  if (!existingAddress) {
    return res.status(NOT_FOUND).json({
      status: '404 error',
      message: 'The address you entered does not exist',
    });
  }

  // return the response
  return res.status(OK).json({
    status: '200 success',
    message: 'Address found successfully',
    existingAddress,
  });
};

// @desc update one shipping address
// @route put /api/v1/shipping-addresses/:addressnickname
// @access private

// @desc delete one shipping address
// @route delete /api/v1/shipping-addresses/:addressnickname
// @access private
