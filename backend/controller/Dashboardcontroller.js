
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import User from "../models/authmodel.js";
import mongoose from 'mongoose';

export const dashborddata = async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.id)
        const user = await User.aggregate([
            { $match: { _id: id } },
            {
                $project: {
                    username: 1,

                    picture: 1,
                    totalbgremoveimgs: { $size: "$bgremoveimgs" },
                    totalimgstroage: { $size: "$imgstroage" },
                    totalclientinfo: { $size: "$clientinfo" },
                    totalportfoliowebsites: { $size: "$portfoliowebsites" }
                }
            }

        ]
        )
        // console.log(user);

        if (!user.length > 0) {
            return res.status(404).send({ message: "user not found" })
        }


        res.status(200).send({ message: "data get successfully", data: user })



    } catch (error) {
        console.log(error);
        res.status.send({ message: "cant get data there is some error in server" })
    }
}



export const Profile = async (req, res) => {
    try {
        const id = req.id
        const user = await User.findById(id).select("-password")
        if (!user) {
            return res.status(404).send({ message: "user not found" })
        }
        res.status(200).send({
            message: "data get successfully", data: {
                username: user.username,
                email: user.email,
                picture: user.picture,
                createdAt: user.createdAt


            }
        })

    } catch (error) {
        console.log("error in getting profile it also effect in prtect routes frontend", error);

    }
}

export const updateProfile = async (req, res) => {
    try {
        const id = req.id
        const { username, email } = req.body
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).send({ message: "user not found" })
        }
        user.username = username || user.username
        user.email = email || user.email
        await user.save()
        res.status(200).send({ message: "profile updated successfully" })

    } catch (error) {
        res.status(400).send({ message: "cant update profile there is some error in server" })
        console.log("error in updating profile it also effect in prtect routes frontend", error);

    }
}   