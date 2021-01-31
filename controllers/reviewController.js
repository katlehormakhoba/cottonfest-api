const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factoryHandler = require('./factoryHandler');



exports.setProductUserIds = (req, res, next) => {

    if (!req.body.product) {
        req.body.product = req.params.productId;
    }

    if (!req.body.user) {
        req.body.user = req.user.id;
    }

    next();
}

exports.getAllReviews = factoryHandler.getAll(Review);

// exports.getAllReviews = catchAsync(async (req, res, next) => {
//     let filter = {};

//     if(req.params.productId) filter = { product : req.params.productId};

//     const reviews = await Review.find(filter);

//     res.status(200).json({
//         status: 'success',
//         results: reviews.length,
//         reviews
//     })

// })

exports.createReview = factoryHandler.createOne(Review);
exports.deleteReview = factoryHandler.deleteOne(Review);
exports.updateReview = factoryHandler.updateOne(Review);