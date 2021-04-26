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

        const idFreelancer = req.params.idFreelancer;
        const idPost = req.params.idPost;

        return console.log(req.routes);

        try {

            let isFromClient;
            

            const service = await Service.create({
                id_freelancer: idFreelancer,
                id_post: idPost
            })
            
        } catch (error) {
            
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