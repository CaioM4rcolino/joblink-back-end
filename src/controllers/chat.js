const Chat = require("../models/Chat");
const Message = require("../models/Message");
const { getPayload } = require("../utils");
const Service = require("../models/Service");
const Post = require("../models/Post");
const User = require("../models/User");
module.exports = {
    async store(req,res){

        const idService = req.params.id;

        try {
           
            await Chat.create({id_service: idService});

            const service = await Service.findByPk(idService);
            const post = await Post.findByPk(service.id_post);

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
            
            const client = await User.findByPk(idClient);
            const freelancer = await User.findByPk(idFreelancer);

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