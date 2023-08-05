const { Router } = require('express');
const WalletController = require('./walletController');
const RequestValidator = require('../../middleware/request-validator');
const { walletIdValidation, walletSetupValidation } = require('./walletValidation');

const router = Router();

router.post('/wallet/setup',
    RequestValidator.validateRequest(walletSetupValidation),
    WalletController.setupWallet);

router.get('/wallet/:id',
    RequestValidator.validateRequest(walletIdValidation, 'params'),
    WalletController.getWalletDetails);

router.get('/health', function(req, resp, next) {
    return resp.json({
        msg: 'working fine'
    })
});

module.exports = router;

