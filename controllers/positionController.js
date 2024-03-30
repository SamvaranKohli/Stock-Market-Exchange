const Order = require('./../models/orderModel');

exports.getPositions = async (req, res) => {

    try{
        const orders = await Order.find({userID : req.params.id, status : 'completed'});

        

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
}