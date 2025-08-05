import { CREATED } from '../app/constants/httpStatusCodes.js';

// @desc    Create new review
// @route   POST /api/v1/reviews
// @access  Private/Admin

export const createReviews = (req, res) => {


    res.status(CREATED).json({
        status: 'success',
        message: 'Review successfully added.',
  });
};
