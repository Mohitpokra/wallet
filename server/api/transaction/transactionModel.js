const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    walletId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    balance : {
        type: Number,
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
    },
    version: {
        type: Number,
        default: 0
    }
}, {timestamps: true});

TransactionSchema.index({ walletId: 1, version: 1 }, { unique: true});

const Transaction = mongoose.model('transactions', TransactionSchema);

module.exports = Transaction;