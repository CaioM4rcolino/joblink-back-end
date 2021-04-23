const Post = require("../models/Post");
const { Op } = require("sequelize");

module.exports = {
 
    async find(req,res){

        const keyword = req.query.keyword;

        try {

            const searchPost = await Post.findAll({

                where:{
                    [Op.or]: [

                        {
                            title:{
                                [Op.like]: `%${keyword}%`
                            }
                        },

                        {
                            description:{
                                [Op.like]: `%${keyword}%`
                            }
                        }

                    ]

                },

                include: [
                    {
                        association: "User",
                        attributes: ["name"]
                    }
                ],

                order: [["created_at", "DESC"]],
                limit: 5,
            })

            if(searchPost == null || searchPost == "" || searchPost == undefined) 
                return res.status(404).send({Error: "0 Resultados encontrados."})

            res.status(200).send(searchPost);
            
        } catch (error) {
           console.log(error)
           res.status(500).send(error) 
        }
    }

}