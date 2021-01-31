const router = require('express').Router();
const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');


router.use(authController.protect);

router.route('/myOrders').get(cartController.setProductUserIds, cartController.getMyOrders)
router.route('/cartStates').get(cartController.getCartStats);
router.route('/addWishlist/:id')
    .post(cartController.setProductUserIds, cartController.deleteAndMoveToWishlist, cartController.moveToWishlist);

router.route('/')
    .get(authController.restrictTo('admin', 'user'), cartController.getAllOrders);

router.route('/:id')
    .delete(cartController.deleteOrder)
    .patch(cartController.updateOrder)
    .get(cartController.getOrder)
    .post(cartController.setProductUserIds, cartController.createOrder)



module.exports = router;