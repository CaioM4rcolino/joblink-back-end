const Service = require("../models/Service");
const Post = require("../models/Post");
const auth = require("../config/auth");
const jwt = require("jsonwebtoken");
const AUTH_MERCADO_PAGO = require("../config/mp-test-credentials.json");
var mercadopago = require('mercadopago');


module.exports = {
    
    async index(req, res){
        try {

            const queryServices = await Service.findAll({
                include:[
                    {
                        association: "User",
                        attributes: ["name"]
                    },
                    {
                        association: "Post",
                        attributes: ["id", "title", "description"],
                        include:{
                            association: "User",
                            attributes: ["name"]
                        }
                    }
                    
                ],
                
            })

            res.status(200).send(queryServices)
            
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    async find(req, res){
        try {
            
        } catch (error) {
            
        }
    },
    async store(req, res){

        const{authorization} = req.headers;
        const [Bearer, token] = authorization.split(" ");
        const payload = jwt.verify(token, auth.secret);

        const payloadKeys = Object.keys(payload);

        const idPost = req.params.idPost;
        const idUser = Object.values(payload)[0];

        try {

            const post = await Post.findByPk(idPost);

            if(post == null || post == undefined || post == ""){
                return res.status(404).send({Error: "Postagem não encontrada."})
            }

            if(payloadKeys[0] == "clientId"){
                //significa que o token é de um cliente

                if(post.is_announcement == true || post.is_announcement == 1){
                    //significa que há um freelancer anunciando serviço

                    const queryServices = await Service.findAll({where:{
                        id_post: idPost,
                        id_user: idUser
                    }})

                    if(queryServices.length != 0){
                        return res.status(401).send({Unauthorized: "Este serviço já está registrado."});
                    }

                    const service = await Service.create({
                        id_user: idUser,
                        id_post: idPost,
                        is_from_client: true,
                        progress: 1,
                    })

                    return res.status(201).send(service);
    
                }
                else{
                    return res.status(401).send({Unauthorized: "Você não pode prestar serviços."});
                }

            }
            else if(payloadKeys[0] == "freelancerId"){
                //significa que o token de um freelancer

                if(post.is_announcement == false || post.is_announcement == 0){
                    //significa que há um cliente pedindo serviços

                    const queryServices = await Service.findAll({where:{
                        id_post: idPost,
                        id_user: idUser
                    }})
                
                    const service = await Service.create({
                        id_user: idUser,
                        id_post: idPost,
                        is_from_client: false,
                        progress: 1,
                    })

                    return res.status(201).send(service);
    
                }
                else{

                    //freelancer atuando como cliente

                    const service = await Service.create({
                        id_user: idUser,
                        id_post: idPost,
                        is_from_client: true,
                        progress: 1,
                    })

                    return res.status(201).send(service);

                }

            }
  
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    async update(req, res){

        const {
            payer, 
            shipments, 
            payment_method_id, 
            transaction_amount, 
            rating
        } = req.body;

        const idPost = req.params.idPost;
        const idService = req.params.id;

        mercadopago.configurations.setAccessToken(AUTH_MERCADO_PAGO.access_token);


        try {

            // const service = await Service.findByPk(idService);
            // if(service == null || service == undefined){
            //     return res.status(404).send({Error: "Serviço não encontrado."})
            // }

            // const post = await Post.findByPk(idPost)
            // if(post == null || post == undefined){
            //     return res.status(404).send({Error: "Postagem não encontrado."})
            // }


            const payment = await mercadopago.post("/v1/payments", {
                payer, 
                shipments, 
                payment_method_id, 
                transaction_amount, 
            })

            // payment_methods = await mercadopago.get("/v1/payment_methods");

            return res.status(200).send(payment);

            // if(service.id_user == idUser || post.user_id == idUser){

            //     const updateService = await service.update({
            //         service_cost: transaction_amount,
            //         rating
            //     })

            //     return res.status(200).send(service);
            // }
            // else{
            //     return res.status(401).send()
            // }

            
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    async delete(req, res){

        const{authorization} = req.headers;
        const [Bearer, token] = authorization.split(" ");
        const payload = jwt.verify(token, auth.secret);

        const idUser = Object.values(payload)[0];
        const idPost = req.params.idPost;
        const idService = req.params.id;
     

        try {

            const service = await Service.findByPk(idService);
            if(service == null || service == undefined){
                return res.status(404).send({Error: "Serviço não encontrado."})
            }

            const post = await Post.findByPk(idPost)
            if(post == null || post == undefined){
                return res.status(404).send({Error: "Postagem não encontrado."})
            }

            if(service.id_user == idUser || post.user_id == idUser){

                await Service.destroy({where:{id: idService}})
                return res.status(200).send({Success: "Serviço deletado com sucesso."})
            }
            else{
                return res.status(401).send({Unauthorized: "Você não pode deletar este serviço."})
            }

        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },

}