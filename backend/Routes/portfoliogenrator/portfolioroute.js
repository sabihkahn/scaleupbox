import express from "express";
import Portfolio from "../../models/portfoliomodel.js";
import Auth from "../../models/authmodel.js";
import redis from "../../config/redis.js";
import { authorization } from "../../middleware/Authorization.js";

const router = express.Router();



router.post("/portfolio/create", authorization, async (req, res) => {
try {
  const id = req.id
  const { profile, websiteType, skills, education, projects, socialLinks, slug } = req.body
    if(!profile || !websiteType || !skills || !education || !projects || !socialLinks || !slug){
      return res.status(400).send({messaage:"all fields are required"})
    }

  const portfolio = await Portfolio.create({profile, websiteType, skills, education, projects, socialLinks, slug,clicks:0})
  const Savedportfolio = await Auth.findByIdAndUpdate(id, { $push: { portfoliowebsites : portfolio._id}})
  const redisdata = JSON.stringify(portfolio)
  redis.set(slug, redisdata, "EX", 60*30)
  res.status(200).send({ message: "portfolio created successfully", url:`http://localhost:4000/portfolio/${slug}`})


} catch (error) {
  console.log(("error come while creating portfolio",error));
  res.status(400).send({message:"an error occur while creating portfolio",error})
}

});



router.get("/portfolio/:slug", async (req, res) => {




  
});

export default router;
