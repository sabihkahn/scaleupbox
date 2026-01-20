// cloudinary.image("me/bgr-apparel-1.png", {effect: "background_removal"})
import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cookieParser from "cookie-parser";
const app = express()
import cors from 'cors'

import { v2 as cloudinary } from 'cloudinary';


app.use(cors());
app.use(express.json());
app.use(cookieParser());


    cloudinary.config({
        cloud_name: "dozkfwdr1",
        api_key: process.env.cloudinary_api_key,
        api_secret: process.env.cloudinary_api_secret
    });

// async function uploadimg(file) {
//     try {
//         const result = await cloudinary.uploader.upload(file, {
//             folder: "uploads",
//             resource_type: "image"
//         });
//         console.log(result);
        
//         return result;
//     } catch (error) {
//         console.error("Error uploading image:", error);
//         throw error;
//     }
// }


// uploadimg('../imp.png')


export async function removebg(publicid = '') {
  try {
      return cloudinary.url(publicid, {
          effect: "background_removal",
          format: "png",
          cloud_name: "dozkfwdr1"
      });
  } catch (error) {
     console.log("this is error",error);
     
  }
}

