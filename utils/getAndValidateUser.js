import { NOT_FOUND } from "../app/constants/httpStatusCodes.js";
import User from "../models/User.js";

const getAndValidateUser = async (userId, populateField, res, messageEdit) => {
  // get and validate user
  const user = await User.findById(userId).populate(populateField);
  if (!user) {
    return res.status(NOT_FOUND).json({
      status: '404 ERROR',
      message: message,
    });
    }
    
    return user;
};

export default getAndValidateUser;