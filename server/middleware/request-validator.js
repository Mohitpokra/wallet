const UnprocessableEntityError = require("../errors/unprocessable-entity");

const RequestValidator = {};

/**
 * @function validateRequest
 * @description This function is used to validate the request.
 * @param {Joi.Schema} schemaToValidateAgainst
 * @param {String} validationType This defines the component of request to be validated. default - 'body'
 */
RequestValidator.validateRequest = (schemaToValidateAgainst, validationType = 'body') => (req, res, next) => {
    if (!schemaToValidateAgainst) {
        throw new Error('SchemaToValidateAgainst is required');
    }
    const { value, error } = schemaToValidateAgainst.validate(req[validationType]);
    if (error) {
        next(new UnprocessableEntityError(error.message));
    } else {
        req[validationType] = value;
        next();
    }
};

module.exports = RequestValidator;
