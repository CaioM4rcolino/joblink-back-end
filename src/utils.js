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

const levenshteinDistance = (str1 = '', str2 = '') => {
    const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i += 1) {
       track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
       track[j][0] = j;
    }
    for (let j = 1; j <= str2.length; j += 1) {
       for (let i = 1; i <= str1.length; i += 1) {
          const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
          track[j][i] = Math.min(
             track[j][i - 1] + 1, // deletion
             track[j - 1][i] + 1, // insertion
             track[j - 1][i - 1] + indicator, // substitution
          );
       }
    }
    return track[str2.length][str1.length];
 };

module.exports = {generateToken, validateModel, getPayload, haversine, levenshteinDistance};
