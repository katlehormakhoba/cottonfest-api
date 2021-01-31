const mongoose = require('mongoose');


const historySkema =  new mongoose.Schema({
    product: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'Order history must belong to a product.']
    }],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Order history must belong to a user.']
    },
    orderID: {
        type: String,
        required: [true, 'Order history must have a ID'],
        unique: true

    },
    createdAt: {
        type: Date,
        default: Date.now()
    }

},{
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
})

historySkema.pre(/^find/, function(next) {

    this.populate({
        path: 'product',
        select: 'name category price color coverImage'
    })

    next();
})

const History = mongoose.model('History', historySkema);

module.exports = History;