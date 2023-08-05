const  { MAX_INT_VALIDATION }  = require('../../../config/backend');

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const walletSetupValidation = Joi.object({
    name: Joi.string().required(),
    balance: Joi.number().positive().precision(4).max(MAX_INT_VALIDATION).required(),
}).required();

const walletIdValidation = Joi.object({
    id: Joi.objectId().required(),
}).required();

module.exports = {
    walletIdValidation,
    walletSetupValidation
}