const User = require('../models/userModel');
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const crypto = require('crypto');
const validator = require('validator');
const sendEmail2 = require('../utils/mail2');




const signToken = user => {

    return jwt.sign(
        {
            id: user._id,
            name: user.name,
            photo: user.photo
        },
        process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXP }
    );

}

const createSendToken = (user, statusCode, message, res) => {

    const token = signToken(user);

    //create cookie
    const cookieOptions = res.cookie('jwt', token, {
        expires: new Date( Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 1000),
        httpOnly: true
    });

    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    //remove password from my output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        message,
        token,
        user

    })

}

exports.protect = catchAsync(async (req, res, next) => {

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in. Please login', 401))
    }


    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // console.log(decoded)

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return next(new AppError('The user bellonging to this token no longer exists', 401));
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('The user recently changed password please log in again', 401));
    }

    req.user = currentUser;

    next();

})


exports.restrictTo = (...roles) => {

    return (req, res, next) => {
        const { role } = req.user;

        if (!roles.includes(role)) {
            return next(new AppError('Sorry you dont have permission to perform this action', 403))
        }

        next();
    }
}
exports.signup = catchAsync(async (req, res, next) => {

    const newUser = await User.create(req.body);

    
    // await new sendEmail(newUser, `cottonfest-api-v1.herokuapp.com/api/v1/users/updateMe`).sendWelcome();

    createSendToken(newUser, 201, 'Signup was successful', res);

})

exports.login = async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    if (typeof(email) === "object") {
        return next(new AppError('Invalid email address', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    createSendToken(user, 200, 'Login was successful', res);


    

}

exports.forgotPassword = catchAsync( async(req, res, next) => {
    
    const { email } = req.body;
    
    const user = await User.findOne({email})

    if(!user){
        return next(new AppError('There is no user with that email', 404));
    }

    const resetToken = user.createPasswordResetToken();

   await user.save({validateBeforeSave: false});

   const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    try {
        // await sendEmail2({
        //     email: user.email,
        //     subject: 'Password reset token (valid for 10 min)',
        //     message
        // })

        await new sendEmail(user, resetUrl).sendReset();

        res.status(200).json({
            status: 'success',
            message: 'token sent to email!',
            resetUrl,
            resetToken
        });
    } catch (err) {

        console.log(err)
        user.createPasswordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        // res.status(404).json({
        //     status: 'fail',
        //     message: 'token not sent to email!',
        //     err
        // });
        return next(new AppError('There was an error sending the email, Please try again later', 500));

    }



})

exports.resetPassword = catchAsync(async (req, res, next) => {

    const token = await crypto.createHash('sha256').update(req.params.token).digest('hex');
    const {password, confirmPassword} = req.body;

    if(!password || !confirmPassword){
        return next(new AppError('Please provide passwords', 400));
    }

    if(confirmPassword !== password) return next(new AppError('Passwords do not match', 400));

    const user = await User.findOne({passwordResetToken: token});

    if( !user || Date.now() > user.passwordResetExpires){
        return next(new AppError('Token is invalid or has expired', 400));
    }


    user.password = password;
    user.confirmPassword = confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    createSendToken(user, 200, 'Password reset was successfull', res);

    // res.status(200).json({
    //     status: 'success',
    //     message: 'Password reset was successfull'
    // })

})

exports.updatePassword = catchAsync(async(req, res, next) => {

    const user = await User.findById(req.user._id).select('+password');

    const {password, oldPassword, confirmPassword} = req.body;

    if(!password || !confirmPassword || !oldPassword){
        return next(new AppError('Please provide passwords', 400));
    }

    // const correct = await user.correctPassword(password, user.password);

    if (!(await user.correctPassword(oldPassword, user.password))) {
        return next(new AppError('Incorrect password', 401));
    }

    user.password = password;
    user.confirmPassword = confirmPassword;

    await user.save();

    createSendToken(user, 200, 'Password updated successfuly', res);

    // res.status(200).json({
    //     status: 'success',
    //     message: 'Password updated successfuly'

    // })

})