const mongoose = require('mongoose');
const dotenv = require('dotenv');
const orderController = require('./../controllers/orderController');
const stockQueuesController = require('./../controllers/StockQueuesController');
const orderProcessing = require('./orderProcessing');
const stockController = require('./../controllers/stockController')

dotenv.config({path : './../config.env'});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => console.log('Connected to DB'));

const connection = mongoose.connection;

const buyOrdersPromise = orderController.getAllBuyOrders();
const sellOrdersPromise = orderController.getAllSellOrders();

stockController.addAllStocksToQueue()
    .then(() => {
        return Promise.all([buyOrdersPromise, sellOrdersPromise]);
    })
    .then(([buyOrders, sellOrders]) => {

        orderProcessing.processInitalBuyOrders(buyOrders);
        orderProcessing.processInitalSellOrders(sellOrders);

        for (const tradingSymbolId in stockQueuesController.stocks) {
            let ordersLeft = true;
            while (ordersLeft) {
                ordersLeft = orderProcessing.processOrders(tradingSymbolId);
            }
        }
    })
    .catch(err => {
        console.error(err);
    });

connection.once('open', function () {

    const collection = connection.collection('orders');
    const changeStream = collection.watch();

    changeStream.on('change', function(change) {

        if (change.operationType === 'insert') {
            const newOrder = change.fullDocument;
            
            orderProcessing.addNewOrderToQueue(newOrder)
            .then((result) => {
                
                if (result === true) {
                    orderProcessing.processOrders(newOrder.tradingSymbolId);
                    //console.log(newOrder);
                }
            })
            .catch((error) => {
                console.error('Error adding order to queue:', error);
            });

        }
                
    });
});