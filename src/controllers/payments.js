const auth = require("../config/auth");
const jwt = require("jsonwebtoken");
const mercadopago = require("../services/mercadoPagoApi");
const User = require("../models/User");
const Service = require("../models/Service");
const Post = require("../models/Post");

module.exports = {
    async store(req, res){

        const idService = req.params.id;

        //token = pagante
        const{authorization} = req.headers;
        const [Bearer, token] = authorization.split(" ");

        const payload = jwt.verify(token, auth.secret);
        const payloadKeys = Object.keys(payload);
        const idUser = Object.values(payload)[0];

        try {

            const service = await Service.findOne({
                where: {
                    id: idService,
                    id_user: idUser
                }
            })

            if(service.length == 0){
                return res.status(404).send({Error: "Serviço não encontrado."})
            }

            const user = await User.findByPk(idUser);

            // [validateModel here]
            
            const user_name = user.name.split(" ")[0]
            const user_surname = user.name.split(" ")[1]

            const user_phone_number = user.phone_number.substring(2, 11);
            const user_phone_area_code = user.phone_number.substring(0, 2);
            
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
                        number: user_phone_number
                    },
                    address:{
                        street_name: user.address,
                    }
                },
                items:[
                    {
                        quantity: 1,
                        unit_price: service.service_cost
                    }
                ]
            }

            await mercadopago.createPreference(apiRequest)
    
        } catch (error) {
            res.status(500).send(error)
            console.log(error)
        }
    }
}