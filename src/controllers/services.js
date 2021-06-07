const Service = require("../models/Service");
const Post = require("../models/Post");
const User = require("../models/User");
const {validateModel, getPayload} = require("../utils");

module.exports = {
    
    async index(req, res){
        try {

            const queryServices = await Service.findAll({
                include:[
                    {
                        association: "User",
                        attributes: ["id", "name"]
                    },
                    {
                        association: "Post",
                        attributes: ["id", "title", "description"],
                        include:{
                            association: "User",
                            attributes: ["id", "name"]
                        }
                    }
                    
                ],
                
            })

            if(queryServices.length != 0)
                res.status(200).send(queryServices)
            else
                res.status(404).send({No_results: "0 serviços encontrados."})
            
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

        const payload = getPayload(req)
        const payloadKeys = Object.keys(payload);

        const idPost = req.params.idPost;
        const idUser = Object.values(payload)[0];

        try {

            const post = await validateModel(res, idPost, Post, "Postagem")

            if(payloadKeys[0] == "clientId"){
                //significa que o token é de um cliente

                if(post.is_announcement == true || post.is_announcement == 1){
                    //significa que há um freelancer anunciando serviço

                    const queryServices = await Service.findAll({where:{
                        id_post: idPost,
                    }})

                    if(queryServices.length != 0){
                        return res.status(401).send({Unauthorized: "Este serviço já está registrado."});
                    }

                    const service = await Service.create({
                        id_user: idUser,
                        id_post: idPost,
                        is_from_client: true,
                        is_accepted: false,
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
                    }})

                    if(queryServices.length != 0){
                        return res.status(401).send({Unauthorized: "Este serviço já está registrado."});
                    }
                
                    const service = await Service.create({
                        id_user: idUser,
                        id_post: idPost,
                        is_from_client: false,
                        is_accepted: false,
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
                        is_accepted: false,
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

        const payload = getPayload(req)

        const {service_cost} = req.body;

        const idPost = req.params.idPost;
        const idService = req.params.id;
        const idUser = Object.values(payload)[0];

        try {

            const updateServiceCost = async (service, service_cost, idService, idPost) => {

                const updateService = await service.update({
                    service_cost: service_cost
                },
                {
                    where:{
                        id: idService,
                        id_post: idPost
                    }
                })

                return res.status(200).send(updateService)
            }

            const service = await Service.findOne({
                where: {
                    id: idService,
                    id_post: idPost
                }
            })
            const post = await validateModel(res, idPost, Post, "Postagem");
            const user = await User.findByPk(idUser)


            if(service == null || service == undefined){
                return res.status(404).send({Error: "Serviço não encontrado."})
            }

            // if(service.service_cost != null || service.service_cost != ""){
            //     return res.status(402).send({Error: "Você já determinou o preço do serviço."})
            // }

            if(user.is_freelancer == false){
                return res.status(401).send({Unauthorized: "Você não pode determinar o preço deste serviço."})
            }
            else if(user.id != service.id_user && user.id != post.user_id){
                return res.status(401).send({Unauthorized: "Você não pode determinar o preço deste serviço."})
            }
            else{
                updateServiceCost(service, service_cost, idService, idPost);
            }
            
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
  
    },
    async delete(req, res){

        const payload = getPayload(req)
    
        const idUser = Object.values(payload)[0];
        const idPost = req.params.idPost;
        const idService = req.params.id;
     

        try {

            const service = await validateModel(res, idService, Service, "Serviço")
            const post = await validateModel(res, idPost, Post, "Postagem")

            if(service.id_user == idUser || post.user_id == idUser){
                if(service.id_post == post.id){
                    await Service.destroy({where:{id: idService}})
                    return res.status(200).send({Success: "Serviço deletado com sucesso."})
                }
                else{
                    return res.status(404).send({Not_found: "Serviço ou postagem inválidos."})
                }

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