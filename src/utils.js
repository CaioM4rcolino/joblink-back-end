const auth = require("./config/auth");
const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
    return jwt.sign(payload, auth.secret, {
        expiresIn: "1h"
    });
};

const validateModel = async (res, id, Model, modelName) => {
    
    const model = await Model.findByPk(id)

    if(model == null || model == undefined){
        return res.status(404).send({Error: `${modelName} não encontrado(a).`})
    }
    else{
        return model;
    }

}

module.exports = {generateToken, validateModel};
