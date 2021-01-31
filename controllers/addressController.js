const Address = require('../models/addressModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factoryHandler = require('./factoryHandler');


const filterObj = (obj, ...allowedFields) => {

    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    })

    return newObj;

}

exports.setUserAddressId = (req, res, next) => {

    //FOR GETTING USER ADDRESS USING FACTORY HANDLER
    if (!req.params.userId) {
        req.params.userId = req.user.id;
    }

    next();
}

exports.getAllAdresses = factoryHandler.getAll(Address);
exports.getUserAddress = factoryHandler.getAll(Address);
exports.updateAddress = factoryHandler.updateOne(Address);
exports.deleteAddress = factoryHandler.deleteOne(Address);