const request = require('postman-request')

module.exports = (address,callback) => {
    const mapbox_query = encodeURIComponent(address);
    const url = "https://api.mapbox.com/geocoding/v5/mapbox.places/"+mapbox_query+".json?access_token="+process.env.MAPBOX_API_KEY+"&limit=1";

    request({url, json: true}, (error, {body:response})=>{
        if ( error ){
            callback('Unable to connect to mapbox')
        } else if ( response.message ) {
            callback(response.message)
        } else if ( !response.features.length ) {
            callback('Search did not return any results')
        } else {
            const longitude = response.features[0].geometry.coordinates[0]
            const latitude = response.features[0].geometry.coordinates[1]
            const location = response.features[0].place_name
            callback(undefined, {longitude, latitude, location})
        }
    })
}