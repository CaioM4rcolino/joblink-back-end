const Post = require("../models/Post");
const Service = require("../models/Service");
const User = require("../models/User");
const { getPayload, validateModel } = require("../utils");

async function create(req, res){

    const payload = getPayload(req)

    const idUser = Object.values(payload)[0];
    const idPost = req.params.idPost;
    const idFreelancer = req.params.idFreelancer;

    try {
        
        const queryServices = await Service.findAll({where:{
            id_post: idPost,
            id_user: idUser
        }})

        if(queryServices.length != 0){
            return res.status(401).send({Unauthorized: "Este serviço já está registrado."});
        }

        const post = await validateModel(res, idPost, Post, "Postagem");
        const freelancer = await validateModel(res, idFreelancer, User, "Freelancer");

        if(freelancer.is_freelancer == false){
            return res.status(406).send(
                {Not_acceptable: "Você não pode requisitar um serviço à um cliente."}
                )
        }

        if(idUser != post.user_id){
            return res.status(401).send({Unauthorized: "Você não é o dono desta postagem."})
        }
        
        if(post.is_announcement == false){
            const service = await Service.create({
                id_user: post.user_id,
                id_post: post.id,
                id_freelancer: idFreelancer,
                is_from_client: true,
                progress: 1
            })

            const getCreatedService = await Service.findOne({
                where:{
                    id: service.id
                }
            })
            return res.status(201).send(getCreatedService)
        }
        else{
            return res.status(406).send({Error: "Você está anunciando um serviço, portanto não pode contratar um freelancer."})
        }

    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

module.exports = {create}