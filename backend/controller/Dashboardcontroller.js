
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import User from "../models/authmodel.js";

export const dashborddata = async (req, res) => {
    try {
        const id = req.id
        const user = await User.findById(id)
        if (!user) {
            return res.status(401).json({ message: "user dont exist" });
        }
        



        return res.status(200).send({
            id:user._id,
            username: user.username,
            picture: user.picture,
            availableTokens: user.availableTokens,
           
        })




    } catch (error) {
        console.log(error);
        res.status.send({ message: "cant get data there is some error in server" })
    }
}



export const Profile = async (req,res)=>{
    try {
        
    } catch (error) {
        console.log("error in getting profile it also effect in prtect routes frontend",error);
        
    }
}
