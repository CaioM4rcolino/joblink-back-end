const Client = require("../models/Client");
const bcrypt = require('bcryptjs')
const {generateToken} = require("../utils");

module.exports = {

    async index(req, res){

        try {

            const clients = await Client.findAll({
                attributes: ["id", "name", "birth_date", "cpf", "email"]
            });
     
            if(clients == null){
                res.status(404).send("Nenhum cliente encontrado.")
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

            const clientId = req.params;


            const findClientById = await Client.findByPk(clientId, {
                attributes: ["id", "name", "birth_date", "cpf", "email"]
            })
    
            if(findClientById == null){
                res.status(404).send("Cliente não encontrado.")
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


        const {name, email, password, birth_date, cpf} = req.body;
        const encryptedPassword = bcrypt.hashSync(password)

        try {

                let client = await Client.create({name, email, password: encryptedPassword, birth_date, cpf, banned: false, suspended: false});

                const token = generateToken({clientId: client.id, clientName: client.name});
                res.status(201).send({
                    client:{
                        clientId: client.id,
                        clientName: client.name,
                        clientBirthDate: client.birth_date,
                        clientEmail: client.email,
                        clientCpf: client.cpf
                    },

                    token
                })
                
            
          
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