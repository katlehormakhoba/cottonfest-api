const mongoose = require('mongoose');

const addressSkema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Address must have a user']
    },
    street: {
        type: String,
        required: [true, 'Address must have a street'],
    },
    code: {
        type: String,
        required: [true, 'Address must have code.'],
        minlength: [3, 'Invalid address code'],
        maxlength: [6, 'Invalid address code']
    },
    city: {
        type: String,
        required: [true, 'Address must have city or region']
    },
    description: {
        type: String,
        minlength: [5, 'Minimum lenght of description must be 5']
    },
    amount: {
        type: Number,
        required: [true, 'Order address must have amount Due'],
        min: [100, 'Invalid amount due']
    },
    orderID: {
        type: String,
        required: [true, 'Address must have order history  ID'],
        unique: true

    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
    
})


const Address = mongoose.model('Address', addressSkema);

module.exports = Address;