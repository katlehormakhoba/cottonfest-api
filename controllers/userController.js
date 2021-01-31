const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factoryHandler = require('./factoryHandler');
const sharp = require('sharp');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');



const filterObj = (obj, ...allowedFields) => {

    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) {

            if(obj[el] === ""){

            }else{
                newObj[el] = obj[el];
            }
        }
    })

    return newObj;

}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'img/users',
        format: (req, file) => {
            return file.mimetype.split('/')[1];
        },
        public_id: (req, file) => {
            const filename = `user-${req.user.id}-${Date.now()}`;
            file.filename = filename;
            // console.log(file);
            return filename;

        }
    },
    

})
// const multerStorage = multer.memoryStorage();
// const multerStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'public/img/users')
//     },
//     filename: function (req, file, cb) {
//         const ext = file.mimetype.split('/')[1];
//         console.log(file.mimetype)
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// })

const multerFilter = (req, file, cb) => {
    // console.log(file.mimetype)

    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload image only.', 400), false);
    }
}

const upload = multer({ storage: cloudStorage, fileFilter: multerFilter })

exports.uploadUserPhoto = upload.single('photo');

// exports.resizeUserPhoto = (req, res, next) => {

//     if(!req.file) return next();

//     req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    
//     sharp(req.file.buffer)
//         .resize(500, 500)
//         .toFormat('jpeg')
//         .jpeg({quality:  90})
//         .toFile(`public/img/users/${req.file.filename}`)

//         next();
// }

exports.authForUpdatePassword = (req, res, next) => {

    if(req.body.password || req.body.confirmPassword){
        return next(new AppError('This route is not for updating password. Please use /updatePassword', 400));
    }

    next();
}

exports.getAllUsers = catchAsync(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        status: 'success',
        results: users.length,
        users
    })
})

exports.updateMe = catchAsync(async (req, res, next) => {

    if(req.body.password || req.body.confirmPassword){
        return next(new AppError('This route is not for updating password. Please use /updatePassword', 400));
    }

    const filteredBody = filterObj(req.body, 'name', 'email');

    // console.log(req.file);

    if(req.file){
        // console.log('we have a file bro',filteredBody);
        filteredBody.photo = req.file.filename;
    }

    const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
        new: true,
        runValidators: true
    });    

    res.status(200).json({
        status: 'success',
        user
    })
})

exports.deleteMe = catchAsync(async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.user.id, { isActive: false });

    res.status(204).json({
        status: 'success',
        data: null
    })

})

exports.getMe = (req, res, next) => {
    req.params.id = req.user._id;

    next();
}


exports.getUser = factoryHandler.getOne(User);
exports.updateUser = factoryHandler.updateOne(User);
exports.deleteUser = factoryHandler.deleteOne(User);


exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined. Please use /signup instead'
    })
}