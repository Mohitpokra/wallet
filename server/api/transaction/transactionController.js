const mongoose = require('mongoose');
const Transaction = require('./transactionModel');
const Wallet = require('../wallet/walletModel');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports.addTransactionToWallet = async function (req, resp, next) {
    let retryCount = 0;
    const { amount, description } = req.body;
    const { walletId } = req.params;
    try {
        while (retryCount < 5) {
            let session;
            try {
                session = await mongoose.startSession();
                session.startTransaction();

                let trans = new Transaction({
                    wallet: walletId,
                    amount: Math.abs(amount),
                    description,
                    type: amount > 0 ? 'credit' : 'debit'
                });

                trans = await trans.save({ session });
                let wallet = await Wallet.findById(walletId).session(session);
                if (!wallet) {
                    throw new Error('Wallet Not found');
                }

                wallet.balance += amount;
                wallet.type = amount > 0 ? 'credit' : 'debit'
                wallet.version++;
                wallet = await wallet.save({ session });

                // Commit the transaction and end the session
                await session.commitTransaction();
                session.endSession();

                return resp.json({
                    transactionId: trans._id,
                    balance: wallet.balance
                });

            } catch (error) {
                await session.abortTransaction();
                session.endSession();

                // If the error is due to optimistic locking (version mismatch),
                // we will retry the transaction
                if (error.name === 'MongoError' && error.code === 11000) {
                    retryCount++;
                    console.log('Optimistic locking: Retry', retryCount);
                    continue;
                }

                // For other errors, handle appropriately (e.g., log, throw, etc.)
                console.error('Transaction failed:', error.message);
            }
        }

        throw new Error('Retry exceed');

    } catch (err) {
        next(err)
    }
}

module.exports.getWalletTransaction = async function (req, resp, next) {
    let { walletId, skip, limit, sortBy, isDesc } = req.query;

    const sortOrder = isDesc ? 'desc' : 'asc';

    const condition = {
        wallet: walletId
    }

    let query = Transaction.find(condition);
    if (sortBy) {
        query = query.sort({ [sortBy]: sortOrder });
    }
    if(skip) {
        query = query.skip(Number(skip));
    }
    if(limit) {
       query = query.limit(Number(limit))
    }
    try {
        let result = await query
            .populate('wallet');

        // Step 2: Get the total count of documents without pagination
        const totalCount = await Transaction.countDocuments(condition);

        if (!result.length) {
            throw new Error('No transactions found');
        }
        
        result = result.map((item) => {
            return {
                id: item._id,
                walletId: item.wallet._id,
                amount: item.amount,
                balance: item.wallet.balance,
                description: item.description,
                updatedAt: new Date(item.updatedAt),
                type: item.type,
            }
        });
        return resp.json({
            transactions: result,
            totalCount,
        });

    } catch (err) {
        next(err);
    }

}
