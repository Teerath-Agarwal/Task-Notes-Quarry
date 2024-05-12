import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connection from './database/config.js'

const app = express()
dotenv.config()
app.use(cors())

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,');
    next();
});

app.get('/', (req,res) => {
    connection.connect()
    res.status(200).send('Backend running successfully')
    connection.end()
})

app.listen(process.env.PORT || 3000, (err) => {
    if (err)
        console.log(`An error occurred: ${err}`)
    else
        console.log(`Listening on port: ${process.env.PORT}`)
})