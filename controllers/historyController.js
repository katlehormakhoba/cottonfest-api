const Cart = require('../models/cartModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factoryHandler = require('./factoryHandler');
const History = require('../models/historyModel');
const Address = require('../models/addressModel');


exports.setOrderId = (req, res, next) => {

    req.params.orderID = req.params.id;
    next();
}

exports.setProductUserIds = (req, res, next) => {
    //FOR GETTING USER ORDERS USING FACTORY HANDLER
    if (!req.params.userId) {
        req.params.userId = req.user.id;
    }

    next();
}


exports.getMyHistory = factoryHandler.getAll(History);
exports.getMyHistoryOrders = factoryHandler.getAll(History);



















//ROUTE HAS BEEN MOVED TO PAYMENT

exports.createPayment = catchAsync(async(req, res, next) => {
    // let obj = {};
    // let loop = 0;
    // let ids = [];
    // let orderID = `${req.user._id}-${Date.now()}`;
    // const products = await Cart.find({user: req.user._id}); //TO GET MY PRODUCTS IDS FROM CART

    // //SETTING MY PRODUCTS IDS FROM CART
    // products.forEach( _ => {
    //     // console.log(products[loop].product._id);
    //     ids.push(products[loop].product._id)
    //     loop++;
    // });

    // //SETTING ORDER ID
    // obj.orderID = orderID;
    // req.body.orderID = orderID;
    // //SETTING PRODUCT IDS
    // obj.product = ids;
    // //SETTING USER IDS
    // obj.user = req.user._id;
    

    // const address = await Address.create(req.body);
    // const history = await History.create(obj);

    res.status(200).json({
        status: 'success',
        data: 'Sorry this route is nolonger active'
        
    })
})