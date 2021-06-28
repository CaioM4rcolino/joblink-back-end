const { Client } = require('@googlemaps/google-maps-services-js');
const client = new Client({});
const CONFIG = require("../config/maps-test-credentials.js")

async function geoCoding(req, res) {

    const {address} = req.body;

    try {

        const geocoding = await client.geocode(
            {
                params:{
                    address: address,
                    key: CONFIG.access_key
                }, 
                
            }
        );


         res.status(200).send(geocoding.data)


    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

async function geoLocation(req, res){
    try {
        
        const geolocation = await client.geolocate({
            params:{
                considerIp: true,
                key: CONFIG.access_key
            }
        })

        res.status(200).send(geolocation.data)

    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

module.exports = { geoCoding, geoLocation }