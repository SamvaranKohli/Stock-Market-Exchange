const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    tradingSymbolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'A order must have a Symbol ID']
    },
    tradingSymbol: {
        type: String,
        required: [true, 'A order must have a Symbol']
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'A order must have a user ID']
    },
    transactionType: {
        type : String,
        required : [true, 'A order must have a transaction type'],
        enum : {
            values: ['buy', 'sell'],
            message: 'Transaction type must be either buy or sell'
        }
    },
    orderType: {
        type : String,
        required : [true, 'A order must have a order type'],
        enum : {
            values: ['market', 'limit'],
            message: 'Order type must be either market or limit'
        }
    },
    quantity: {
        type : Number,
        required : [true, 'A order must have a quantity'],
        default: 1,
        min: [1, 'Quantity must be above or equal to 1'],
        validate: {
            validator: function(val) {
              const qty = parseFloat(val);
              return Number.isInteger(qty);
            },
            message: 'Quantity must be an integer'
          }
    },
    price: {
        type: Number,
        required: function () {
            return this.orderType === 'limit';
        },
        validate: {
            validator: function(val) {

                if(val === Infinity || val === -Infinity) {
                    return true;
                }

                const number = parseFloat(val);
                const hasTwoDecimalDigits = /^-?\d+(\.\d{0,2})?$/.test(number.toString());
                const isDivisibleBy5 = (number * 100) % 5 === 0;

                return (hasTwoDecimalDigits && isDivisibleBy5);
            },
            message: 'Price must in 0.05 intervals'
          }
    },
    filledPrice: {
        type: [{
            price: Number,
            quantity: Number
        }],
        required: true,
        default: []
    },
    filledQuantity: {
        type: Number,
        required: [true, 'A order must have a price'],
        default: 0,
        max: [this.quantity, 'Filled Quantity must be below or equal to quantity']
    },
    status: {
        type: String,
        required: [true, 'A order must have a status'],
        default: 'open',
        enum: {
            values: ['open', 'completed', 'cancelled'],
            message: 'Status must be open or completed or cancelled'
        }
    }
}, {
    timestamps: true
});

orderSchema.path('price').default(function() {
    if (this.orderType === 'market') {
        if (this.transactionType === 'buy') {
            return Infinity;
        } else if (this.transactionType === 'sell') {
            return -Infinity;
        }
    }
    return this.price;
});

// tourSchema.virtual('durationWeeks').get(function () {
//     return this.duration/7;
// });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;