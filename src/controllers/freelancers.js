//antigo controller de freelancer
//fazer a tratativa usando o atributo booleano
const User = require("../models/User");
const bcrypt = require('bcryptjs')
const {generateToken} = require("../utils");

module.exports = {

    async index(req, res){

        try {

            const freelancers = await User.findAll({where: {is_freelancer: 1},
            include:{
                association: "Freelancer",
                attributes: ["years_experience", "history", "rating"]
                
            }});
    
                if(freelancers == ""){
                    res.status(404).send({Error: "Nenhum freelancer encontrado."})
                }
                else{
                    res.status(200).send(freelancers)
                }

        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },

    async find(req, res){

        try {

            const freelancerId = req.params;


            const findFreelancerById = await User.findOne({where:{isFreelancer: 1, id: freelancerId},
                attributes:["id",
                 "name", 
                 "birth_date", 
                 "email", 
                 "cpf", 
                 "years_experience", 
                 "history", 
                 "image"]
            })
    
            if(findFreelancerById == null){
                return res.status(404).send({Error: "Freelancer não encontrado."})
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

            let verifyEmail = await User.findOne({where: {email: email}});
            let verifyCpf = await User.findOne({where: {cpf: cpf}});

            if(verifyEmail == null || verifyCpf == null){
                let freelancer = await User.create({
                    name, 
                    email, 
                    password: encryptedPassword, 
                    birth_date, 
                    cpf, 
                    years_experience, 
                    history, 
                    rating: 0.0, 
                    is_freelancer: 1,
                    banned: false, 
                    suspended: false
                });

                const token = generateToken({freelancerId: freelancer.id, freelancerName: freelancer.name});
                res.status(201).send({
                    freelancer:{
                        freelancerName: freelancer.name,
                        freelancerId: freelancer.id,
                        freelancerBirthDate: freelancer.birth_date,
                        freelancerEmail: freelancer.email,
                        freelancerCpf: freelancer.cpf,
                        freelancersYearsExperience: freelancer.years_experience,
                        freelancerHistory: freelancer.history,
                        freelancerRating: freelancer.rating
                    },

                    token
                })
                
            }
            else{
                res.status(401).send({Error: "E-mail ou CPF já registrados."})
            }
            
        } catch (error) {
            console.log(error);
            res.status(500).send(error)
        }

    },
    
    async update(req, res){

        const freelancerId = req.params.id;
        const {name, email, password, birth_date, cpf, years_experience, history, rating} = req.body;


        try {

            const user = await User.findByPk(freelancerId);

            if(password != undefined){

                if(!bcrypt.compareSync(password, user.password)){

                    user.password = encryptedPassword;
                    user.save();

                }
                else{
                    return res.status(400).send({Error: "Insira uma senha diferente da antiga."});
                }

            }

            const updatedFreelancer = await user.update({
                    name,
                    email,
                    birth_date,
                    cpf,
                    rating,
                    years_experience,
                    history,
                    suspended,
                    banned,
                   
                },
                {
                    where:{
                        id: freelancerId
                    }
                });

                res.status(200).send(updatedFreelancer)
            
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }

    },

    async delete(req, res){

    }


}