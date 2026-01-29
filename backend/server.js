import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cookieParser from "cookie-parser";
const app = express()
import cors from 'cors'
import authroutes from './Routes/AuthRoutes/authroute.js'
import  connectDB  from './config/db.js'
import {rateLimitMiddleware} from './middleware/ratelimiting.js'
import dashboardroutes from './Routes/DashboardRoutes/dashboardroutes.js'
import aiwebsiteroute from './Routes/AIroutes/airoute.js'
import removebgroute from './Routes/rmbg/removebg.js'
import  imgsavedroute from './Routes/imgsaveddb/imgdbsave.js'
import client from './Routes/clientsdataroute/clientroute.js'
app.set("trust proxy", 1);

// connecting database 

connectDB()
app.use(cors({
    origin: [
        "http://localhost:5173/",
        "http://localhost:5173",
        "http://localhost:5173/auth"
    ],
    credentials:true
}))

// middleware to parse JSON and URL-encoded data

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(rateLimitMiddleware(10,15)) // 5 requests per 30s

// imported routes

app.use('/auth',authroutes)
app.use('/user',dashboardroutes)
app.use('/ai',aiwebsiteroute)
app.use('/photo',removebgroute)
app.use('/imgstorage',imgsavedroute)
app.use('/client',client);
// routes test  

app.get('/', (req, res) => {
    res.send('Hello World!')
    
})


const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})