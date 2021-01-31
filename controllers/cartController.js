const Cart = require('../models/cartModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factoryHandler = require('./factoryHandler');
const Wish = require('../models/wishlistModel');


exports.deleteAndMoveToWishlist = catchAsync(async (req, res, next) => {

    const doc = await Cart.findOneAndDelete({ product : req.params.id});

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

    //FOR GETTING USER ORDERS USING FACTORY HANDLER
    if (!req.params.userId) {
        req.params.userId = req.user.id;
    }

    next();
}


exports.getMyOrders = factoryHandler.getAll(Cart);
//  catchAsync(async (req, res, next) => {

//     const carts = await Cart.find({user: req.user.id});

//     res.status(200).json({
//         status: 'success',
//         results: carts.length,
//         carts
//     })
// })

exports.getAllOrders = factoryHandler.getAll(Cart);
exports.moveToWishlist = factoryHandler.createOne(Wish);


exports.createOrder = catchAsync(async (req, res, next) => {

    const cart = await Cart.create(req.body);

    res.status(200).json({
        status: 'success',
        cart
    })
})

exports.getOrder = factoryHandler.getOne(Cart);

// catchAsync(async (req, res, next) => {

//     const { id } = req.params;

//     const cart = await Cart.findById(id);

//     if (!cart) {
//         return next(new AppError('No Order found with that ID', 404))
//     }



//     res.status(200).json({
//         status: 'success',
//         cart
//     })


// })


exports.updateOrder = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const cart = await Cart.findByIdAndUpdate(id, req.body);

    if (!cart) {
        return next(new AppError('No doc found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        cart
    })


})


exports.deleteOrder = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const cart = await Cart.findByIdAndDelete(id);

    res.status(204).json({
        status: 'success',
        cart
    })


})


exports.getCartStats = catchAsync(async (req, res, next) => {

    const stats = await Cart.find({user: req.user._id});
    let amount = 0;
    let loop = 0;

    stats.forEach( _ => {
        amount += stats[loop].product.price;
        loop++;
    });

    res.status(200).json({
        status: 'success',
        results: stats.length,
        amount
    })

})