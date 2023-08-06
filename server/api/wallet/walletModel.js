const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
}, {timestamps: true});


const Wallet = mongoose.model('wallets', WalletSchema);

module.exports = Wallet;
