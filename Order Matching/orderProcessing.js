const orderMatching = require('./orderMatching');
const orderController = require('./../controllers/orderController');
const stockQueuesController = require('./../controllers/StockQueuesController');

exports.processInitalBuyOrders = (buyOrders) => {

    buyOrders.forEach((order) => {

        const {tradingSymbolId} = order;

        // if(orderType === 'limit') {
        //     stockQueuesController.stocks[tradingSymbolId].BUY_LIMIT.queue(order);
        // }
        // else if(orderType === 'market') {
        //     stockQueuesController.stocks[tradingSymbolId].MARKET.queue(order);
        // }

        stockQueuesController.stocks[tradingSymbolId].BUY.enqueue(order);

    });
}

exports.processInitalSellOrders = (sellOrders) => {

    sellOrders.forEach((order) => {

        const {tradingSymbolId} = order;

        // if(orderType === 'limit') {
        //     stockQueuesController.stocks[tradingSymbolId].SELL_LIMIT.queue(order);
        // }
        // else if(orderType === 'market') {
        //     stockQueuesController.stocks[tradingSymbolId].MARKET.queue(order);
        // }

        stockQueuesController.stocks[tradingSymbolId].SELL.enqueue(order);

    });
}

// exports.processOrders = (tradingSymbolId) => {

//     var ordersLeft = false;

//     const marketQueueLength = stockQueuesController.stocks[tradingSymbolId].MARKET.length;
//     const buyLimitQueueLength = stockQueuesController.stocks[tradingSymbolId].BUY_LIMIT.length;
//     const sellLimitQueueLength = stockQueuesController.stocks[tradingSymbolId].SELL_LIMIT.length;

//     if(marketQueueLength === 0)
//     {
//         if(buyLimitQueueLength !== 0 && sellLimitQueueLength !== 0)
//         {
//             ordersLeft = orderMatching.matchOrder(stockQueuesController.stocks[tradingSymbolId].BUY_LIMIT, stockQueuesController.stocks[tradingSymbolId].SELL_LIMIT);
//         }
//     }
//     else
//     {
//         const transactionType = stockQueuesController.stocks[tradingSymbolId].MARKET.peek().transactionType;

//         if(transactionType === 'buy')
//         {
//             if(sellLimitQueueLength !== 0)
//             {
//                 ordersLeft = orderMatching.matchOrder(stockQueuesController.stocks[tradingSymbolId].MARKET, stockQueuesController.stocks[tradingSymbolId].SELL_LIMIT);
//             }
//         }
//         else if(transactionType === 'sell')
//         {
//             if(buyLimitQueueLength !== 0)
//             {
//                 ordersLeft = orderMatching.matchOrder(stockQueuesController.stocks[tradingSymbolId].BUY_LIMIT, stockQueuesController.stocks[tradingSymbolId].MARKET);
//             }
//         }
//     }

//     return ordersLeft;
// }

exports.processOrders = (tradingSymbolId) => {

    //const buyQueueLength = stockQueuesController.stocks[tradingSymbolId].BUY.length;
    //const sellQueueLength = stockQueuesController.stocks[tradingSymbolId].SELL.length;

    if (!stockQueuesController.stocks[tradingSymbolId].BUY.isEmpty() && !stockQueuesController.stocks[tradingSymbolId].SELL.isEmpty()) {
        console.log('Hello');
        const orderMatched = orderMatching.matchOrder(
            stockQueuesController.stocks[tradingSymbolId].BUY,
            stockQueuesController.stocks[tradingSymbolId].SELL
        );

        if (orderMatched === true) {
            exports.processOrders(tradingSymbolId);
        }
    }

    // if (sellQueueLength !== 0 && buyQueueLength !== 0) {
    //     console.log('Hello');
    //     const orderMatched = orderMatching.matchOrder(
    //         stockQueuesController.stocks[tradingSymbolId].BUY,
    //         stockQueuesController.stocks[tradingSymbolId].SELL
    //     );

    //     if (orderMatched === true) {
    //         exports.processOrders(tradingSymbolId);
    //     }
    // }
};

exports.addNewOrderToQueue = (newOrder) => {
    return new Promise((resolve, reject) => {
        try {
            const { transactionType, tradingSymbolId } = newOrder;

            if (transactionType === 'buy') {
                stockQueuesController.stocks[tradingSymbolId].BUY.enqueue(newOrder);
            } else {
                stockQueuesController.stocks[tradingSymbolId].SELL.enqueue(newOrder);
            }

            resolve(true);
        } catch (err) {
            reject(err);
        }
    });
};



// exports.addNewOrderToQueue = (newOrder) => {
//     return new Promise((resolve, reject) => {
//         const { transactionType, tradingSymbolId } = newOrder;

//         try {
//             if (transactionType === 'buy') {
//                 stockQueuesController.stocks[tradingSymbolId].BUY.queue(newOrder);
//             } else {
//                 stockQueuesController.stocks[tradingSymbolId].SELL.queue(newOrder);
//             }

//             console.log('Hello');

//             resolve();
//         } catch (err) {
//             reject(err);
//         }
//     });
// };

// exports.addNewOrderToQueue = (newOrder) => {
//     return new Promise((resolve, reject) => {

//         const {transactionType, tradingSymbolId, orderType} = newOrder;

//         try{
//             if(transactionType === 'buy')
//             {
//                 if(orderType === 'limit') {
//                     stockQueuesController.stocks[tradingSymbolId].BUY_LIMIT.queue(newOrder);
//                 }
//                 else if(orderType === 'market') {
//                     stockQueuesController.stocks[tradingSymbolId].MARKET.queue(newOrder);

//                 }
//             }
//             else
//             {
//                 if(orderType === 'limit') {
//                     stockQueuesController.stocks[tradingSymbolId].SELL_LIMIT.queue(newOrder);
//                 }
//                 else if(orderType === 'market') {
//                     stockQueuesController.stocks[tradingSymbolId].MARKET.queue(newOrder);
//                 }

//             }
 
//             //console.log('New entry added to the priority queue:', newOrder);

//             resolve();
//         }
//         catch(err) {
//             reject(err);
//         }

//     });
    
// }