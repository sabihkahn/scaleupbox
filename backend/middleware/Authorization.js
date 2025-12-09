import express from 'express';
import User from '../models/authmodel'
import jwt from 'jsonwebtoken';


export const  authorization = async(req,res,next)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = user; // attach user to request it will give the data 
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).send({message:"user authorizatrion failed"})
    }
}
