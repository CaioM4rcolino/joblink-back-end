var mercadopago = require('mercadopago');
const config = require("../config/mp-test-credentials.json");
const User = require("../models/User");
const Service = require("../models/Service");
const {getPayload} = require("../utils");
const Post = require('../models/Post');
const BalanceRegister = require("../models/BalanceRegister");


module.exports = {
    async store(req, res){

        mercadopago.configure({
            access_token: config.access_token
        });

        const payload = getPayload(req)
        const payloadKeys = Object.keys(payload);

        const idService = req.params.id;
        const idPost = req.params.idPost;
        const idUser = Object.values(payload)[0];

        const{payment_methods} = req.body;

        try {

            const service = await Service.findOne({
                where: {
                    id: idService,
                    id_post: idPost,
                }
            })

            const user = await User.findByPk(idUser);

            const post = await Post.findByPk(idPost, {
                include: {
                    association: "Categories",
                    attributes: ["id", "name"]
                }
            });

            const categories = post.Categories.map(c => c.dataValues.name).join();

            //   for (let assoc of Object.keys(Post.associations)) {
            //     for (let accessor of Object.keys(Post.associations[assoc].accessors)) {
            //         console.log(Post.name + '.' + Post.associations[assoc].accessors[accessor] + '()');
            //     }
            // }

            if(service.length == 0){
                return res.status(401).send({Error: "Serviço não encontrado."})
            }

            if(user.is_freelancer == true){
                return res.status(401).send({Error: "Você não pode efetuar este pagamento."})
            }
            else if(user.id != service.id_user && user.id != post.user_id){
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
                        title: categories,
                        quantity: 1,
                        unit_price: Number(service.service_cost)
                    }
                ],
                payment_methods
            }

            await mercadopago.createPreference(apiRequest)

            const preference = await mercadopago.preferences.create(apiRequest)
            
            const balanceCalc = service.service_cost - (service.service_cost * 0.1);

            let freelancer;
            if(service.is_from_client == 1){
                freelancer = post.user_id
            }
            else{
                freelancer = service.id_user;
            }
            
            const balanceRegister = await BalanceRegister.findOne({
                where:{
                    id_service: idService
                }
            })
           
            if(balanceRegister != null){
                await balanceRegister.update({
                    value: balanceCalc,
                    status_flow: "Cash",
                    id_freelancer: freelancer,
                    where:{
                        id_service: idService
                    }
                })
            }
            else{
                await BalanceRegister.create({
                    value: balanceCalc,
                    status_flow: "Cash",
                    id_freelancer: freelancer,
                    id_service: idService
                })
            }
           

            const updateService = await service.update({
                progress: 2
            })
            res.status(200).send({
                updateService,
                preference
            })
    
        } catch (error) {
            res.status(500).send(error)
            console.log(error)
        }
    }
}