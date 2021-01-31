const router = require('express').Router();
const historyController = require('../controllers/historyController');
const authController = require('../controllers/authController');


router.use(authController.protect);

router.route('/')
    .get(historyController.setProductUserIds, historyController.getMyHistory)
    .post(historyController.setProductUserIds, historyController.createPayment);

router.route('/:id')
    .get(historyController.setOrderId, historyController.getMyHistoryOrders);


module.exports = router;