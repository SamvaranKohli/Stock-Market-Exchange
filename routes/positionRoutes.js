const express = require('express');
const positionController = require('./../controllers/positionController');

const router = express.Router();

router
    .route('/:id')
    .get(positionController.getPositions)

module.exports = router;