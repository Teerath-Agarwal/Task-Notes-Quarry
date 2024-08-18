import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import { signIn, signOut, signUp, authorise } from './authorisation/userAuth.js'
import { deleteById, getByUsr, putByUsr, updtById } from './taskRoutes/routes.js'

const app = express()
dotenv.config()
app.use(cors())

app.use(express.json());
app.use(cookieParser());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
    next();
});

app.route('/welcome')
    .get(authorise, getByUsr)
    .put(authorise, putByUsr)

app.route('/task/:id')
    .post(authorise, updtById)
    .delete(authorise, deleteById)

app.post('/login', signIn)

app.put('/signup', signUp)

app.delete('/logout', signOut)

app.get('/', (req, res) => {
    res.status(200).send('Backend running successfully')
})

app.listen(process.env.PORT || 3000, (err) => {
    if (err)
        console.log(`An error occurred: ${err}`)
    else
        console.log(`Listening on port: ${process.env.PORT || 3000}`)
})
