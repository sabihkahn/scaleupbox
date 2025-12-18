
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import Projectmodel from "../models/projectmodel.js";
export const dashborddata = async (req, res) => {
    try {
        const { browserEtag } = req.body
        const user = req.user
        const Etag = crypto.createHash('md5').update(JSON.stringify(user)).digest('hex');

        if (browserEtag == Etag) {
            return res.status(304).end()
        }

        const projects = user.Projects.map((e) => 
            ({
                id: e._id,
                createdAt: e.createdAt,
                name: e.name
            })
        )


        return res.status(200).send({
            id:user._id,
            username: user.username,
            picture: user.picture,
            projects:projects,
            totalWebsites: user.totalWebsites,
            publishedwebsites: user.publishedwebsites,
            Totalviews: user.Totalviews,
            availableTokens: user.availableTokens,
            Etag:Etag
        })




    } catch (error) {
        console.log(error);
        res.status.send({ message: "cant get data there is some error in server" })
    }
}




