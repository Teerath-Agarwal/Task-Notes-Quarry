import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import connection from '../database/config.js'

dotenv.config();

function authorise(req, res, next) {
    try {
        const { token } = req.cookies;
        if (token == undefined)
            throw 'User not signed in!'
        const user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        if (req.body.user && (user.id != req.body.user)){
            res.status(403).send({
                verdict: 'Access denied. Unauthorized request.',
                success: false,
            });
            return;
        }
        else
            req.body.user = user.id;
        next();
    }
    catch (err) {
        console.log(`Authorisation Error: ${err}`);
        res.clearCookie('token');
        res.status(500).send({
            verdict: `Authorisation Error: ${err}`,
            success: false,
        });
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
                res.status(200).send(result);
                return;
            })
            
        });
}

function signOut(req, res) {
    try {
        res.clearCookie('token');
        res.status(200).send({success: true});
    }
    catch (err) {
        console.log(`Error in Sign Out: ${err}`);
        res.status(403).send({
            verdict: 'Error in signing out',
            success: false
        })
    }
}

export { authorise, signIn, signUp, signOut }