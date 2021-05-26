const { Client } = require('@googlemaps/google-maps-services-js');
const client = new Client({});
const CONFIG = require("../config/maps-test-credentials.json")

async function geoCoding() {

    try {

        const request = {
            address: "Av. Anibal Correa"
        }

        console.log(await client.geocode({
            params: {
                address: "Av. Anibal Correa",
                key: CONFIG.access_key
            }
        }));


    } catch (error) {
        console.log(error)
    }
}

async function geoLocation(){
    try {
        
        console.log(await client.geolocate({
            params:{
                cellTowers: [
                    {
                      cellId: 945724884,
                      mobileCountryCode: 11,
                    }
                  ],
                considerIp: false,
                key: CONFIG.access_key
            }
        }))

        //nota: está retornado 404 

    } catch (error) {
        console.log(error)
    }
}

module.exports = { geoCoding, geoLocation }