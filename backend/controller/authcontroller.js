

import User from '../models/authmodel.js'
import jwt from 'jsonwebtoken'


const refreshtoken = (user)=>{
 return jwt.sign({id:user._id},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d'})
}
const accesstoken = (user)=>{
    return jwt.sign({id:user._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15m'})
}

export const googleAuth = async (req, res) => {
    const { userfromgoogle } = req;

    try {
        let user = await User.findOne({ email: userfromgoogle.email });

        if (!user) {
            user = await User.create({
                username: userfromgoogle.name,
                email: userfromgoogle.email,
                googleId: userfromgoogle.sub,
                picture: userfromgoogle.picture
            });
        }

        const accessToken = accesstoken(user);
        const refreshToken = refreshtoken(user);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // true in production
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "User logged in successfully",
            success: true,
            username: user.username,
            accessToken
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}
