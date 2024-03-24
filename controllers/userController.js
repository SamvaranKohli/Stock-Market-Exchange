const User = require('./../models/userModel');

exports.getAllUsers = async (req, res) => {

    try{
        const users = await User.find();
        res
        .status(200)
        .json({
            status : 'success',
            requestedAt : req.requestTime,
            results : users.length,
            users:users
        });

    }catch (err) {
        res
        .status(404)
        .json({
            status : 'fail',
            requestedAt : req.requestTime,
            message : err
        });
    }
};

exports.createUser = (req, res) => {
    res
    .status(500)
    .json({
        status : 'error',
        message : 'function not defined'
    })
}

exports.getUser = (req, res) => {
    res
    .status(500)
    .json({
        status : 'error',
        message : 'function not defined'
    })
}

exports.updateUser = (req, res) => {
    res
    .status(500)
    .json({
        status : 'error',
        message : 'function not defined'
    })
}

exports.deleteUser = (req, res) => {
    res
    .status(500)
    .json({
        status : 'error',
        message : 'function not defined'
    })
}