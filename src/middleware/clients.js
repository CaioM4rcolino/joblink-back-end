const {celebrate, Joi, errors, Segments} = require('celebrate')

module.exports = {

    create: celebrate({
        [Segments.BODY]: Joi.object().keys({
            name: Joi.string().min(4).max(255).required(),
            email: Joi.string().min(8).max(255).required(),
            password: Joi.string().min(6).max(255).required(),
            cpf: Joi.string().length(12).required(),
            birth_date: Joi.string().pattern(/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.]/).required()
            
            
        })
    })
}