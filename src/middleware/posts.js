const {celebrate, Joi, errors, Segments} = require('celebrate');


module.exports = {
    create: celebrate({
        [Segments.BODY]: Joi.object().keys({
            title: Joi.string().min(5).max(40).required(),
            description: Joi.string().min(10).max(1000).required(),
            urgency: Joi.string().length(1).required()
        })
    }),

    update: celebrate({
        [Segments.BODY]: Joi.object().keys({
            title: Joi.string(),
            description: Joi.string(),
            urgency: Joi.string().length(1)
        })
    })
}