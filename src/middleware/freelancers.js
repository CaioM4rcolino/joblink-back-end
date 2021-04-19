const {celebrate, Joi, errors, Segments} = require('celebrate');

module.exports = {

    create: celebrate({
        [Segments.BODY]: Joi.object().keys({
            name: Joi.string().min(3).max(255).required(),
            email: Joi.string().min(8).max(255).required(),
            birth_date: Joi.string().pattern(/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.]/).required(),
            password: Joi.string().min(6).max(255).required(),
            cpf: Joi.string().length(12).required(),
            profession: Joi.string().required(),
            years_experience: Joi.string().min(6),
            history: Joi.string().max(255)

        })
    }),

    update: celebrate({
        [Segments.BODY]: Joi.object().keys({
            name: Joi.string().min(4).max(255),
            email: Joi.string().min(8).max(255),
            password: Joi.string().min(6).max(255),
            cpf: Joi.string().length(12),
            birth_date: Joi.string().pattern(/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.]/),
            profession: Joi.string().length(50).required(),
            years_experience: Joi.string().min(6),
            history: Joi.string().max(255),
            suspended: Joi.boolean(),
            banned: Joi.boolean()
        })
    })
    
}