const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {

    async index(req, res){

        try {
            
            const posts = await Post.findAll({
                include:{
                    association: "User",
                    attributes: ["name"]
                }
            });

            res.status(200).send(posts)

        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }

    },
    
    async find(req, res){

        try {
            
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }

    },

    async store(req, res){

        const {firebaseUrl} = req.file ? req.file : " ";

        const {title, description, urgency} = req.body;
        const authorId = req.params.id;

        try {

            const author = await User.findByPk(authorId);

            let post = await Post.create({
                title,
                description,
                urgency,
                image: firebaseUrl,
                user_id: authorId
            })

            res.status(201).send({
                Status: "Success",
                post:{
                    author: author.name,
                    title: post.title,
                    description: post.description,
                    image: post.image
                }
            })
            
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }

    },
    
    async update(req, res){

        const {title, description, urgency, image} = req.body;

        const idPost = req.params.id;

        try {

            const post = await Post.findByPk(idPost);

            const updatePost = await post.update({
                title,
                description,
                urgency,
                image
            })

            res.status(200).send(updatePost)
            
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }

    },

    async delete(req, res){

        const idPost = req.params.id;


        try {

            const deletePost = await Post.destroy({where: {id: idPost}});

            if(!deletePost){
                res.status(404).send({Error: "Postagem não encontrada."})
            }
            else{
                
                res.status(200).send({Success: "Postagem deletada com sucesso."})

            }


        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }

    }

}