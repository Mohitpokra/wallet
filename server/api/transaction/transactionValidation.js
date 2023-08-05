const { MAX_INT_VALIDATION } = require('../../../config/backend');

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const addTransactionValidation = Joi.object({
    amount: Joi.number().invalid(0).precision(4).max(MAX_INT_VALIDATION).required(),
    description: Joi.string().required(),
}).required();

const walletIdValidation = Joi.object({
    walletId: Joi.objectId().required(),
}).required();

const filterTransaction = Joi.object({
    walletId: Joi.objectId().required(),
    skip: Joi.number().max(MAX_INT_VALIDATION),
    limit: Joi.number().max(MAX_INT_VALIDATION),
    sortBy: Joi.string().valid('amount', 'updatedAt').allow('').required(),
    isDesc: Joi.boolean().required()
}).required();


module.exports = {
    filterTransaction,
    addTransactionValidation,
    walletIdValidation
}