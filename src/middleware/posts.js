const {celebrate, Joi, errors, Segments} = require('celebrate');
const { JsonWebTokenError } = require('jsonwebtoken');


module.exports = {
    create: celebrate({
        [Segments.BODY]: Joi.object().keys({
            title: Joi.string().min(5).max(40).required(),
            description: Joi.string().min(10).max(1000).required(),
            urgency: Joi.string().length(1).required(),
            attendance: Joi.string().min(6).max(11).required(),
            is_announcement: Joi.boolean().required(),
            category: Joi.string().required()
        })
    }),

    update: celebrate({
        [Segments.BODY]: Joi.object().keys({
            title: Joi.string(),
            description: Joi.string(),
            urgency: Joi.string().length(1),
            attendance: Joi.string().min(6).max(11),
            is_announcement: Joi.boolean(),
            category: Joi.string()
        })
    })
}