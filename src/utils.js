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

const getPayload = (req) => {

    const auth = require("../src/config/auth");
    const jwt = require("jsonwebtoken");

    const{authorization} = req.headers;
    const [Bearer, token] = authorization.split(" ");
    const payload = jwt.verify(token, auth.secret);

    return payload;

}

const haversine = (locationUser, locationFreelancer) => {

    const lat1 = locationUser.lat;
    const lat2 = locationFreelancer.lat;
    const lon1 = locationUser.lng;
    const lon2 = locationFreelancer.lng;

    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres

    return d;

}

module.exports = {generateToken, validateModel, getPayload, haversine};
