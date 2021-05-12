var mercadopago = require('mercadopago');
const config = require("../../config/mp-test-credentials.json");

module.exports = {

    async createCostumer(req, res){

        // Adicione as credenciais
        // mercadopago.configure({
        //     access_token: config.access_token
        // });

        // const {
        //     first_name, 
        //     last_name, 
        //     email, 
        //     phone, 
        //     address, 
        //     identification, 
        //     data_registered, 
        //     default_card
        // } = req.body;

        // try {

        //     const newCostumer = await mercadopago.post("/v1/customers", {
        //         first_name,
        //         last_name,
        //         email,
        //         phone,
        //         address: Number(address),
        //         identification,
        //         data_registered,
        //         default_card
        //     })
    
        //     return res.status(200).send(newCostumer);

        // } catch (error) {
        //     console.log(error)
        //     res.status(500).send(error)
        // }

    },
    
    async updateCustomer(){
    
    },
    
    async registerCard(){
    
    }
    
}


