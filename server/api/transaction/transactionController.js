const Transaction = require('./transactionModel');

module.exports.addTransactionToWallet = async function (req, resp, next) {
    let retryCount = 0;
    const { amount, description } = req.body;
    const { walletId } = req.params;
    try {
        while (retryCount < 5) {
            try {
                const transaction = await Transaction.findOne({ walletId: walletId}).sort({ version: -1 });
                const newBalance = transaction.balance + amount;
                const version = ++transaction.version;

                let trans = new Transaction({
                    balance: newBalance,
                    walletId,
                    amount: Math.abs(amount),
                    description,
                    version,
                    type: amount > 0 ? 'credit' : 'debit'
                });

                trans = await trans.save();

                return resp.json({
                    transactionId: trans._id,
                    balance: trans.balance
                });

            } catch (error) {
                // If the error is due to optimistic locking (version mismatch),
                // we will retry the transaction
                if (error.name === 'MongoError' && error.code === 11000) {
                    console.log('Optimistic locking: Retry', retryCount);
                    retryCount++;
                    continue;
                }

                // For other errors, handle appropriately (e.g., log, throw, etc.)
                console.error('Transaction failed:', error.message);
                throw error;
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
        walletId: walletId
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
        let result = await query;

        // Step 2: Get the total count of documents without pagination
        const totalCount = await Transaction.countDocuments(condition);

        if (!result.length) {
            throw new Error('No transactions found');
        }
        
        result = result.map((item) => {
            return {
                id: item._id,
                walletId: item.walletId,
                amount: item.amount,
                balance: item.balance,
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
