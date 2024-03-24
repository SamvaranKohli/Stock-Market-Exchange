const mongoose = require('mongoose');

const stockSchema = mongoose.Schema({
    tradingSymbol: {
        type : String,
        required : [true, 'A stock must have a trading symbol']
    },
    open: {
        type: Number,
        required: [true, 'A stock must have an open'],
        default: 0
    },
    high: {
        type: Number,
        required: [true, 'A stock must have a high price'],
        default: 0
    },
    low: {
        type: Number,
        required: [true, 'A stock must have a high price'],
        default: Infinity
    },
    close: {
        type: Number,
        required: [true, 'A stock must have a high price'],
        default: 0
    },
    prevClose: {
        type: Number,
        required: [true, 'A stock must have a high price'],
        default: 0
    },
    volume: {
        type: Number,
        required: [true, 'A stock must have a high price'],
        default: 0
    }
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;

