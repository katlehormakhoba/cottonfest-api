const stripe = require('stripe')(`${process.env.STRIPE_SECRETE_KEY}`);
const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const History = require('../models/historyModel');
const Address = require('../models/addressModel');
const Cart = require('../models/cartModel');
const AppError = require('../utils/appError');

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

exports.createPayment = catchAsync(async(req, res, next) => {


    //1) get cart amount
    const amount = await getCartStats(req, res, next);

    if(amount === 0){
        return next( new AppError('Sorry there is nothing to check out on cart', 500));
    }


    let obj = {};
    let loop = 0;
    let ids = [];
    let orderID = `${req.user._id}-${Date.now()}`;
    const products = await Cart.find({user: req.user._id}); //TO GET MY PRODUCTS IDS FROM CART

    //SETTING MY PRODUCTS IDS FROM CART
    products.forEach( _ => {
        // console.log(products[loop].product._id);
        ids.push(products[loop].product._id)
        loop++;
    });

    //SETTING ORDER ID
    obj.orderID = orderID;
    req.body.orderID = orderID;
    //SETTING PRODUCT IDS
    obj.product = ids;
    req.body.product = ids;
    //SETTING USER IDS
    obj.user = req.user._id;    
    

    await Address.create(req.body);
    await History.create(obj);

    req.amount = amount;
    next();
})


const getCartStats = async(req, res, next) => {

    const cart = await Cart.find({user: req.user._id});
    let amount = 0;
    let loop = 0;

    cart.forEach( _ => {
        amount += cart[loop].product.price;
        loop++;
    });
    return amount;

}



exports.getCheckoutSession = catchAsync(async( req, res, next) => {

    //1) get currently booked tour details
    const product = await Product.findById(req.params.id);

    //2) Creating checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `https://cottonfest.herokuapp.com/order`,
        cancel_url: `https://cottonfest.herokuapp.com/cart`,
        customer_email: req.user.email,
        client_reference_id: req.params.id,
        line_items: [{
            name: `${product.name} `,
            description: product.summary,
            images: [product.coverImage],
            amount: (Math.round(product.price * 0.065)) * 100 ,
            currency: 'usd',
            quantity: 1
        }]
    })

    //3) response
    res.status(200).json({
        status: 'success',
         session
    })
})


exports.getAllCheckoutSession = catchAsync(async( req, res, next) => {

    
    

    //2) Creating checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `https://cottonfest.herokuapp.com/order`,
        cancel_url: `https://cottonfest.herokuapp.com/cart`,
        customer_email: req.user.email,
        line_items: [{
            name: 'Cotton Fest Store ',
            description: 'Salutas and stay drippy from us...',
            images: [`${req.protocol}://${req.get('host')}/img/purchase/cart.jpg`],
            amount: (Math.round(req.amount * 0.065)) * 100 ,
            currency: 'usd',
            quantity: 1
        }]
    })

    await Cart.deleteMany({user: req.user._id});

    // 3) response

    res.status(200).json({
        status: 'success',
        session
    })
})