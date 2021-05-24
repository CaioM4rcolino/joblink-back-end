var mercadopago = require('mercadopago');
const config = require("../config/mp-test-credentials.json");

module.exports = {
    async createPreference(req, res){

        //return console.log(mercadopago.preferences.schema.properties.collector_id)

        mercadopago.configure({
            access_token: config.access_token
        });

        const {payer, shipments, payment_methods, items} = req.body;

        const request = {
                payer,
                shipments,
                payment_methods,
                items
        }

        try {

            const preference = await mercadopago.preferences.create(request)
            res.status(200).send(preference)
            

        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }

    }
}


