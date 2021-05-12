const Service = require('../../models/Service');
var mercadopago = require('mercadopago');
const config = require("../../config/mp-test-credentials.json");
const auth = require("../../config/auth.json");
const jwt = require("jsonwebtoken");

module.exports = {

    async createPreference(req, res){

        //return console.log(mercadopago.preferences.schema.properties.collector_id)

        // se is_from_client = true então

        //     client_id: idUser,
        //     collector_id: idPost

        //     se is_from_client = false então

        //     client_id: idPost,
        //     collector_id: idUser

        mercadopago.configure({
            access_token: config.access_token
        });

        const {
            payer,
            payment_methods,
            shipments, 
            items,
            client_id
        } = req.body;

        try {

            let preference_data = {
                    payer,
                    payment_methods,
                    shipments,
                    client_id,
                    items
                }

            const preference = await mercadopago.preferences.create(preference_data)
           
            res.status(200).send(preference)
            

        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }

    },
    
    async updateCustomer(){
    
    },
    
    async registerCard(){
    
    }
    
}


