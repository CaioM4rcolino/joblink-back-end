const axios = require("axios");
const AUTH = require("../config/mp_credentials")

const BASE_URL = "https://api.mercadopago.com/v1";

const instance = axios.create({
    baseUrl: BASE_URL,
    headers: {'Authorization': AUTH.access_token}
});

instance.defaults.headers.post['Content-Type'] = 'application/json';

module.exports = {
    async post(req, res){
        try {
            await instance.post("/payments", {
                payer: {
                    first_name: "Test",
                    last_name: "Test",
                    type: "customer",
                    identification: {},
                    phone: {},
                    address: {}
                  },
            });
            
            console.log(res);
        } catch (error) {
            console.log(error)
        }
    }
}

