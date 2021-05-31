const { Client } = require('@googlemaps/google-maps-services-js');
const client = new Client({});
const CONFIG = require("../config/maps-test-credentials.json");
const { getPayload, validateModel } = require('../utils');
const User = require('../models/User');

async function getFreelancersByLocation(req, res) {

    const payload = getPayload(req);
    const idUser = Object.values(payload)[0];

    try {

        const user = await validateModel(res, idUser, User, "Usuário");

        const geocode = await client.geocode({
            params: {
                address: user.address,
                key: CONFIG.access_key
            }
        })
        //return res.status(200).send(geocode.data)

        const allUsers = await User.findAll({
            attributes: ["id", "name", "address"],
            where: {
                is_freelancer: true
            }
        })

        const promises = allUsers.map(async (u) => {
            return await client.geocode({
                params: {
                    address: u.address,
                    key: CONFIG.access_key
                }
            })
        })

        const response = await Promise.all(promises);

        const nearAddress = response.map(r => {

            const location = Object.values(r.data.results[0].geometry.bounds);
            const meters = haversine(location);

            if (meters < 100) {
                return r.config.params.address;
            }
           
        
        })

        const findNearUser = allUsers.filter(u => nearAddress.find(nA => nA === u.address));

        console.log(findNearUser)

        // return console.log(resposta[0].data.results);
        // const location = Object.values(geocode.data.results[0].geometry.bounds);

        function haversine(location) {
            const lat1 = location[0].lat;
            const lat2 = location[1].lat;
            const lon1 = location[0].lng;
            const lon2 = location[1].lng;

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


            const locationObject = geocode.data.results[0].geometry.location;
            const coordinates = `${location[0]},${location[1]}`;
            return console.log([location, locationObject, coordinates])

            // const placesNearby = await client.placesNearby({
            //     params: {
            //         location: locationObject,
            //         radius: 1500,
            //         type: "",
            //         key: CONFIG.access_key
            //     }
            // })
        }



    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

module.exports = { getFreelancersByLocation }