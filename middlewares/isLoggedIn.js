import { getTokenFromHeader } from '../utils/getTokenFromHeader.js';
import { verifyToken } from '../utils/verifyToken.js';

export const isLoggedIn = (req, res, next) => {
  // get token from header
  const token = getTokenFromHeader(req);

  // verify token
  const decodedUser = verifyToken(token);

  // throw error if token is invalid
  if (!decodedUser) {
    res.status(404).json({
      status: 'error',
      message: 'Session expired. Please login again',
    });
  }

  // save user into req.object if token is valid
  req.userAuthId = decodedUser?.id;
  next();
};
