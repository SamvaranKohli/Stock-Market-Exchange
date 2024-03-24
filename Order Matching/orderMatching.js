const orderController = require('./../controllers/orderController');
const stockController = require('./../controllers/stockController');
const Stock = require('./../models/stockModel');

exports.matchOrder = async (buyOrders, sellOrders) => {

    const topBuyOrder = buyOrders.peek();
    const topSellOrder = sellOrders.peek();

    if(topBuyOrder.status === 'open' && topSellOrder.status === 'open' && topSellOrder.price <= topBuyOrder.price)
    {
        const orderQuantity = Math.min(topBuyOrder.quantity-topBuyOrder.filledQuantity, topSellOrder.quantity-topSellOrder.filledQuantity);

        await executeOrder(topBuyOrder, topSellOrder, buyOrders, sellOrders, orderQuantity);

        return true;
    }

    return false;

};

function updateFilledPriceArray (topOrder, price, quantity) {

    if (!topOrder.filledPrice) {
        topOrder.filledPrice = [];
    }

    const filledPriceIndex = topOrder.filledPrice.findIndex(item => item.price === price);

    if(filledPriceIndex !== -1) {
        topOrder.filledPrice[filledPriceIndex].quantity += quantity;
    }
    else {
        topOrder.filledPrice.push({price: price, quantity: quantity});
    }
}

async function updateStockData(id, filledPrice, quantity) {
    try {
        const stock = await stockController.getStock(id);

        if(filledPrice === Infinity || filledPrice === -Infinity)
        {
            filledPrice = stock.close;
        }

        if (stock.open == 0) {
            stock.open = filledPrice;
        }

        if (stock.high < filledPrice) {
            stock.high = filledPrice;
        }

        if (filledPrice !== Infinity && stock.low > filledPrice) {
            stock.low = filledPrice;
        }

        console.log(filledPrice);

        stock.close = filledPrice;
        stock.volume += quantity;

        await stockController.updateStock(stock);
    } catch (err) {
        console.error(err);
    }
}

async function executeOrder(topBuyOrder, topSellOrder, buyOrders, sellOrders, quantity) {

    try{
        const id = topBuyOrder.tradingSymbolId;

        topBuyOrder.filledQuantity += quantity;
        const filledPrice = Math.min(topSellOrder.price, topBuyOrder.price);

        updateFilledPriceArray(topBuyOrder, filledPrice, quantity);  

        if(topBuyOrder.filledQuantity >= topBuyOrder.quantity)
        {
            topBuyOrder.status = 'completed';
            buyOrders.removeById(topBuyOrder._id);
        }

        topSellOrder.filledQuantity += quantity;
        updateFilledPriceArray(topSellOrder, filledPrice, quantity);

        if(topSellOrder.filledQuantity >= topSellOrder.quantity)
        {
            topSellOrder.status = 'completed';
            sellOrders.removeById(topSellOrder._id);
        }
       

        await Promise.all([
            orderController.updateOrder(topBuyOrder),
            orderController.updateOrder(topSellOrder),
            updateStockData(id, filledPrice, quantity)
        ]);
    }
    catch (err) {
        console.error(err);
    }

}