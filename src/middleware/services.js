const {celebrate, Joi, errors, Segments} = require('celebrate');
const { JsonWebTokenError } = require('jsonwebtoken');


module.exports = {
    create: celebrate({
        [Segments.BODY]: Joi.object().keys({
            payment_methods: Joi.object(),
            shipments: Joi.object()
        })
    }),
}