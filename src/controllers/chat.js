const Chat = require("../models/Chat");
const Message = require("../models/Message");
const { getPayload, validateModel } = require("../utils");
const Service = require("../models/Service");
const Post = require("../models/Post");
const User = require("../models/User");
module.exports = {

    async index(req, res){

        try {

            const chats = await Chat.findAll({
                attributes: ["id", "created_at", "updated_at"],
                include:{
                    association: "Service",
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
                    ]
                }
            });

            if(chats.length == 0){
                return res.status(404).send({No_results: "0 chats encontrados."})
            }

            res.status(200).send(chats)
            
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    async store(req,res){

        const idService = req.params.id;

        try {
           

            const service = await validateModel(res, idService, Service, "Serviço");
            const post = await validateModel(res, service.id_post, Post, "Postagem");

            if(service.progress == 1)
                await Chat.create({id_service: service.id});


            let idClient = "";
            let idFreelancer = "";

            //caso de requisições bilaterais (cliente para freelancer ou freelancer para cliente)
            if(post.user_id !== service.id_user){
                //determinar se o usuário no serviço é cliente ou freelancer
                    if(service.is_from_client == 1){
                        idClient = service.id_user;
                        idFreelancer = post.user_id
                    }
                    else if(service.is_from_client == 0){
                        idClient = post.user_id;
                        idFreelancer = service.id_user;
                    }
            }
            
            const client = await validateModel(res, idClient, User, "Cliente");
            const freelancer = await validateModel(res, idFreelancer, User, "Freelancer");

            res.status(200).send({Success: "Chat criado com sucesso.", Involved:{
                client: client.name,
                freelancer: freelancer.name
            }})

        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },

    async update(req,res){

        const idChat = req.params.id;
        const payload = getPayload(req)
        const idUser = Object.values(payload)[0]

        const {description} = req.body;

        try {

            const chat = await validateModel(res, idChat, Chat, "Chat")
            const service = await validateModel(res, chat.id_service, Service, "Serviço")
           
            await Message.create({
                where:{
                    id_chat: idChat,
                    message_description: description,
                    message_author: idUser
                }
            })

        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }

}