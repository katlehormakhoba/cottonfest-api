const router = require('express').Router({ mergeParams: true});
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

router.route('/')
    .get(reviewController.getAllReviews)
    .post(authController.protect, reviewController.setProductUserIds, reviewController.createReview)

router.use(authController.protect);

router.route('/:id')
    .delete(reviewController.deleteReview)
    .patch(reviewController.updateReview)


module.exports = router;