import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
// import connection from './database/config.js'
import { signIn, signOut, signUp, authorise } from './authorisation/userAuth.js'

const app = express()
dotenv.config()
app.use(cors())

app.use(express.json());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,');
    next();
});

app.post('/login', signIn)

app.put('/signup', signUp)

app.delete('/logout', signOut)

app.get('/', (req,res) => {
    res.status(200).send('Backend running successfully')
})

app.listen(process.env.PORT || 3000, (err) => {
    if (err)
        console.log(`An error occurred: ${err}`)
    else
        console.log(`Listening on port: ${process.env.PORT}`)
})