const Stock = require('./../models/stockModel');
const stockQueuesController = require('./StockQueuesController');

exports.addAllStocksToQueue = async () => {
    
    const stocks = await Stock.find();

    for(const stock of stocks)
    {
        stockQueuesController.addStock(stock._id);
    }
}

exports.getAllStocks = async (req, res) => {
    
    const stocks = await Stock.find();
    res.json(stocks);
}

exports.getStock = async (id) => {

    const stock = await Stock.findById(id);
    return stock;

}

exports.updateStock = async (stock) => {

    await Stock.findByIdAndUpdate(stock.id, stock);

}