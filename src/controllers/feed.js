const Post = require("../models/Post")

module.exports = {
    async index(req, res){
        try {

            const feed = await Post.findAll({
                include:[

                    {
                        association: "User",
                        attributes: ["id", "name"]
                    },

                    {
                        association: "Categories",
                        through: {attributes: []},
                        attributes: ["name"]

                    }

                ]
            })

            res.status(200).send(feed);
            
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}