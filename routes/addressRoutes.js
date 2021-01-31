const router = require('express').Router();
const addressController = require('../controllers/addressController');
const authController = require('../controllers/authController');


router.use(authController.protect);

router.route('/myAddress')
    .get(addressController.setUserAddressId, addressController.getUserAddress);


router.route('/')
    .get(authController.restrictTo('admin'), addressController.getAllAdresses)
    

router.route('/:id')
    .patch(addressController.updateAddress)
    .delete(addressController.deleteAddress);

module.exports = router;