//antigo controller de freelancer
//fazer a tratativa usando o atributo booleano
const User = require("../models/User");
const bcrypt = require('bcryptjs')
const {generateToken} = require("../utils");

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

     
        const {firebaseUrl} = req.file ? req.file : " ";
        const {name, email, gender, password, birth_date, cpf, profession, years_experience, history} = req.body;
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
                    agreed_policy: true
                });

                freelancer.createFreelancer({
                    years_experience, 
                    history, 
                    rating: 0.0, 
                })

                if(freelancer.agreed_policy == false){
                    return res.status(401).send({Unauthorized: "Você deve aceitar os termos de condições para acessar o sistema."});
                }

                freelancer.addProfessions(profession);

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

        const freelancerId = req.params.id;
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
            profession
        } = req.body;


        try {

            const user = await User.findByPk(freelancerId);

            
            if(user == null || user == undefined){
                return res.status(404).send({Error: "Usuário não encontrado"})
            }
            
            if(password != undefined){

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
                   
                },
                {
                    where:{
                        id: freelancerId
                    }
                });

            if(profession != undefined || profession != null)
                user.setProfessions(profession)

            res.status(200).send(updateFreelancer)
            
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }

    },

    async delete(req, res){

        const freelancerId = req.params.id

        try {

            const deleteFreelancer = await User.destroy({where:{id: freelancerId}});

            if(!deleteFreelancer){
                res.status(404).send({Error: "Freelancer não encontrado."})
            }
            else{
                res.status(200).send({Success: "Freelancer deletado com sucesso."})
            }

            
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }

    }


}