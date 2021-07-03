const { Client } = require('@googlemaps/google-maps-services-js');
const client = new Client({});
const CONFIG = require("../config/maps-test-credentials.js");
const { getPayload, validateModel, haversine, levenshteinDistance} = require('../utils');
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

        const locationUser = geocode.data.results[0].geometry.location


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

            const locationFreelancer = r.data.results[0].geometry.location;
            const formatted_address = r.data.results[0].formatted_address
            const finalAddress = formatted_address.replace(", Brazil", "")

            const proximityCalc = haversine(locationUser, locationFreelancer)
            if(proximityCalc < 3000){
                return finalAddress

            }
            else{
                return "[Too far]"
            }
        })

        // const all_addresses = allUsers.map(u => u.address);

        // return console.log({
        //     todos: all_addresses,
        //     pertos: nearAddress
        // })

        // const cobaia1 = 'R. Potirendaba, 512 - Parque Viana, Barueri - SP, 06449-380';
        // const cobaia2 = 'R. Potirendaba, 512 - Parque Viana, Barueri - SP, 06449-380'

        // const test = levenshteinDistance(cobaia1, cobaia2)
        // return console.log(test)

        //O algoritmo levensthein é necessário pois, no processo de geocodificação, o google maps formata os endereços mapeados no banco, então quando os endereços próximos são encontrados, eles são retornados de forma diferente da do banco de dados; Usar a variável response também não resolve pois ela retorna apenas os endereços, não os dados de usuário.

        var nearFreelancers = [];
        allUsers.forEach(u => {
            nearAddress.map(n => {
                const aux = levenshteinDistance(u.address, n)
                if(aux < 4){
                    nearFreelancers.push(u);
                }
            })
        });

        res.status(200).send(nearFreelancers)
        
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

module.exports = { getFreelancersByLocation }