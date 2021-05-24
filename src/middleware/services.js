const {celebrate, Joi, errors, Segments} = require('celebrate');
const { JsonWebTokenError } = require('jsonwebtoken');


module.exports = {
    create: celebrate({
        [Segments.BODY]: Joi.object().keys({
            rating: Joi.string().pattern(/^(\d*\.)?\d+$/).required(),
            feedback: Joi.string().min(10).required(),
            payment_methods: Joi.object(),
            shipments: Joi.object(),
            items: Joi.array().required()
        })
    }),
}