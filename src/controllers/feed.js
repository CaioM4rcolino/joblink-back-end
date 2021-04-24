const Post = require("../models/Post")

module.exports = {
    async index(req, res){
        try {

            const feed = await Post.findAll({
                include:[

                    {
                        association: "User",
                        attributes: ["name"]
                    },

                    {
                        attributes: "Categories",

                    }



                ]
            })
            
        } catch (error) {
            
        }
    }
}