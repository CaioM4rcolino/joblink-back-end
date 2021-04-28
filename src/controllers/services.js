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

        const idPost = req.params.idPost;
        const{authorization} = req.headers;


        try {

            const post = await Post.findByPk(idPost);

            const [Bearer, token] = authorization.split(" ");

            const payload = jwt.verify(token, auth.secret);

            return console.log(payload);

            if(post.is_announcement == false){

                /*significa que há duas possibilidades:

                    1. um trabalhador achou a postagem de um cliente e entrou em contato
                        -nesse caso o id do payload é de um trabalhador
                    2. um cliente fez uma postagem e encontrou um trabalhador, e entrou em contato com ele
                        -nesse caso o id do payload é de um cliente

                */
            }
            else{

            }
          
            const service = await Service.create({
                id_freelancer: idFreelancer,
                id_post: idPost,
                is_from_client: isFromClient,
                progress: 1,
            })

            res.status(201).send(service);
            
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