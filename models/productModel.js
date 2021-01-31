const mongoose = require('mongoose');

const productSkema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A product must have a name.'],
        unique: true,
        trim: true, // For removing extra spaces
        maxlength: [40, 'A product name must have less or equal then 40 characters'],
        minlength: [10, 'A product name must have more or equal then 10 characters']

    },
    brand: {
        type: String,
        required: [true, 'A product must have a brand name.'],
    },
    category: {
        type: String,
        required: [true, 'A product must have a category'],
        enum: {
            values: ['jeans', 'shorts','t-shirts','hoodies', 'sneakers'],
            message: 'Category is either jeans, shorts, hoodies, t-shirts, sneakers'
        }
    },
    ratingAverage: {
        type: Number,
        default: 4.5   
    },
    price: {
        type: Number,
        required: [true, 'A product must have a price'],
        min: [40, 'A product price must be greater then 40']
    },
    discountPrice:{
        type: Number,
        validate: {
            validator: function(val){
                
                return val < this.price;
            },
            message: 'Discount price must be less than current price'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A product must have a summary'],
        maxlength: [90, 'A product summary must have less or equal then 90 characters'],
        minlength: [50, 'A product summary must have more or equal then 50 characters']
    },
    color: {
        type: String,
        required: [true, 'A product must have a color']
    },
    quantity: {
        type: Number,
        required: [true, 'A product must have its own quantity']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [300, 'A product description must have less or equal then 300 characters'],
        minlength: [80, 'A product description must have more or equal then 80 characters']
    },
    coverImage: {
        type: String,
        required: [true, 'A product must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    }


},{
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
})

// productSkema.virtual('stringDate').get(function(next){
//     let strDate = new Date(this.createdAt);

//     return strDate.toUTCString();
//     next();
// })


//VIRTUAL POPULATE
productSkema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product'
})
//QUERY MIDDLEWARE

productSkema.pre(/^find/, function(next){

    //THIS IS AN EXAMPLE OF HOW IT WORKS IT EXCLUDES THIS DOCUMENT FRO THE RESULTS
    this.find({price: { $ne: 1700 }}); 

    //some code...
    next();
})



// productSkema.pre('save')
productSkema.pre('aggregate', function(next){

    this.pipeline().unshift({
        $match: {price: {$ne: 1700}}
    })
    next();
})



const Product = mongoose.model('Product', productSkema);

module.exports = Product;
