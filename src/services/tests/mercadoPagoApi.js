var mercadopago = require('mercadopago');
const config = require("../../config/mp-test-credentials.json");
mercadopago.configurations.setAccessToken(config.access_token);

module.exports = {

    async createCostumer(req, res){

        const {first_name, last_name, email, phone} = req.body;

        payment_methods = mercadopago.get("/v1/payment_methods");
        
        return console.log(mercadopago)

        const newCostumer = await mercadopago.post("/v1/customers", {
            first_name,
            last_name,
            email,
            phone
        })



        return res.status(200).send(newCostumer);

    },
    
    async updateCustomer(){
    
    },
    
    async registerCard(){
    
    }
    
}


