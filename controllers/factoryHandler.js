const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = Model => catchAsync(async (req, res, next) => {

    const id = req.params.id;

    const doc = await Model.findByIdAndDelete(id);

    if(!doc){
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
        status: "success",
        data: null
    })


})


exports.updateOne = Model => catchAsync(async (req, res, next) => {

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if(!doc){
        return next(new AppError('No doc found with that ID', 404));
    }

    res.status(200).json({
        status: "success",
        data: doc
    })


})


exports.createOne = Model => catchAsync(async (req, res, next) => {

    const newDoc = await Model.create(req.body);

    res.status(200).json({
        status: "success",
        data: newDoc
    })

})


exports.getOne = (Model, populateOp) => catchAsync(async (req, res, next) => {



    let query = Model.findById(req.params.id);

    if(populateOp){
        query = query.populate(populateOp)
    }
    const doc = await query;

    if(!doc){
        return next(new AppError('No docment found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: doc
    })

})

exports.getAll = Model => catchAsync(async (req, res, next) => {

    
    let filter = {};

    if(req.params.productId) filter = { product : req.params.productId};
    if(req.params.userId) filter = { user : req.params.userId};
    if(req.params.orderID) filter = { orderID : req.params.orderID};


    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const doc = await features.query;

    res.status(200).json({
        status: "success",
        results: doc.length,
        data: doc
    })


})