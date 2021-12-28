const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
require('dotenv').config({path:'./private/api-keys.env'})

const app = express()
const port = process.env.PORT || 3000

// define paths for Express config
const publicDirectoryPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

// define view engine (Handlebars) and set custom views path (otherwise, defaults to "views")
app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)

// set public folder as site static content
app.use(express.static(publicDirectoryPath))

app.get('',(req,res)=>{
    res.render('index', {
        title: 'Weather App',
        name: 'Nick Blum'
    })
})

app.get('/about',(req,res)=>{
    res.render('about',{
        title: 'About me',
        name: 'Nick Blum'
    })
})

app.get('/help',(req,res)=>{
    res.render('help',{
        title: 'Help',
        name: 'Nick Blum',
        message: 'Help topic #1: How do I even?'
    })
})

app.get('/weather',(req,res)=>{
    if ( !req.query.address ){
        return res.send({ error: "You must provide an address"})
    }

    geocode(req.query.address,(error,{latitude,longitude,location}={})=>{
        if ( error ) return res.send({ error })
        
        forecast(longitude, latitude, (error, forecast) => {
            if ( error ) return res.send({ error })
            
            res.send({
                location,
                forecast,
                address: req.query.address
            })
        })
    })
})

app.get('/products',(req,res)=>{
    console.log(req.query)
    if (!req.query.search){
        return res.send({ error: "You must provide a search term"})
    }
    res.send({
        products: []
    })
})

// 404 Handling
app.get('/help/*',(req,res)=>{
    res.render('error',{
        title: '404',
        name: 'Nick Blum',
        error: 'Help article not found'
    })
})
app.get('*',(req,res)=>{
    res.render('error',{
        title: '404',
        name: 'Nick Blum',
        error: 'File not found'
    })
})

// Let's go!
app.listen(port, ()=>{
    console.log('Server is up on port ' + port)
})