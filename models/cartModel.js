const mongoose = require('mongoose');


const cartSkema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'Cart must belong to a product.']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Cart must belong to a user.']
    },
    quantity: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },

})

cartSkema.pre(/^find/, function(next) {

    this.populate({
        path: 'product',
        select: 'name category price color coverImage'
    })

    next();
})


const Cart = mongoose.model('Cart', cartSkema);

module.exports = Cart;