const express = require('express');
const orderController = require('./../controllers/orderController');

const router = express.Router();

// router.param('id', tourController.checkID);

router
    .route('/')
    // .get(orderController.getAllOrders)
    .post(orderController.createNewOrder);

router
    .route('/:id')
    .get(orderController.getAllOrders)
    .get(orderController.getAllOrders, orderController.getPositions)

module.exports = router;