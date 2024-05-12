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

function signIn(req, res){
        const { email, password } = req.body;
        connection.query(`SELECT id, password FROM Users WHERE email='${email}';`, (err, results) => {
            if (err || !results){
                res.status(402).send({
                    verdict: 'Email Id does not exist',
                    success: false,
                });
                return;
            }
            const id = results[0].id;
            const pwHash = results[0].password;
            
            bcrypt.compare(password, pwHash, (err, result) => {
                if (err) {
                    console.log(`Error in Signing in: ${err}`);
                    res.status(500).send(err);
                    return;
                }
                if ( result==false ){
                    res.status(403).send({
                        verdict: 'Incorrect Password',
                        success: false,
                    });
                    return;
                }
                const token = jwt.sign({id, email}, process.env.JWT_PRIVATE_KEY, { expiresIn: "1h"});
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: true
                });
                res.status(200).send({
                    verdict: 'Sign in successful',
                    success: true,
                });
                return;
            });
        });
}

function signUp(req, res) {
        var { email, userName, password } = req.body;
        const saltRounds = 7;
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                console.log(`Error hashing the password: ${err}`);
                res.status(406).send({
                    verdict: 'Error hashing the password',
                    success: false,
                });
                return;
            }
            connection.query(`
                INSERT INTO Users (email, password, userName)
                VALUES (
                    '${email}',
                    '${hash}',
                    '${userName}'
                );`,
            (err, result) => {
                if (err) {
                    console.log(`Error in creating new user: ${err}`);
                    res.status(403).send({
                        verdict: 'Error in sign up',
                        success: false,
                    })
                    return;
                }
                result.success = true;
                console.log(`Result from inserting data in db: ${result}`)
                res.status(200).send(result);
                return;
            })
            
        });
}

export { authorise, signIn, signUp }