const Order = require('./../models/orderModel');

exports.getAllBuyOrders = async () => {

    const orders = await Order.find({status: 'open', transactionType: 'buy'});
    return orders;
};

exports.getAllSellOrders = async () => {

    const orders = await Order.find({status: 'open', transactionType: 'sell'});
    return orders;
};

exports.updateOrder = async (order) => {

    await Order.findByIdAndUpdate(order._id, order, {
        runValidators: true
    });
}

exports.getAllOrders = async (req, res) => {

    console.log('Hello');

    try{
        const orders = await Order.find({userID : req.params.id});
        res
        .status(200)
        .json({
            status : 'success',
            results : orders.length,
            orders:orders
        });

    }catch (err) {
        res
        .status(404)
        .json({
            status : 'fail',
            message : err
        });
    }
};

exports.createNewOrder = async (req, res) => {

    try{
        const newOrder = await Order.create(req.body);
        res
        .status(201)
        .json({
            status : 'success',
            order : newOrder
        });
    } catch (err) {
        res
        .status(400)
        .json({
            status : 'fail',
            message : err
        });
    }

};