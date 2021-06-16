const Service = require("../models/Service");

module.exports = {
    async update(req, res){

        const idService = req.params.id;
        const idPost = req.params.idPost;

        const {rating, feedback} = req.body;

        try {
            
            const service = await Service.findOne({
                where: {
                    id: idService,
                    id_post: idPost,
                }
            })

            const updateService = await service.update({
                rating,
                feedback,
            })

            res.status(200).send(updateService)

        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}