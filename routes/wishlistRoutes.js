const router = require('express').Router();
const wishlistController = require('../controllers/wishlistController');
const authController = require('../controllers/authController');


router.use(authController.protect);

router.route('/myWishlist')
    .get(wishlistController.setProductUserIds, wishlistController.getMyWishlist)

router.route('/addOrder/:id') //Product ID
    .post(wishlistController.setProductUserIds, wishlistController.deleteAndMoveToCart, wishlistController.moveToCart);

router.route('/')
    .get(authController.restrictTo('admin'), wishlistController.getAllWishlist);

router.route('/:id')
    .delete(wishlistController.deleteWishlist)
    .post(wishlistController.setProductUserIds, wishlistController.createWishlist) //move this post


module.exports = router;
