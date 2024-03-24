const PriorityQueue = require('./../Order Matching/PriorityQueue');

function BuyComparator(a, b) {
    if (a.price === b.price) {
        return a.timestamp - b.timestamp;
    }
    return b.price - a.price;
}

function SellComparator(a, b) {
    if (a.price === b.price) {
        return a.timestamp - b.timestamp;
    }
    return a.price - b.price;
}

class AllStocks
{
    constructor() {
        this.stocks = {};
    }

    addStock(tradingSymbolId) {
        this.stocks[tradingSymbolId] = {
            BUY: new PriorityQueue(BuyComparator),
            SELL: new PriorityQueue(SellComparator)
        };
    }
}

const allStocks = new AllStocks();

module.exports = allStocks;