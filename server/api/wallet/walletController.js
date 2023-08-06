const mongoose = require('mongoose');
const Wallet = require('./walletModel');
const Transaction = require('../transaction/transactionModel');

module.exports.setupWallet = async function (req, res, next) {
    let session;
    try {
        const { name, balance } = req.body;
        let wallet, initTrans;

        try {
            session = await mongoose.startSession();
            session.startTransaction();
            wallet = new Wallet({
                name,
            });

            // Save the wallet to the database
            wallet = await wallet.save({ session });

            // Create a new transaction for the initial deposit
            initTrans = new Transaction({
                walletId: wallet._id,
                balance: balance || 0,
                amount: Math.abs(balance),
                type: balance > 0 ? 'credit' : 'debit',
                description: 'Initial Deposit'
            });

            // Save the initial deposit transaction to the database
            initTrans = await initTrans.save({ session });

            // Commit the transaction and end the session
            await session.commitTransaction();
            session.endSession();
        } catch(error) {
            // If an error occurs, abort the transaction and end the session
            await session.abortTransaction();
            session.endSession();
            console.error('Error creating wallet:', error.message);
            throw error;
        }

        return res.json({
            id: wallet._id,
            balance: initTrans.balance,
            transactionId: initTrans._id,
            name: wallet.name,
            date: new Date(wallet.createdAt),
        })

    } catch (err) {
        next(err);
    }
}

module.exports.getWalletDetails = async function (req, resp, next) {
    const { id } = req.params
    try {
       const wallet =  await Wallet.findById(id)
       const transaction = await Transaction.findOne({ walletId: id}).sort({ version: -1 });
       if(!wallet) {
         return resp.status(404).send({ error: 'Document not found'});
       }
       return resp.json({
            id: wallet._id,
            balance: transaction.balance,
            name: wallet.name,
            date: new Date(wallet.createdAt),
       });
    } catch(err) {
        next(err);
    }
}
