const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const rateLimit = require("express-rate-limit");
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');
const hpp = require('hpp');
const app = express();



//ROUTES DECLARATION
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController')
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const addressRoutes = require('./routes/addressRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const historyRoutes = require('./routes/historyRoutes');
//MIDDLEWARE 
app.use(express.json()); // FOR BEING ABLE TO USE REQ AND MORE or you can use bodyparser
//app.use(morgan('dev')) //DISPLAYS ROUTE ACCESSED WITH RESPONSE TIME
app.use(express.static('./public'));
//Set security HTTP headers
app.use(cors());
app.options('*', cors());

//Development logging
console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV ==='development'){
    app.use(morgan('dev'));
}
app.use( (req, res, next) => {

    console.log('hello from the middleware');
    
    next();

})
app.use(mongoSanitize());
app.use(xss());

//Prevent paramiter popullation
app.use(hpp({
    whitelist: [ 'price']
}));

app.use(helmet())
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 + 1000,
    message: 'Too many request from this IP, Please try again in an hour!'
})

app.use('/api', limiter);


//APP.USE ROUTES DECLARATION MIDDLEWARE
app.use('/api/v1/carts', cartRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/address', addressRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/history', historyRoutes);

app.all('*', (req, res, next) => {

    //1) 
    // res.status(404).json({
    //     status: 'fail',
    //     message: `cant find ${req.originalUrl} on this server`
    // })
    //next();

    //2)
    // const err = new Error(`cant find ${req.originalUrl} on this server`);
    // err.status = 'fail';
    // err.statusCode = 404;
    
    // next(err);


    //3
    next(new AppError(`cant find ${req.originalUrl} on this server`, 404));
})


app.use(globalErrorHandler);



module.exports = app;


