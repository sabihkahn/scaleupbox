import express from "express";
import nodemailer from 'nodemailer'
import 'dotenv/config'
const router = express.Router();



router.post("/contactus",async (req, res) => {
try {
    const { name, email, message } = req.body;
      const transporter = nodemailer.createTransport({
                 service: 'gmail',
                 host: 'smtp.gmail.com',
                 port: 465,
                 secure: true, // use SSL
                 auth: {
                     user: process.env.gmail_user,
                     pass: process.env.app_pass
                 }
             });
     
             const mailOptions = {
                 from: process.env.gmail_user,
                 to: "sabihkhan.dev@gmail.com",
                 subject: 'Contact Us Message',
                 text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
             };
             await transporter.sendMail(mailOptions)
             return res.status(200).send({message:"email sended correctly"})

   
} catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred while submitting the contact form." });
    
}
});

export default router;