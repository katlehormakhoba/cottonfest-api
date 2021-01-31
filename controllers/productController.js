const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const factoryHandler = require('./factoryHandler');




exports.getAllProducts = factoryHandler.getAll(Product);
exports.getProduct = factoryHandler.getOne(Product, 'reviews')
exports.createProduct = factoryHandler.createOne(Product);
exports.updateProduct = factoryHandler.updateOne(Product);
exports.deleteProduct = factoryHandler.deleteOne(Product);



exports.getProductStats = catchAsync(async (req, res, next) => {

    const stats = await Product.aggregate([
        {
            $match: {
                price: { $gte: 500 }
            }
        },
        {
            $group: {
                _id: null,
                numRatings: { $sum: '$ratingAverage' },
                avgRating: { $avg: '$ratingAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        }
    ]);

    res.status(200).json({
        status: "success",
        data: stats
    })


})






// exports.getAllProducts = catchAsync(async (req, res, next) => {

//     console.log(req.query);
//     const features = new APIFeatures(Product.find(), req.query)
//         .filter()
//         .sort()
//         .limitFields()
//         .paginate();

//     const products = await features.query;

//     res.status(200).json({
//         status: "success",
//         results: products.length,
//         data: products
//     })


// })



// exports.getProduct = catchAsync(async (req, res, next) => {
//     const product = await Product.findById(req.params.id).populate('reviews');

//     if(!product){
//         return next(new c('No product found with that ID', 404));
//     }

//     res.status(200).json({
//         status: 'success',
//         data: product
//     })

// })