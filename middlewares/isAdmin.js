import User from '../models/User.js';
import { NOT_FOUND, UNAUTHORIZED } from '../constants/httpStatusCodes.js';




export const isAdmin = async (req, res, next) => {
    // find the logged in user
    const user = await User.findById(req.userAuthId);
    if (!user) {
        return res.status(NOT_FOUND).json({
            status: '404. NOT FOUND',
            message: 'You must be logged in to access this resource'
        })
    }

    // check if user is an admin
    if (user.isAdmin) {
        next()
    } else {
        return res.status(UNAUTHORIZED).json({
            status: '401. UNAUTHORIZED',
            message: 'Access denied. This resource can only be accessed by an Admin.'
        })
    }
}


export const isSuperAdmin = async (req, res, next) => {
  // find the logged in user
  const user = await User.findById(req.userAuthId);
  if (!user) {
    return res.status(NOT_FOUND).json({
      status: '404. NOT FOUND',
      message: 'You must be logged in to access this resource',
    });
  }

  // check if user is an admin
  if (user.isSuperAdmin) {
    next();
  } else {
    return res.status(UNAUTHORIZED).json({
      status: '401. UNAUTHORIZED',
      message: 'Access denied. This resource can only be accessed by a Super Admin.',
    });
  }
};
