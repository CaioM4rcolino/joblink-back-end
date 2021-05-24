var mercadopago = require('mercadopago');
const config = require("../config/mp-test-credentials.json");
const User = require("../models/User");
const Service = require("../models/Service");
const {getPayload} = require("../utils");


module.exports = {
    async store(req, res){

        mercadopago.configure({
            access_token: config.access_token
        });

        const payload = getPayload(req)
        const payloadKeys = Object.keys(payload);

        const idService = req.params.id;
        const idUser = Object.values(payload)[0];

        const{payment_methods, rating} = req.body;

        try {

            const service = await Service.findOne({
                where: {
                    id: idService,
                    id_user: idUser,
                }
            })

            const user = await User.findByPk(idUser);

            if(service.length == 0){
                return res.status(401).send({Error: "Serviço não encontrado."})
            }

            if(user.is_freelancer == true || service.is_from_client == 0){
                return res.status(401).send({Error: "Você não pode efetuar este pagamento."})
            }
            
            const user_name = user.name.split(" ")[0]
            const user_surname = user.name.split(" ")[1]

            let user_phone_number = " ";
            let user_phone_area_code = " ";

            if(user.phone_number != null){
                user_phone_number = user.phone_number.substring(2, 11);
                user_phone_area_code = user.phone_number.substring(0, 2);
            }
         
            
            //resgatar o número da rua em um endereço variável
            // var regex = /\d+/;
            // const user_address = user.address;
            // var string_address = regex.exec(user_address);

            const apiRequest = {
                payer:{
                    name: user_name,
                    surname: user_surname,
                    email: user.email,
                    identification: {
                        number: user.cpf
                    },
                    phone:{
                        area_code: user_phone_area_code,
                        number: Number(user_phone_number) 
                    },
                    address:{
                        street_name: user.address,
                    }
                },
                items:[
                    {
                        quantity: 1,
                        unit_price: Number(service.service_cost)
                    }
                ],
                payment_methods
            }

            await mercadopago.createPreference(apiRequest)

            const preference = await mercadopago.preferences.create(apiRequest)
            const updateServiceRating = await service.update({
                rating
            })

            res.status(200).send({
                updateServiceRating,
                preference
            })
    
        } catch (error) {
            res.status(500).send(error)
            console.log(error)
        }
    }
}