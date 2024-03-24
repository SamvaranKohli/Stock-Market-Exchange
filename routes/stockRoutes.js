const express = require('express');
const stockController = require('./../controllers/stockController');

const router = express.Router();

// router.param('id', tourController.checkID);

router
    .route('/')
    .get(stockController.getAllStocks);

// router
//     .route('/:id')
//     .get(tourController.getTour)
//     .patch(tourController.updateTour)
//     .delete(tourController.deleteTour);

module.exports = router;