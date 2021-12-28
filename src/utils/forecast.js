const request = require('postman-request')

module.exports = (longitude, latitude, callback) => {
    const url = "http://api.weatherstack.com/current?access_key="+process.env.WEATHER_API_KEY+"&query="+latitude+','+longitude+"&units=f";

    request({url, json: true}, (error, {body:response})=>{
       if ( error ) {
            callback('Unable to connect to weather forecast')
       } else if ( response.error ) {
            callback(response.error.info)
       } else {
            const output = `${response.current.weather_descriptions[0]}. It is currently ${response.current.temperature} degrees out. It feels like ${response.current.feelslike} degrees out. The humidity is ${response.current.humidity}%.`
            callback(undefined, output)
       }
    })
}