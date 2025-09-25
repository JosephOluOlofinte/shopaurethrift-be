import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
} from '../constants/httpStatusCodes.js';
import User from '../models/User.js';
import ShippingAddress from '../models/ShippingAddress.js';
import getAndValidateUser from '../utils/getAndValidateUser.js';

// @desc create shipping address
// @route Post /api/v1/shipping-addresses
// @access private
export const createShippingAddress = async (req, res) => {
  // get the user
  const user = await getAndValidateUser(
    req.userAuthId,
    'shippingAddresses',
    'You must be logged in to create a shipping address!'
  );

  // destructure the payload
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

  // check if there is an existing address with the nickname
  const existingAddress = user.shippingAddresses.find((address) => {
    return (
      address.addressNickname.toLowerCase() === addressNickname.toLowerCase()
    );
  });

  if (existingAddress) {
    return res.status(CONFLICT).json({
      status: '409 CONFLICT',
      message:
        'You already have an existing address with the provided nickname.',
    });
  }

  // create and save shipping address to db
  const shippingAddress = await ShippingAddress.create({
    user: user._id,
    addressNickname,
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
export const getAllShippingAddresses = async (req, res) => {
  // get and validate user
  const user = await getAndValidateUser(
    req.userAuthId,
    'shippingAddresses',
    'You must be logged in to see your addresses'
  );

  // fetch addresses from user
  const addresses = user.shippingAddresses;
  if (addresses <= 0) {
    return res.status(NOT_FOUND).json({
      status: 'error 404',
      message:
        'You have not added a shipping address yet. Add one to see results. ',
    });
  }

  return res.status(OK).json({
    status: 'OK 200',
    message: 'Addresses fetched successfully',
    addresses,
  });
};

// @desc get one shipping address
// @route get /api/v1/shipping-addresses/:addressnickname
// @access private
export const getShippingAddress = async (req, res) => {
  // get and validate user
  const user = await User.findById(req.userAuthId).populate(
    'shippingAddresses'
  );
  if (!user) {
    return res.status(NOT_FOUND).json({
      status: 'Error 404',
      message: 'You must be logged in to see your shipping address',
    });
  }

  // find shipping address by nickname
  const { addressnickname } = req.params;
  const existingAddress = user.shippingAddresses.find((address) => {
    return (
      address.addressNickname.toLowerCase() === addressnickname.toLowerCase()
    );
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

// @desc update shipping address
// @route put /api/v1/shipping-addresses/:addressnickname
// @access private
export const updateShippingAddress = async (req, res) => {
  // get and validate user
  const user = await getAndValidateUser(
    req.userAuthId,
    'shippingAddresses',
    'You must be logged in to edit or update your addresses'
  );

  // get address from user data
  const { addressnickname } = req.params;
  const existingAddress = user.shippingAddresses.find((address) => {
    return (
      address.addressNickname.toLowerCase() === addressnickname.toLowerCase()
    );
  });

  if (!existingAddress) {
    return res.status(NOT_FOUND).json({
      status: '404 error',
      message: 'The provided address does not exist',
    });
  }

  // destructure incoming data
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

  // find address by id in the DB and update the fields
  try {
    const editedAddress = await ShippingAddress.findByIdAndUpdate(
      existingAddress._id,
      {
        addressNickname,
        firstName,
        lastName,
        address,
        city,
        postalCode,
        province,
        country,
        phone,
      },
      {
        new: true,
      }
    );

    // send the response
    return res.status(OK).json({
      status: '200 OK',
      message: 'Address successfully updated!',
      editedAddress,
    });
  } catch (error) {
    if (err) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        status: '500 INTERNAL SERVER ERROR',
        message: 'Something went wrong. Please check your network and retry.',
      });
    }
  }
};

// @desc delete one shipping address
// @route delete /api/v1/shipping-addresses/:addressnickname
// @access private
export const deleteShippingAddress = async (req, res) => {
  // get and validate the user
  const user = await getAndValidateUser(
    req.userAuthId,
    'shippingAddresses',
    'You must be signed in to delete your shipping address.'
  );

  // get address from user data
  const { addressnickname } = req.params;
  const existingAddress = user.shippingAddresses.find((address) => {
    return (
      address.addressNickname.toLowerCase() === addressnickname.toLowerCase()
    );
  });

  if (!existingAddress) {
    return res.status(NOT_FOUND).json({
      status: '404 ERROR',
      message: 'The provided address does not exist.',
    });
  }

  // find and delete address from db
  try {
    const deletedAddress = await ShippingAddress.findByIdAndDelete(
      existingAddress._id
    );

    return res.status(OK).json({
      status: '200 OK',
      message: 'Address deleted successfully.',
      deletedAddress,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: '500 INTERNAL SERVER ERROR',
      message: 'Something went wrong. Please check your network and retry.',
    });
  }
};
