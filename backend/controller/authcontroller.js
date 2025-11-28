import bycrptjs from 'bcryptjs'
import User from '../models/authmodel.js'
import jwt from 'jsonwebtoken'
import redis from '../config/redis.js'
import dotenv from "dotenv";
dotenv.config();

const refreshtoken = (user) => {
    return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}
const accesstoken = (user) => {
    return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
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
        await redis.set(user._id.toString(), refreshToken, 'EX', 7 * 24 * 60 * 60);
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
//creating access token from refresh token
export const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
  
    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }


    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedRefreshToken = await redis.get(decoded.id);
        if (storedRefreshToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newAccessToken = accesstoken(user);

        return res.status(200).json({
            message: "Access token refreshed successfully",
            accessToken: newAccessToken
        });

    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: "Invalid refresh token" });
    }
}
// creating logout function

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (!refreshToken) {
            return res.status(400).json({ message: "No refresh token provided" });
        }
        await redis.del(decoded.id);
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false, // true in production
            sameSite: "strict"
        });

        return res.status(200).json({
            message: "User logged out successfully"
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while logout", error });
    }
}

// register with email and password


export const registerauth = async (req, res) => {
    const { username, email, password, picture } = req.body;
    try {
        let user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bycrptjs.hash(password, 10);
        user = await User.create({
            username,
            email,
            password: hashedPassword,
            picture
        });
        const accessToken = accesstoken(user);
        const refreshToken = refreshtoken(user);
        await redis.set(user._id.toString(), refreshToken, 'EX', 7 * 24 * 60 * 60);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // true in production
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(201).json({ message: "User registered successfully", accessToken });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}


// login with email and password

export const loginauth = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        const isMatch = await bycrptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const accessToken = accesstoken(user);
        const refreshToken = refreshtoken(user);


        await redis.set(user._id.toString(), refreshToken, 'EX', 7 * 24 * 60 * 60,((err,res)=>{console.log("this is error",err) 
            console.log("this is res",res)
        }))
        
        
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // true in production
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({ message: "User logged in successfully", accessToken, username: user.username });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}
