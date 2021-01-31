const mongoose = require('mongoose');
const Product = require('./productModel');



const reviewSkema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review can not be empty']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'Review must belong to a product.']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user.']
    }
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})



reviewSkema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    })

    next();
})


reviewSkema.statics.calcAverageRatings = async function(productId) {

    const stats = await this.aggregate([
        {
            $match: { product: productId}
        },
        {
            $group: {
                _id: '$product',
                nRatings: {$sum: 1},
                avgRating: {$avg: '$rating'}
            }
        }
    ]);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            ratingAverage: stats[0].avgRating
        });
    } else {
        await Product.findByIdAndUpdate(tourId, {
            ratingAverage: 4.5
        });
    }
}


reviewSkema.post('save', function(){

    this.constructor.calcAverageRatings(this.product);

  
    
})

const Review = mongoose.model('Review', reviewSkema);


module.exports = Review;