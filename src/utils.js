const auth = require("./config/auth");
const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
    return jwt.sign(payload, auth.secret, {
        expiresIn: "1h"
    });
};

const validateModel = (res, id, Model, modelName) => {

    const model = Model.findByPk(id)

    if(model == null || model == undefined)
        return res.status(404).send({Error: `${modelName} não encontrado(a).`})
    else
        return model;    
    
}

const getPayload = (req) => {

    const auth = require("../src/config/auth");
    const jwt = require("jsonwebtoken");

    const{authorization} = req.headers;
    const [Bearer, token] = authorization.split(" ");
    const payload = jwt.verify(token, auth.secret);

    return payload;

}

module.exports = {generateToken, validateModel, getPayload};
