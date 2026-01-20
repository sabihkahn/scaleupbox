import express from 'express'
import { removebg } from '../../cloudinary/cloudinary.js';
import { authorization } from '../../middleware/Authorization.js';
const router = express.Router()
import mongoose from 'mongoose';
import User from '../../models/authmodel.js';
import redis from '../../config/redis.js'


router.post('/rembg',authorization,async(req,res)=>{
    try {
        const { publicid } = req.body;

        if (!publicid) {
            return res.status(400).json({ error: 'Public ID is required' });
        }
        removebg(publicid).then(async (result) => {
       console.log(result);
       
          await User.findByIdAndUpdate(req.id, { $push: { bgremoveimgs: result} }, { new: true })
            .then((updatedUser) => {
                if (!updatedUser) {
                    return res.status(404).json({ error: 'User not found' });
                }
               
            })
            .catch((error) => {
                console.error('Error updating user:', error);
            });  
         await redis.del(`user:${req.id}`);    
          

            return res.status(200).json({ bgRemovedUrl: result });
        }).catch((error) => {
            console.error('Error removing background:', error);
            return res.status(500).json({ error: 'Failed to remove background' });
        });

    }
    catch (error) {
        console.error('Error removing background:', error);
        res.status(500).json({ error: 'Failed to remove background' });
    }})



    router.get('/rembg/history',authorization,async(req,res)=>{
        try {
             await redis.get(`user:${req.id}`, async (err, cachedData) => {
                if (err) {
                    console.error('Redis error:', err);
                }
                if (cachedData) {
                    console.log('Serving from cache');
                    return res.status(200).json(JSON.parse(cachedData));
                } else {
                    console.log('Fetching from database');
                    
                     await  User.findById(req.id).select('bgremoveimgs').then((user) => {
                        if (!user) {
                            return res.status(404).json({ error: 'User not found' });
                        }
                        const responseData = { bgRemovedHistory: user.bgremoveimgs };
                        // Cache the data in Redis for future requests
                        redis.setex(`user:${req.id}`, 3600, JSON.stringify(responseData)); // Cache for 1 hour
                        return res.status(200).json(responseData);
                    }).catch((error) => {
                        console.error('Error fetching user:', error);
                        return res.status(500).json({ error: 'cant get history Server error' });
                    });
                }
            });
           
        }   
 catch (error) {
            console.log(error);
            res.status(400).json({ error: 'cant get the removebackground history Server error' });
            
        }
    })
            
export default router