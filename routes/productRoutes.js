const router = require('express').Router();
const productController = require('../controllers/productController');
const reviewRoutes = require('./reviewRoutes');
const cartRoutes = require('./cartRoutes');
const authController = require('../controllers/authController');

//MIDDLEWARE 
router.use('/:productId/reviews', reviewRoutes);


// router.param('id', (req, res, next, val) => {
//     console.log(`this is our id: ${val}`);

//     next();
// })

router.route('/product-stats')
    .get(authController.protect, authController.restrictTo('admin'), productController.getProductStats);

router.route('/').get(productController.getAllProducts)
    .post(authController.protect, authController.restrictTo('admin'), productController.createProduct);

router.route('/:id')
    .get(productController.getProduct)
    .patch(authController.protect, authController.restrictTo('admin'), productController.updateProduct)
    .delete(authController.protect, authController.restrictTo('admin'), productController.deleteProduct)



module.exports = router;