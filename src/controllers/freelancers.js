const Freelancer = require("../models/Freelancer");
const bcrypt = require('bcryptjs')
const {generateToken} = require("../utils");

module.exports = {

    async index(req, res){

       const freelancers = await Freelancer.findAll({
           attributes: ["id", "name", "birth_date", "cpf", "email"]
       });

       if(freelancers == null){
           res.status(404).send("Nenhum freelancer encontrado.")
       }
       else{
           res.status(200).send(freelancers)
       }

    },

    async find(req, res){

        try {

            const freelancerId = req.params;


            const findFreelancerById = await Freelancer.findByPk(freelancerId, {
                attributes: ["id", "name", "birth_date", "cpf", "email"]
            })
    
            if(findFreelancerById == null){
                return res.status(404).send("Freelancer não encontrado.")
            }
            else{
                return res.status(200).send(findFreelancerById);
            }
            
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }

      

    },
    
    async store(req, res){

        const {name, email, password, birth_date, cpf, years_experience, history} = req.body;
        const encryptedPassword = bcrypt.hashSync(password)

        try {

            let verifyEmail = await Freelancer.findOne({where: {email: email}});
            let verifyCpf = await Freelancer.findOne({where: {cpf: cpf}});

            if(verifyEmail == null || verifyCpf == null){
                let freelancer = await Freelancer.create({name, email, password: encryptedPassword, birth_date, cpf, years_experience, history, rating: 0.0, banned: false, suspended: false});

                const token = generateToken({freelancerId: freelancer.id, freelancerName: freelancer.name});
                res.status(201).send({
                    freelancer:{
                        freelancerName: freelancer.name,
                        freelancerId: freelancer.id,
                        freelancerBirthDate: freelancer.birth_date,
                        freelancerEmail: freelancer.email,
                        freelancerCpf: freelancer.cpf,
                        freelancersYearsExperience: freelancer.years_experience,
                        freeLancerHistory: freelancer.history,
                        freelancerRating: freelancer.rating
                    },

                    token
                })
                
            }
            else{
                res.status(401).send("E-mail ou CPF já existentes.")
            }
            
        } catch (error) {
            console.log(error);
            res.status(500).send(error)
        }

    },
    
    async update(req, res){

    },

    async delete(req, res){

    }


}