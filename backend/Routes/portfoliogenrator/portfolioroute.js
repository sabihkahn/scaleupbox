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
    if (!profile || !websiteType || !skills || !education || !projects || !socialLinks || !slug) {
      return res.status(400).send({ messaage: "all fields are required" })
    }

    const portfolio = await Portfolio.create({ profile, websiteType, skills, education, projects, socialLinks, slug, clicks: 0 })
    const Savedportfolio = await Auth.findByIdAndUpdate(id, { $push: { portfoliowebsites: portfolio._id } })
    const redisdata = JSON.stringify(portfolio)
    redis.set(slug, redisdata, "EX", 60 * 30)
    res.status(200).send({ message: "portfolio created successfully", url: `/portfolio/${slug}` })


  } catch (error) {
    console.log(("error come while creating portfolio", error));
    res.status(400).send({ message: "an error occur while creating portfolio", error })
  }

});



router.get("/portfolio/:slug", async (req, res) => {
  console.log("Slug route hit:", req.params.slug)
  const portfolioSlug = req.params.slug;

  if (!portfolioSlug) {
    return res.status(400).send({ message: "please give a proper url" })
  }

  try {
    let htmldata;

    const dataredis =await redis.get(portfolioSlug)
  
    
    if(dataredis){
      htmldata = JSON.parse(dataredis)
      console.log('from redis')
    }
    else{
    const data = await Portfolio.findOne({slug:portfolioSlug})
      if (!data) {
        return res.status(404).send({ message: "Portfolio not found" });
      }
      if (data.isPublished === false) {
        return res.status(403).send({ message: "Portfolio is not published yet" });
      }
      data.clicks = (data.clicks || 0) + 1;
    await data.save()
    redis.set(portfolioSlug, JSON.stringify(data), "EX", 10 * 10)
    htmldata = data
     
  }
 console.log("htmldata recived");
 

    const rawhtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${htmldata?.profile?.name || "Portfolio"} | Digital Presence</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com" rel="stylesheet">
  <style>
    :root { font-family: 'Inter', sans-serif; }
    body { background: #080808; color: #fafafa; }
    
    .glass {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .hero-gradient {
      background: radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%);
    }

    .text-gradient {
      background: linear-gradient(to bottom right, #fff 30%, rgba(255,255,255,0.5));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .project-card:hover .project-image { transform: scale(1.05); }
  </style>
</head>

<body class="overflow-x-hidden selection:bg-indigo-500/30">

<!-- BACKGROUND DECOR -->
<div class="fixed inset-0 hero-gradient -z-10"></div>

<!-- HERO -->
<section class="min-h-screen flex flex-col items-center justify-center px-6 relative">
  <div class="max-w-4xl w-full text-center">
    
    <div class="relative inline-block mb-10">
      <div class="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 rounded-full"></div>
      <img src="${htmldata?.profile?.profileImage || ""}"
           class="relative w-32 h-32 md:w-40 md:h-40 mx-auto rounded-[2.5rem] object-cover border border-white/10 p-1 shadow-2xl">
    </div>

    <h1 class="text-6xl md:text-8xl font-extrabold tracking-tight mb-6 text-gradient">
      ${htmldata?.profile?.name || "Your Name"}
    </h1>

    <p class="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10 font-light">
      ${htmldata?.profile?.description || "Crafting digital experiences with precision and purpose."}
    </p>

    <div class="flex flex-wrap justify-center gap-4 text-sm font-medium">
      <a href="mailto:${htmldata?.profile?.email}" class="px-6 py-3 glass rounded-full hover:bg-white/10 transition-all duration-300">
        ${htmldata?.profile?.email || "email@example.com"}
      </a>
      <div class="px-6 py-3 glass rounded-full text-gray-400">
        ${htmldata?.profile?.phone || "+00 000 000"}
      </div>
    </div>
  </div>
  
  <div class="absolute bottom-10 animate-bounce opacity-20">
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
  </div>
</section>

<!-- SKILLS -->
<section class="py-32 px-6 max-w-5xl mx-auto">
  <div class="flex items-center gap-4 mb-16">
    <h2 class="text-3xl font-bold">Expertise</h2>
    <div class="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
  </div>

  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    ${(htmldata?.skills || []).map(e => `
      <div class="glass p-4 rounded-2xl text-center group hover:border-indigo-500/50 transition-all duration-500">
        <span class="text-gray-300 group-hover:text-white transition-colors">${e.name}</span>
      </div>
    `).join("")}
  </div>
</section>

<!-- PROJECTS -->
<section class="py-32 px-6 max-w-7xl mx-auto">
  <div class="flex items-center gap-4 mb-16">
    <div class="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent"></div>
    <h2 class="text-3xl font-bold">Selected Work</h2>
    <div class="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
  </div>

  <div class="grid md:grid-cols-2 gap-8">
    ${(htmldata?.projects || []).map(e => `
      <div class="project-card group relative glass rounded-[2rem] overflow-hidden transition-all duration-500">
        <div class="aspect-video overflow-hidden">
          <img src="${e.image}" class="project-image w-full h-full object-cover transition-transform duration-700 ease-out">
        </div>

        <div class="p-8">
          <h3 class="text-2xl font-bold mb-3 group-hover:text-indigo-400 transition-colors">${e.name}</h3>
          <p class="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-2">${e.description}</p>

          <div class="flex gap-4">
            <a href="${e.githubUrl}" target="_blank" class="flex-1 py-3 text-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest">Code</a>
            <a href="${e.liveUrl}" target="_blank" class="flex-1 py-3 text-center rounded-xl bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all text-xs font-bold uppercase tracking-widest">Live View</a>
          </div>
        </div>
      </div>
    `).join("")}
  </div>
</section>

<!-- EDUCATION & SOCIAL -->
<div class="grid lg:grid-cols-2 max-w-7xl mx-auto px-6 py-32 gap-20">
  
  <section>
    <h2 class="text-3xl font-bold mb-12">Education</h2>
    <div class="space-y-4">
      ${(htmldata?.education || []).map(e => `
        <div class="glass p-6 rounded-2xl border-l-4 border-l-indigo-500">
          <h3 class="text-gray-200 font-medium">${e.description}</h3>
        </div>
      `).join("")}
    </div>
  </section>

  <section class="flex flex-col justify-center items-center lg:items-start">
    <h2 class="text-3xl font-bold mb-12">Let's Connect</h2>
    <div class="flex flex-wrap gap-6">
      ${(htmldata?.socialLinks || []).map(e => `
        <a href="${e.url}" target="_blank"
           class="group flex items-center gap-3 px-8 py-4 glass rounded-2xl hover:bg-white hover:text-black transition-all duration-500">
          <span class="font-bold tracking-tight">${e.platform}</span>
          <svg class="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H7M17 7v10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </a>
      `).join("")}
    </div>
  </section>
</div>

<!-- FOOTER -->
<footer class="py-20 border-t border-white/5 text-center">
  <p class="text-gray-500 text-sm tracking-widest uppercase">
    © ${new Date().getFullYear()} — ${htmldata?.profile?.name || "Portfolio"}. 
  </p>
</footer>

</body>
</html>
`


res.status(200).send(rawhtml)

  } catch (error) {
    console.log(error);
    res.status(400).send({ messaage: "an error occur while geting website", error })
  }

});


router.delete("/portfolio/delete/:id", authorization, async (req, res) => {
  const id = req.id
  const portfolioId = req.params.id

  if (!portfolioId) {
    return res.status(400).send({ message: "please give a proper url" })
  }

  try {
    const portfolio = await Portfolio.findById(portfolioId)
    if (!portfolio) {
      return res.status(400).send({ message: "cant found portfolio" })
    }

    const auth = await Auth.findById(id)
    if (!auth) {
      return res.status(400).send({ message: "cant found user" })
    }

    if (auth.portfoliowebsites.includes(portfolioId)) {
      await Portfolio.findByIdAndDelete(portfolioId)
      await Auth.findByIdAndUpdate(id, { $pull: { portfoliowebsites: portfolioId } })
      res.status(200).send({ message: "portfolio deleted successfully" })
    }
    else {
      res.status(400).send({ message: "you are not authorized to delete this portfolio" })
    }

  } catch (error) {
    console.log(error);
    res.status(400).send({ messaage: "an error occur while deleting portfolio", error })
  }

});

router.get("/portfolio-all", authorization, async (req, res) => {
  const id = req.id

  try {
    const auth = await Auth.findById(id).populate("portfoliowebsites").select("_id slug profile")
    if (!auth) {
      return res.status(400).send({ message: "cant found user" })
    }

    res.status(200).send({ portfoliowebsites: auth.portfoliowebsites })

  } catch (error) {
    console.log(error);
    res.status(400).send({ messaage: "an error occur while getting portfolios", error })
  }

});

// router.put('/enable-disable-portfolio/:id', authorization, async (req, res) => {
//   const id = req.id
//   const portfolioId = req.params.id

//   if (!portfolioId) {
//     return res.status(400).send({ message: "please give a proper url" })
//   }

//   try {
//     const portfolio = await Portfolio.findById(portfolioId)
//     if (!portfolio) {
//       return res.status(400).send({ message: "cant found portfolio" })
//     }

//     const auth = await Auth.findById(id)
//     if (!auth) {
//       return res.status(400).send({ message: "cant found user" })
//     }

//     if (auth.portfoliowebsites.includes(portfolioId)) {
//       portfolio.isPublished = !portfolio.isPublished
//       await portfolio.save()
//       res.status(200).send({ message: `portfolio ${portfolio.isPublished ? "enabled" : "disabled"} successfully` })
//     }
//     else {
//       res.status(400).send({ message: "you are not authorized to update this portfolio" })
//     }

//   } catch (error) {
//     console.log(error);
//     res.status(400).send({ messaage: "an error occur while updating portfolio", error })
//   }

// });


export default router;
