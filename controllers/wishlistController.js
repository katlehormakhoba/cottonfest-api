const Cart = require('../models/cartModel');
const Wish = require('../models/wishlistModel');
const factoryHandler = require('./factoryHandler');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


exports.deleteAndMoveToCart = catchAsync(async (req, res, next) => {

    const doc = await Wish.findOneAndDelete({ product : req.params.id});

    if(!doc){
        return next(new AppError('No document found with that ID', 404));
    }

    next();

})

exports.setProductUserIds = (req, res, next) => {

    //FOR CREATING USER ORDERS BY SETTING PRODUCT ID USING FACTORY HANDLER
    if (!req.body.product) {
        req.body.product = req.params.id;
    }

    //FOR CREATING USER ORDERS BY SETTING USER ID USING FACTORY HANDLER
    if (!req.body.user) {
        req.body.user = req.user.id;
    }

    //FOR GETTING USER WISHlIST USING FACTORY HANDLER
    if (!req.params.userId) {
        req.params.userId = req.user.id;
    }

    next();
}


exports.getMyWishlist = factoryHandler.getAll(Wish);
exports.getAllWishlist = factoryHandler.getAll(Wish);
exports.createWishlist = factoryHandler.createOne(Wish);
exports.deleteWishlist = factoryHandler.deleteOne(Wish);
exports.moveToCart = factoryHandler.createOne(Cart);
    

    

