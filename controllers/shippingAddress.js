

import { NOT_FOUND, OK } from '../app/constants/httpStatusCodes.js';
import ShippingAddress from '../models/ShippingAddress.js';
import User from '../models/User.js';

// @desc create shipping address
// @route Post /api/v1/:username/shipping-address
// @access private
export const createShippingAddress = async (req, res) => {
  // get the user
  const user = await User.findById(req.userAuthId);
  const username = user.username;

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
    user: username,
    addressNickname,
    slug: addressNickname,
    firstName,
    lastName,
    address,
    city,
    postalCode,
    province,
    country,
    phone,
  });

  // push address into user
  user.shippingAddress.push(shippingAddress._id);
  await user.save();

  // return success message
  return res.status(OK).json({
    status: '200. success',
    message:
      'Shipping address added successfully. This can be edited at any time.',
    shippingAddress,
  });
};


