const { Client } = require('@googlemaps/google-maps-services-js');
const client = new Client({});
const CONFIG = require("../config/maps-test-credentials.js");
const { getPayload, validateModel, haversine} = require('../utils');
const User = require('../models/User');

async function getFreelancersByLocation(req, res) {

    const payload = getPayload(req);
    const idUser = Object.values(payload)[0];

    const idProfession = req.params.id;

    try {

        const user = await validateModel(res, idUser, User, "Usuário");

        //geocodificação do endereço de quem fez a requisição
        const geocode = await client.geocode({
            params: {
                address: user.address,
                key: CONFIG.access_key
            }
        })

        //varredura dos endereços de todos os freelancers do banco
        let allUsers;
        if(req.route.path == "/getNearFreelancers/profession/:id"){
            allUsers = await User.findAll({
                attributes: ["id", "name", "address"],
                include: {
                    association: "Professions",
                    through: {attributes: [] },
                    attributes: ["id", "name"],
                    where:{
                        id: idProfession
                    }     
                },
                where: {
                    is_freelancer: true
                }
            })
        }
        else{
            allUsers = await User.findAll({
                attributes: ["id", "name", "address"],
                include: {
                    association: "Professions",
                    through: {attributes: [] },
                    attributes: ["id", "name"]    
                },
                where: {
                    is_freelancer: true
                }
            })
        }
     

        //geocodificação do endereço de todos os freelancers do banco
        const promises = allUsers.map(async (u) => {
            return await client.geocode({
                params: {
                    address: u.address,
                    key: CONFIG.access_key
                }
            })
        })

        //conclusão das promessas
        const response = await Promise.all(promises);

        //varrer o array com todos os registros geocodificados, pegar as coordenadas de cada um e colocar na fórmula de haversine
        const nearAddress = response.map(r => {
            const locationUser = geocode.data.results[0].geometry.location
            const locationFreelancer = r.data.results[0].geometry.location;
            const proximityCalc = haversine(locationUser, locationFreelancer)

            const formatted_address = r.data.results[0].formatted_address
        
            const finalAddress = formatted_address.replace(", Brazil", "")

            if(proximityCalc < 5000){
                return finalAddress
            }
        })

            const findNearUser = allUsers.filter(u => nearAddress.find(nA => nA === u.address));
            res.status(200).send(findNearUser)
    

        // const placesNearby = await client.placesNearby({
        //     params: {
        //         location: locationObject,
        //         radius: 1500,
        //         type: "",
        //         key: CONFIG.access_key
        //     }
        // })


    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

module.exports = { getFreelancersByLocation }