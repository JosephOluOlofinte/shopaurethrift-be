

import { NOT_FOUND, OK } from '../app/constants/httpStatusCodes.js';
import ShippingAddress from '../models/ShippingAddress.js';
import User from '../models/User.js';

// @desc create shipping address
// @route Post /api/v1/users/shipping-address
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
  user.shippingAddress.push(shippingAddress._id);
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


