const router = require('express').Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');



router.route('/me').get(authController.protect, userController.getMe, userController.getUser);
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

router.use(authController.protect);

router.route('/updatePassword').patch(authController.updatePassword);
router.route('/updateMe').patch(userController.uploadUserPhoto, userController.updateMe);
router.route('/deleteMe').delete(userController.deleteMe);

router.route('/')
    .get(authController.restrictTo('admin'), userController.getAllUsers)
    .post(authController.restrictTo('admin'), userController.createUser);

router.route('/:id')
    .get(authController.restrictTo('admin'), userController.getUser)
    .patch(userController.authForUpdatePassword, userController.updateUser)
    .delete(authController.restrictTo('admin'), userController.deleteUser);




module.exports = router;