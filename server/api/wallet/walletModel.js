const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    },
    version: {
        type: Number,
        default: 0
    }
}, {timestamps: true});

WalletSchema.index({ _id: 1, version: 1 }, { unique: true});

const Wallet = mongoose.model('wallets', WalletSchema);

module.exports = Wallet;
