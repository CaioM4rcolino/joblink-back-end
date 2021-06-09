const Service = require("../models/Service");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const { getPayload } = require("../utils");
const { Op } = require("sequelize");

module.exports = {

    async index(req, res){

        const idChat = req.params.id;

        try {

            const getMessages = await Message.findAll({
                where:{
                    id_chat: idChat
                },
                include:{
                    association: "User",
                    attributes: ["id", "name"]
                }
            })

            res.status(200).send(getMessages)
            
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    async store(req,res){
        const idChat = req.params.id;
        const idService = req.params.idService;
        const payload = getPayload(req)
        const idUser = Object.values(payload)[0]

        const {description} = req.body;

        try {

            const validationService1 = await Service.findAll({
                where:{
                    id: idService,
                    [Op.or]:[
                        {id_user: idUser},
                        {id_freelancer: idUser}
                    ]
                }
            })

            const validationService2  = await Service.findAll({
                where:{id: idService},
                include:[
                    {
                        association: "Post",
                        attributes: ["id", "description"],
                        where:{
                            user_id: idUser
                        }
                    }
                ]   
            }) 

            if(validationService1.length == 0 && validationService2.length == 0){
                return res.status(401).send({Unauthorized: "Você não pode mandar mensagem aqui."})
            }

            const validationChat = await Chat.findAll({
                where:{
                    id: idChat,
                    id_service: idService
                }
            })

            if(validationChat.length == 0){
                return res.status(404).send({Not_found: "Chat não encontrado."})
            }

            const message = await Message.create({
                id_chat: idChat,
                message_description: description,
                message_author: idUser
            })

            res.status(201).send(message)

        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}