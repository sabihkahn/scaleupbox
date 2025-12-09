import bycrptjs from 'bcryptjs'
import User from '../models/authmodel.js'
import jwt from 'jsonwebtoken'
import redis from '../config/redis.js'
import dotenv from "dotenv";
import nodemailer from "nodemailer";
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

        if (!userfromgoogle || !userfromgoogle.email) {
            return res.status(400).json({ message: "Invalid Google user data" })
        }

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

        if (!username || !email || !password || !picture) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" })
        }
        if (email.includes(" ") || !email.includes("@") || !email.includes(".")) {
            return res.status(400).json({ message: "Invalid email format" })
        }
        if (username.length < 3) {
            return res.status(400).json({ message: "Username must be at least 3 characters" })
        }

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

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" })
        }
        if (email.includes(" ") || !email.includes("@") || !email.includes(".")) {
            return res.status(400).json({ message: "Invalid email format" })
        }

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


        await redis.set(user._id.toString(), refreshToken, 'EX', 7 * 24 * 60 * 60, ((err, res) => {
            console.log("this is error", err)
            console.log("this is res", res)
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

// forget password 

export const otpsender = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({ message: "Email is required" })
        }
        if (email.includes(" ") || !email.includes("@") || !email.includes(".")) {
            return res.status(400).json({ message: "Invalid email format" })
        }

        let user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" })
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        // saving otp to database

        user.forgetpasswordtoken = otp.toString();
        await user.save();

        // sending otp through  email logic here
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.gmail_user,
                pass: process.env.app_pass
            }
        });

        const mailOptions = {
            from: process.env.gmail_user,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is " ${otp} ". It is valid for 1 use only.`
        };
        await transporter.sendMail(mailOptions)
        return res.status(200).send({message:"email sended correctly"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Cant send the otp" });

    }
}
export const verifyotp = async (req, res) => {
    try {
        const { otp, email } = req.body
        if (!otp) {
            return res.status(400).send({ message: "otp is required" })
        }
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).send({ message: "user dont exist can reset the password" })
        }
        const forgetpasswordtoken = user.forgetpasswordtoken
        if (forgetpasswordtoken !== otp) {
            return res.status(400).send({ message: "otp is invalid" })
        }

        return res.status(200).send({ message: "OTP verified successfully" });

    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: "cant change pass error occur" })

    }
}
export const resetpassword = async (req, res) => {
    try {
        const { newpass, email,otp } = req.body
        const user = await User.findOne({ email: email })
        if (!newpass || !email) {
            return res.status(400).send({ message: "all field`s are required" })
        }
        if (newpass.length < 8) {
            return res.status(400).send({ message: "the password must be atleast 8 character long" })
        }
        if (email.includes(" ") || !email.includes("@") || !email.includes(".")) {
            return res.status(400).json({ message: "Invalid email format" })
        }
        if(otp !== user.forgetpasswordtoken){
            return res.status(400).send({message:"otp is invalid"})
        }
        
        if(!user){
            return res.status(400).send({message:"user does`t exist"})
        }
        const hashedPassword = await bycrptjs.hash(newpass,10)
        user.password = hashedPassword
        await user.save()
        user.forgetpasswordtoken = 'kjasjhahsdkhk.asjhd89273h89y2hjiy89..'
       return res.status(200).send({message:"password reset successfull"})

    } catch (error) {
        console.log(error)
        return res.status(400).send({ message: "can`t reset password" })

    }
}
export const changeexistingpassword = async (req, res) => {
    try {
        const { email, password,newpass } = req.body
        if (!email || !password) {
            return res.status(400).send({ message: "all fields are required" })
        }
        if (password.length < 8) {
            return res.status(400).send({ message: "the password must be atleast 8 character long" })
        }
        if (newpass.length < 8) {
            return res.status(400).send({ message: "the password must be atleast 8 character long" })
        }
        if (email.includes(" ") || !email.includes("@") || !email.includes(".")) {
            return res.status(400).json({ message: "Invalid email format" })
        }
        const user = await User.findOne({email:email}) 
        if(!user){
            return res.status(400).send({message:"no user existed"})
        }   
        const isMached = bycrptjs.compare(password,user.password)
        if(!isMached){
            return res.status(400).send({message:"password does`t match to old password"})
        }
        const hashedPassword = await bycrptjs.hash(newpass,10)
        user.password = hashedPassword
        await user.save()
        
        return res.status(200).send({message:"password reset successfully"})
        

    } catch (error) {
        console.log(error);
return res.status(500).send({message:"somehing went wrong while changing password"})
    }
}