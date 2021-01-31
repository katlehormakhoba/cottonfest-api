const AppError = require("../utils/appError");

const handleInvalidId = err => {

    const message = `Invalid ${err.path} of ${err.value}`;
    return new AppError(message, 400);
}

const handleDublicateFields = err => {

    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message= `Dublicate value of '${value}'. Please try different value`;
    return new AppError(message, 400);
}

const handleValidatorError = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data : ${errors.join(', ')}`;
    return new AppError(message, 400);
}

const handleInvalidJwt = () => new AppError('Invalid token. Please login again', 401);
const handleExpiredJwt = () => new AppError('Session has expired. Please login again', 401);
const handleStripeInvalidRequest = err => new AppError(err.message, 400);

const sendErrorDev = (err, res) => {

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    })

}

const sendErrorProd = (err, res) => {

    if (err.isOperational) {

        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })

    } else {
        console.error('ERROR: ',err);

        res.status(500).json({
            status: 'error',
            message: 'Oooops something went wrong!'
        })
    }


}


module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';


    if (process.env.NODE_ENV === 'development') {

        // if(err.kind === 'ObjectId') err = handleInvalidId(err);
        // if(err.code === 11000) err = handleDublicateFields(err);
        // if (err.errors) err = handleValidatorError(err);
        // if(err.name === 'JsonWebTokenError') err = handleInvalidJwt();
        // if(err.name === 'TokenExpiredError') err = handleExpiredJwt();
        // if(err.type === 'StripeInvalidRequestError') err = handleStripeInvalidRequest(err);

        sendErrorDev(err, res)

    } else {

        let error = { ...err };
        //ERROR
        if(err.kind === 'ObjectId') err = handleInvalidId(err);
        if(err.code === 11000) err = handleDublicateFields(err);
        if (err.errors) err = handleValidatorError(err);
        if(err.name === 'JsonWebTokenError') err = handleInvalidJwt();
        if(err.name === 'TokenExpiredError') err = handleExpiredJwt();
        if(err.type === 'StripeInvalidRequestError') err = handleStripeInvalidRequest();


        sendErrorProd(err, res);
    }

    next();

}