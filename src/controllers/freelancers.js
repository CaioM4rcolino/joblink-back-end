//antigo controller de freelancer
//fazer a tratativa usando o atributo booleano
const User = require("../models/User");
const Profession = require("../models/Profession");
const bcrypt = require('bcryptjs')
const {generateToken, validateModel, getPayload} = require("../utils");
const auth = require("../config/auth");
const jwt = require("jsonwebtoken");


module.exports = {

    async index(req, res){

        for (let assoc of Object.keys(User.associations)) {
            for (let accessor of Object.keys(User.associations[assoc].accessors)) {
                console.log(User.name + '.' + User.associations[assoc].accessors[accessor] + '()');
            }
        }


        try {

            const freelancers = await User.findAll({where: {is_freelancer: 1},

            include:[
                {
                association: "Freelancer",
                attributes: ["years_experience", "history", "rating"],
                },
                {
                association: "Professions",
                through: {attributes: [] },
                attributes: ["name"]
                }
            ],
           

        });
    
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


            const findFreelancerById = await User.findOne({where:{is_freelancer: 1, id: freelancerId},
                attributes:["id",
                 "name", 
                 "birth_date", 
                 "email", 
                 "cpf", 
                 "image"],
                include:[
                    {
                        association: "Freelancer",
                        attributes: ["years_experience", "history"]
                    }
                ]
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

        const {firebaseUrl} = req.file ? req.file : " ";
        const {
            name, 
            email, 
            gender, 
            password, 
            birth_date, 
            cpf, 
            profession, 
            years_experience, 
            history,
            address,
            phone_number
        } = req.body;

        const arrayProfession = profession.split(",");
        const encryptedPassword = bcrypt.hashSync(password)

        try {

            let verifyEmail = await User.findOne({where: {email: email}});
            let verifyCpf = await User.findOne({where: {cpf: cpf}});

            if(verifyEmail == null || verifyCpf == null){

                let freelancer = await User.create({
                    name, 
                    email, 
                    gender,
                    image: firebaseUrl,
                    password: encryptedPassword, 
                    birth_date, 
                    cpf, 
                    is_freelancer: 1,
                    banned: false, 
                    suspended: false,
                    agreed_policy: true,
                    address,
                    phone_number
                });

                freelancer.createFreelancer({
                    years_experience, 
                    history, 
                    rating: 0.0, 
                })

                if(freelancer.agreed_policy == false){
                    return res.status(401).send({Unauthorized: "Você deve aceitar os termos de condições para acessar o sistema."});
                }

                freelancer.addProfessions(arrayProfession);

                const token = generateToken({freelancerId: freelancer.id, freelancerName: freelancer.name});
                res.status(201).send({freelancer, token});
                
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

        const payload = getPayload(req)
        let idFreelancer;

        const {
            name, 
            email, 
            gender,
            password, 
            birth_date, 
            cpf, 
            years_experience, 
            history, 
            rating, 
            suspended, 
            banned, 
            profession,
            address,
            phone_number
        } = req.body;

        try {

            if(payload.freelancerId != undefined || payload.freelancerId != null){

                idFreelancer = payload.freelancerId;
                
                const user = await validateModel(res, idFreelancer, User, "Usuário")
            
                if(password != undefined){

                    const encryptedPassword = bcrypt.hashSync(password);

                    if(!bcrypt.compareSync(password, user.password)){

                        user.password = encryptedPassword;
                        user.save();

                    }
                    else{
                        return res.status(400).send({Error: "Insira uma senha diferente da antiga."});
                    }

                }
                const updateFreelancer = await user.update({
                        name,
                        email,
                        gender,
                        birth_date,
                        cpf,
                        rating,
                        years_experience,
                        history,
                        suspended,
                        banned,
                        address,
                        phone_number
                    
                    },
                    {
                        where:{
                            id: idFreelancer
                        }
                    });

                if(profession != undefined || profession != null){

                    const verifyProfession = await Profession.findOne({
                        where:{id: profession}
                    })

                    if(verifyProfession != undefined || verifyProfession != null){

                        user.setProfessions(profession)
                        return res.status(200).send(updateFreelancer)

                    }
                    else{
                        return res.status(400).send({Error: "Profissão inválida."})
                    }
                }

                res.status(200).send(updateFreelancer)

            }
            else{
                res.status(401).send({Error: "Token não autorizado."})
            }

            
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }

    },

    async delete(req, res){

        const payload = getPayload(req);
        let idFreelancer;

        try {

            if(payload.freelancerId != undefined || payload.freelancerId != null){

                idFreelancer = payload.freelancerId;

                const deleteFreelancer = await User.destroy({where:{id: idFreelancer}});

                if(!deleteFreelancer){
                    res.status(404).send({Error: "Freelancer não encontrado."})
                }
                else{
                    res.status(200).send({Success: "Freelancer deletado com sucesso."})
                }
            }
            else{
                return res.status(401).send({Error: "Token inválido."})
            }

        
            
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }

    }


}