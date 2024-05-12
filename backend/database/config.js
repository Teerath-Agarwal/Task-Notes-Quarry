import sql from 'mysql'
import dotenv from 'dotenv'

dotenv.config()

var connection = sql.createConnection({
    host: process.env.URL_DB,
    user: process.env.USERNAME_DB,
    password: process.env.PASS_DB,
    database: process.env.DATABASE_DB
})

export default connection;