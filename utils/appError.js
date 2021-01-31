class AppError extends Error{

    constructor(message, statusCode){
        super(message);

        // this.message = message; to use take out super() and extends
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
   
}

module.exports = AppError;