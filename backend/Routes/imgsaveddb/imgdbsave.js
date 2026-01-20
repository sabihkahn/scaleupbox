import express from 'express';
const router = express.Router();
import redis from '../../config/redis.js'
import {authorization} from '../../middleware/Authorization.js'
import User from '../../models/authmodel.js'

router.post('/imgsaveddb', authorization, async (req, res) => {
    try {
        const { imgstroage } = req.body;
        await redis.del("imgurl"+req.id); // Clear existing image URL for the user
       const user = await User.findByIdAndUpdate(req.id, { $push: { imgstroage: imgstroage }}) // Save new image URL to Redis with user ID as part of the key
        res.status(200).json({ message: 'Image URL saved successfully' });
    }
    catch (error) {
        console.error('Error saving image URL to Redis:', error);
        res.status(400).json({ message: 'cant save image ' });
    }

}


)

router.get('/getimgsaveddb', authorization, async (req, res) => {
    try {
   
         await redis.get("imgurl"+req.id,async(err,cached)=>{
           if (err){
            res.status(400).json({message:'check redis url maybe the problem is their cant get image errr wile fetching image from redis '});
           }
              if (cached){
                return res.status(200).json({imgstroage:JSON.parse(cached)});
              }
              else{
                const user = await User.findById(req.id);
                await redis.set("imgurl"+req.id,JSON.stringify( user.imgstroage));
                res.status(200).json({ imgstroage: user.imgstroage });
              }

         });     
    }
    catch (error) {
        console.error('Error getting image URL from Redis:', error);
        res.status(400).json({ message: 'cant get image ' });
    }

})

export default router