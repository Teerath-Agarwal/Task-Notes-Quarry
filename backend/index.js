import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

const app = express()
dotenv.config()
app.use(cors())

app.get('/', (req,res) => {
    res.status(200).send('Backend running successfully')
})

app.listen(process.env.PORT || 3000, (err) => {
    if (err)
        console.log(`An error occurred: ${err}`)
    else
        console.log(`Listening on port: ${process.env.PORT}`)
})