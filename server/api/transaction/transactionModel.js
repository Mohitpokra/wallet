const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    wallet : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'wallets',
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
}, {timestamps: true});


const Transaction = mongoose.model('transactions', TransactionSchema);

module.exports = Transaction;