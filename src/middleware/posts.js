const {celebrate, Joi, errors, Segments} = require('celebrate');
const { JsonWebTokenError } = require('jsonwebtoken');


module.exports = {
    create: celebrate({
        [Segments.BODY]: Joi.object().keys({
            title: Joi.string().min(5).max(50).required(),
            description: Joi.string().min(10).max(1000).required(),
            urgency: Joi.number().integer().required(),
            attendance: Joi.string().required(),
            is_announcement: Joi.boolean().required(),
            category: Joi.string().required(),
            image: Joi.string().allow("")
        })
    }),

    update: celebrate({
        [Segments.BODY]: Joi.object().keys({
            title: Joi.string(),
            description: Joi.string(),
            urgency: Joi.number().integer(),
            attendance: Joi.string(),
            is_announcement: Joi.boolean(),
            category: Joi.string(),
            image: Joi.string().allow("")
        })
    })
}