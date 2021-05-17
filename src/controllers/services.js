const Service = require("../models/Service");
const Post = require("../models/Post");
const auth = require("../config/auth");
const jwt = require("jsonwebtoken");
const mercadopago = require("../services/tests/mercadoPagoApi");
const User = require("../models/User");

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
                    id_user: idUser
                }
            })

            if(service.length == 0){
                return res.status(404).send({Error: "Serviço não encontrado."})
            }

            const user = await User.findByPk(idUser);

            const user_name = user.name.split(" ")[0]
            const user_surname = user.name.split(" ")[1]

            const user_phone_area_code = user.phone_number.substring(0, 2);

            return console.log(user_phone_area_code)

            const apiRequest = {
                payer:{
                    name: user_name,
                    surname: user_surname,
                    email: user.email,
                    identification: {
                        number: user.cpf
                    },
                    phone:{
                        area_code
                    }
                }
            }

            return console.log(user);

          


            
        } catch (error) {
            
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