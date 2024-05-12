import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import connection from '../database/config.js'

dotenv.config();

function authorise(req, res, next) {
    const token = req.cookies.token;
    try {
        const user = jwt.verify(token, process.env.JTW_PRIVATE_KEY);
        req.userid = user.id;
        next();
    }
    catch (err) {
        console.log(`Authorisation Error: ${err}`);
        res.clearCookie('token');
        res.send(err);
    }
}

export { authorise }