import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
const app = express()
import cors from 'cors'
import authroutes from './Routes/AuthRoutes/authroute.js'
import  connectDB  from './config/db.js'
 
// connecting database 
connectDB()
app.use(cors({
    origin: [
        "http://localhost:5173/",
        "http://localhost:5173"
    ]
}))

// middleware to parse JSON and URL-encoded data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// imported routes
app.use('/auth',authroutes)



// routes test
app.get('/', (req, res) => {
    res.send('Hello World!')
})


const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})