var mercadopago = require('mercadopago');
const config = require("../config/mp-test-credentials.json");

module.exports = {
    async createPreference(){

        //return console.log(mercadopago.preferences.schema.properties.collector_id)

        mercadopago.configure({
            access_token: config.access_token
        });

        const request = {
                payer:{
                    properties:{
                        name: "Teste",
                        surname: "Etset",
                        email: "teste@gmail.com",
                        identification:{
                            number: "47359807532"
                        },
                        phone: {
                            area_code: "11",
                            number: "98765-4321"
                        },
                        address: {
                            street_name: "Calegari"
                        }
            
                    }
                },
                payment_methods:{
                    default_payment_method_id: "visa"
                },
               shipments:{
                    receiver_address: {
                        zip_code: "0655823",
                        street_name: "Av. Sancheloma",
                        street_number: 998
                    }
               },
               items:[
                   {
                    quantity: 1,
                    unit_price: 51
                   }
                ]
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


