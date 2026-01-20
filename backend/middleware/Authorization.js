import express from 'express';
import User from '../models/authmodel.js'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()

export const  authorization = async(req,res,next)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.id = decoded.id; // attach user to request it will give the data 
        
        next();
        
    } catch (error) {
        console.log("error in authorization",error);
        return res.status(400).send({message:"user authorizatrion failed"})
    }
}
