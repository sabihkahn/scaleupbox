import express from 'express'
import { removebg } from '../../cloudinary/cloudinary.js';
import { authorization } from '../../middleware/Authorization.js';
const router = express.Router()
import mongoose from 'mongoose';
import User from '../../models/authmodel.js';
router.post('/rembg',authorization,async(req,res)=>{
    try {
        const { publicid } = req.body;

        if (!publicid) {
            return res.status(400).json({ error: 'Public ID is required' });
        }
        removebg(publicid).then((result) => {
       console.log(result);
       
            User.findByIdAndUpdate(req.id, { $push: { bgremoveimgs: result} }, { new: true })
            .then((updatedUser) => {
                if (!updatedUser) {
                    return res.status(404).json({ error: 'User not found' });
                }
               
            })
            .catch((error) => {
                console.error('Error updating user:', error);
            });      
          

            return res.status(200).json({ bgRemovedUrl: result });
        }).catch((error) => {
            console.error('Error removing background:', error);
            return res.status(500).json({ error: 'Failed to remove background' });
        });

    }
    catch (error) {
        console.error('Error removing background:', error);
        res.status(500).json({ error: 'Failed to remove background' });
    }



}

)


export default router