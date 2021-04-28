const Service = require("../models/Service");

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


        try {

          
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