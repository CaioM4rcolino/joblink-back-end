const Profession = require("../models/Profession");

module.exports = {
    async index(req,res){
        try {
            
            const professions = await Profession.findAll();

            if(professions.length != 0){
                return res.status(200).send(professions)
            }
            else{
                return res.status(404).send({Error: "0 profissões encontradas."})
            }

        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}