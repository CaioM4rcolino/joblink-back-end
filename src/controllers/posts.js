const Post = require("../models/Post");
const User = require("../models/User");
const auth = require("../config/auth");
const jwt = require("jsonwebtoken");


module.exports = {

    async index(req, res){

        try {
            
            const posts = await Post.findAll({
                include:[
                
                    {
                    association: "User",
                    attributes: ["name"]
                    },
                    {
                    association: "Categories",
                    through: {attributes: [] },
                    attributes: ["name"]
                    }
            ]
            });
            
            if(posts.length != 0 || posts.length != ""){
                res.status(200).send(posts)
            }
            else{
                res.status(404).send({Error: "0 postagens encontradas."})
            }


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

        //  for (let assoc of Object.keys(User.associations)) {
        //     for (let accessor of Object.keys(User.associations[assoc].accessors)) {
        //         console.log(User.name + '.' + User.associations[assoc].accessors[accessor] + '()');
        //     }
        // }

        const {firebaseUrl} = req.file ? req.file : " ";
        const{authorization} = req.headers;
        const [Bearer, token] = authorization.split(" ");
        const payload = jwt.verify(token, auth.secret);

        const {
            title, 
            description, 
            urgency, 
            category, 
            attendance, 
            is_announcement
        } = req.body;

        const arrayCategories = category.split(",");

        let idAuthor;
        let author;


        try {

            if(payload.clientId != undefined || payload.clientId != null){

                idAuthor = payload.clientId;
                author = await User.findByPk(idAuthor);


            }
            else if(payload.freelancerId != undefined || payload.freelancerId != null){
                
                idAuthor = payload.freelancerId;
                author = await User.findByPk(idAuthor);

            }

            if(author == undefined || author == null){
                res.status(404).send({Error: "Usuário não encontrado."})
            }
     
            let post = await Post.create({
                title,
                description,
                urgency,
                image: firebaseUrl,
                attendance,
                is_announcement,
                user_id: idAuthor,
            })

            post.addCategories(arrayCategories)

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

        const{authorization} = req.headers;
        const [Bearer, token] = authorization.split(" ");
        const payload = jwt.verify(token, auth.secret);

        const {
            title, 
            description, 
            urgency, 
            image, 
            is_announcement
        } = req.body;

        const idPost = req.params.id;
        let idAuthor;

        try {

            if(payload.clientId != undefined || payload.clientId != null){

                idAuthor = payload.clientId;

            }
            else if(payload.freelancerId != undefined || payload.freelancerId != null){
                
                idAuthor = payload.freelancerId;

            }

            const post = await Post.findByPk(idPost);

            const verifyAuthor = await Post.findOne({where: {
                id: idPost,
                user_id: idAuthor
            }})

            if(post != null || post != undefined){
                if(verifyAuthor != null || verifyAuthor != undefined){

                    const updatePost = await post.update({
                        title,
                        description,
                        urgency,
                        image,
                        is_announcement
                    },
                    {
                        where:{
                            user_id: idAuthor
                        }
                    })

                    res.status(200).send(updatePost)

        
                }
                else{
                    return res.status(401).send({Error: "Token não autorizado."})
                }
            }
            else{
                return res.status(404).send({Error: "Postagem não encontrada."})
            }
            
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }

    },

    async delete(req, res){

        const{authorization} = req.headers;
        const [Bearer, token] = authorization.split(" ");
        const payload = jwt.verify(token, auth.secret);

        const idPost = req.params.id;
        let idAuthor;


        try {

            if(payload.clientId != undefined || payload.clientId != null){

                idAuthor = payload.clientId;

            }
            else if(payload.freelancerId != undefined || payload.freelancerId != null){
                
                idAuthor = payload.freelancerId;

            }

            const post = await Post.findByPk(idPost);

            const verifyAuthor = await Post.findOne({where: {
                id: idPost,
                user_id: idAuthor
            }})

            if(post != null || post != undefined){
                if(verifyAuthor != null || verifyAuthor != undefined){

                    await Post.destroy({where: 
                        {
                        id: idPost,
                        user_id: idAuthor
                        }
                    });

                    res.status(200).send({Success: "Postagem deletada com sucesso."})


                }
                else{
                   return res.status(401).send({Error: "Token não autorizado"}) 
                }
            }
            else{
                return res.status(404).send({Error: "Postagem não encontrada."})
            }


        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }

    }

}