const { Router } = require('express');
const TransactionController = require('./transactionController');
const RequestValidator = require('../../middleware/request-validator');
const { walletIdValidation, addTransactionValidation, filterTransaction } = require('./transactionValidation');

const router = Router();

router.get('/transactions',
    RequestValidator.validateRequest(filterTransaction, 'query'),
    TransactionController.getWalletTransaction);

router.post('/transactions/:walletId',
    RequestValidator.validateRequest(addTransactionValidation),
    RequestValidator.validateRequest(walletIdValidation, 'params'),
    TransactionController.addTransactionToWallet);

module.exports = router;

