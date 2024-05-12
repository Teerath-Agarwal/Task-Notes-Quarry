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
    connection.connect( (err) => {
        if (err) {
            console.log(`Error connecting to database: ${err}`);
            res.status(406).send({
                verdict: 'Error connecting to database'
            });
            return;
        }
        const { email, password } = req.body;
        connection.query(`SELECT id, password FROM Users WHERE email='${email};'`, (err, results) => {
            connection.end()
            if (err){
                res.status(402).send({
                    verdict: 'Email Id does not exist'
                });
                return;
            }
            console.log(`Results of db query: ${results}`);
            const id = results[0];
            const pwHash = results[1];
            
            bcrypt.compare(password, pwHash, (err, result) => {
                if (err) {
                    console.log(`Error in Signing in: ${err}`);
                    res.status(500).send(err);
                    return;
                }
                if ( result==false ){
                    res.status(403).send({
                        verdict: 'Incorrect Password'
                    });
                    return;
                }
                const token = jwt.sign(id, process.env.JTW_PRIVATE_KEY, { expiresIn: "1h"});
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: true
                });
                res.status(200).send('Sign in successful')
                return;
            });
        });
    });
}

function signUp(req, res) {
    connection.connect( (err) => {
        if (err) {
            console.log(`Error connecting to database: ${err}`);
            res.status(406).send({
                verdict: 'Error connecting to database'
            });
            return;
        }
        var { email, userName, password } = req.body;
        const saltRounds = 7;
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                connection.end();
                console.log(`Error hashing the password: ${err}`);
                res.status(406).send({
                    verdict: 'Error hashing the password'
                });
                return;
            }
            connection.query(`
                INSERT INTO Users (email, password, userName)
                VALUES (
                    '${email}',
                    '${hash}',
                    '${userName}
                );
            `, (err, result) => {
                connection.end();
                if (err) {
                    console.log(`Error in creating new user: ${err}`);
                    res.status(403).send({
                        verdict: 'Error in sign up'
                    })
                    return;
                }
                console.log(`Result from inserting data in db: ${result}`)
                res.status(200).send(result);
                return;
            })
            
        });
    });
}

export { authorise, signIn, signUp }