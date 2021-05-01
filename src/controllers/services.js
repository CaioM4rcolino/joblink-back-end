const Service = require("../models/Service");
const Post = require("../models/Post");
const auth = require("../config/auth");
const jwt = require("jsonwebtoken");


module.exports = {
    
    async index(req, res){
        try {
            
        } catch (error) {
            
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

        const idPost = req.params.idPost;
        let idUser;

        try {

            const post = await Post.findByPk(idPost);

            if(post == null || post == undefined || post == ""){
                return res.status(404).send({Error: "Postagem não encontrada."})
            }

            if(payload.clientId != undefined || payload.clientId != null){
                //significa que o token é de um cliente

                idUser = payload.clientId;

                if(post.is_announcement == true || post.is_announcement == 1){
                    //significa que há um freelancer anunciando serviço

                    const queryServices = await Service.findAll({where:{
                        id_post: idPost,
                        id_user: idUser
                    }})

                    if(queryServices != undefined || queryServices != null){
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
            else if(payload.freelancerId != undefined || payload.freelancerId != null){
                //significa que o token de um freelancer

                idUser = payload.freelancerId;

                if(post.is_announcement == false || post.is_announcement == 0){
                    //significa que há um cliente pedindo serviços

                    const queryServices = await Service.findAll({where:{
                        id_post: idPost,
                        id_user: idUser
                    }})

                    if(queryServices != undefined || queryServices != null){
                        return res.status(401).send({Unauthorized: "Este serviço já está registrado."});
                    }

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
        try {
            
        } catch (error) {
            
        }
    },
    async delete(req, res){
        try {

        } catch (error) {
            
        }
    },

}