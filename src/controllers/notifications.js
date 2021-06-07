const { getPayload } = require("../utils");
const Service = require("../models/Service");
const { Op } = require("sequelize");

module.exports = {
    async index(req, res){

        const payload = getPayload(req)
        const idUser = Object.values(payload)[0];
        const payloadKeys = Object.keys(payload)[0];


        try {

            const getNotification = (idUser) => {
                
                const service = Service.findAll({
                    where:{
                        [Op.or]:[
                            {id_freelancer: idUser},
                            {include:{
                                association: "Post",
                                attributes: ["id", "user_id"],
                                where: {
                                    user_id: idUser
                                }
                            }}
                        ]
                        
                    },
                   
                })

            

            }

            switch(payloadKeys){
                case "freelancerId":
                    getNotification(idUser)
                    break;

                case "clientId":
                    getNotification(idUser)
                    break;

            }
                

        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }

    }
}