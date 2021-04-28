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
            
            const clients = await User.findAll({where:{is_freelancer: 0}});

            if(clients == ""){
                res.status(404).send({Error: "Nenhum cliente encontrado."})
            }
            else{
                res.status(200).send(clients)
            }
            
        } catch (error) {
            console.log(error);
            res.status(500).send(error)
        }

      

    },

    async find(req, res){

        try {

            const clientId = req.params.id;


            const findClientById = await User.findOne({where:{is_freelancer: 0, id: clientId},
                attributes:["id", "name", "birth_date", "email", "cpf", "image", "suspended", "banned"]
            })
    
            if(findClientById == null){
                res.status(404).send({Error:"Cliente não encontrado."})
            }
            else{
                res.status(200).send(findClientById);
            }
            
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }

    },
    
    async store(req, res){

        // for (let assoc of Object.keys(User.associations)) {
        //     for (let accessor of Object.keys(User.associations[assoc].accessors)) {
        //         console.log(User.name + '.' + User.associations[assoc].accessors[accessor] + '()');
        //     }
        // }

        const {firebaseUrl} = req.file ? req.file : " ";
        const {name, email, gender, password, birth_date, cpf} = req.body;
        const encryptedPassword = bcrypt.hashSync(password)


        try {

            let verifyEmail = await User.findOne({where: {email: email}});
            let verifyCpf = await User.findOne({where: {cpf: cpf}});
            
            if(verifyEmail == null && verifyCpf == null){
                let client = await User.create({
                    name, 
                    email, 
                    gender,
                    password: encryptedPassword, 
                    birth_date, 
                    cpf, 
                    image: firebaseUrl,
                    banned: false, 
                    suspended: false,
                    is_freelancer: false,
                    agreed_policy: true
                });

                client.createClient();

                if(client.agreed_policy == false){
                    return res.status(401).send({Unauthorized: "Você deve aceitar os termos de condições para acessar o sistema."});
                }

                const token = generateToken({clientId: client.id,clientName:client.name});
                res.status(201).send({client, token})
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

        const clientId = req.params.id;
        const {name, email, gender, password, birth_date, cpf, suspended, banned} = req.body;


        try {

            const user = await User.findByPk(clientId);

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

            const updatedClient = await user.update({
                    name,
                    email,
                    gender,
                    birth_date,
                    cpf,
                    suspended,
                    banned
                },
                {
                    where:{
                        id: clientId
                    }
                });

                res.status(200).send(updatedClient)
            
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }

    },

    async delete(req, res){

        const clientId = req.params.id;

        try {

            let deleteClient = await User.destroy({where: {id: clientId}})

            if(!deleteClient){
                res.status(404).send({Error: "Cliente não encontrado."})
            }
            else{
                //Devolver a resposta com o status
                res.status(200).send({Sucesso: 'Cliente deletado com sucesso.'});
           }
            
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }

    }


}