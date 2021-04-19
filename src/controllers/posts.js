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

        const {title, description, urgency} = req.body;
        const authorId = req.params.id;

        try {

            const author = await User.findByPk(authorId);

            let post = await Post.create({
                title,
                description,
                urgency,
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

        try {
            
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }

    },

    async delete(req, res){

        try {
            
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }

    }

}