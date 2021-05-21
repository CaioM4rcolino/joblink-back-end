const {celebrate, Joi, errors, Segments} = require('celebrate');
const { JsonWebTokenError } = require('jsonwebtoken');


module.exports = {
    create: celebrate({
        [Segments.BODY]: Joi.object().keys({
            title: Joi.string().min(5).max(50).required(),
            description: Joi.string().min(10).max(1000).required(),
            urgency: Joi.number().integer().required(),
            attendance: Joi.number().integer().required(),
            is_announcement: Joi.boolean().required(),
            category: Joi.string().required()
        })
    }),

    update: celebrate({
        [Segments.BODY]: Joi.object().keys({
            title: Joi.string(),
            description: Joi.string(),
            urgency: Joi.number().integer(),
            attendance: Joi.boolean(),
            is_announcement: Joi.boolean(),
            category: Joi.string()
        })
    })
}