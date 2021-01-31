const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const userSkema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name'],
        minlength: [4, 'Minimum lenght of name must be 4'],
        validate: [validator.isAlpha, 'Invalid name type']
    },
    surname: {
        type: String,
        required: [true, 'Please tell us your surname'],
        minlength: [4, 'Minimum lenght of surname must be 4'],
        maxlength: [10, 'Maximum lenght of surname must be 10'],
        validate: [validator.isAlpha, 'Invalid surname type']
    },
    gender: {
        type: String,
        required: [true, 'Please specify your gender'],
        minlength: [1, 'Minimum lenght of gender must be 1'],
        enum: {
            values: ['F', 'M'],
            message: 'Please enter F for female & M for Male'
        },
        validate: [validator.isAlpha, 'Invalid surname type']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: {
            validator: function(el){
                return validator.isEmail(el);
            },
            message: 'Please provide valid email'
        }

    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    photo: {
        type: String,
        default: 'img/users/default_feeeny.png'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [5, 'Minimum lenght of password must be 5'],
        maxlength: [8, 'Maximum lenght of password must be 8'],
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function(el){
                return validator.equals(el, this.password);
            },
            message: 'Password do not match'
        }
    },
    passwordChangedAt: {
        type: Date,
        default: Date.now()
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true,
        select: false
    }

})

userSkema.methods.correctPassword = async function(candidatePassword, userPassword){
    // console.log(this.password);
    // console.log(userPassword);

    return await bcrypt.compare(candidatePassword, userPassword);
}

userSkema.methods.createPasswordResetToken = function(){

    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //adds 10 min from now
    console.log({resetToken}, this.passwordResetToken);
    return resetToken;


}


userSkema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {

        const jwtDateIn = new Date(JWTTimestamp * 1000);
        return jwtDateIn < this.passwordChangedAt;

        // const changedTimeStamp = parseInt(this.passwordChangeAt.getTime() / 1000, 10);
        // //console.log('hey thr  ', changedTimeStamp, JWTTimestamp);
        // return JWTTimestamp < changedTimeStamp;
    }
    //False means NOT changed
    return false;
}

userSkema.pre('save', async function(next) {
    //only run funftion if password was actually modidied
    if (!this.isModified('password')) return next();

    //hash pasword with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    //delete passwordCornfim field
    this.confirmPassword = undefined;
    next();

})

userSkema.pre('save', function(next){
    if(!this.isModified('password') || this.isNew){ // password reset 
        return next();
    }

    this.passwordChangeAt = Date.now();
    next();
})

userSkema.pre(/^find/, function(next) {
    this.find({isActive: {$ne: false}});

    next();
})




const User = mongoose.model('User', userSkema);

module.exports = User;