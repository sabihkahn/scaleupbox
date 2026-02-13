import express from "express";
import Portfolio from "../../models/portfoliomodel.js";
import Auth from "../../models/authmodel.js";
import redis from "../../config/redis.js";
import { authorization } from "../../middleware/Authorization.js";

const router = express.Router();

/*
========================================
1️⃣ CREATE / GENERATE WEBSITE
========================================
*/

router.post("/portfolio/create", authorization, async (req, res) => {
    try {
        const { data } = req.body;

        if (!data) {
            return res.status(400).json({ message: "Portfolio data is required" });
        }

        // Create portfolio in DB
        const portfolio = await Portfolio.create(data);

        // Attach portfolio to user
        await Auth.findByIdAndUpdate(req.id, {
            $push: { portfoliowebsites: portfolio._id },
        });

        // Store minimal data in redis (websiteName:id)
        const redisKey = `${portfolio.slug}:${portfolio._id}`;

        await redis.set(
            redisKey,
            JSON.stringify({
                id: portfolio._id,
                slug: portfolio.slug,
            })
        );

        return res.status(201).json({
            success: true,
            message: "Portfolio created successfully",
            portfolio,
        });
    } catch (error) {
        console.log("Error creating portfolio:", error);
        return res.status(500).json({
            message: "Error creating portfolio",
            error: error.message,
        });
    }
});

/*
========================================
2️⃣ GET WEBSITE BY SLUG (RAW HTML)
========================================
*/

router.get("/portfolio/:slug", async (req, res) => {
    try {
        const { slug } = req.params;

        // Step 1: check redis first
        const redisKeys = await redis.keys(`${slug}:*`);

        let portfolio;

        if (redisKeys.length > 0) {
            const cached = await redis.get(redisKeys[0]);
            const parsed = JSON.parse(cached);

            portfolio = await Portfolio.findById(parsed.id);
        } else {
            portfolio = await Portfolio.findOne({ slug });

            if (!portfolio) {
                return res.status(404).send("Website not found");
            }

            // store into redis
            const redisKey = `${portfolio.slug}:${portfolio._id}`;

            await redis.set(
                redisKey,
                JSON.stringify({
                    id: portfolio._id,
                    slug: portfolio.slug,
                })
            );
        }

        if (!portfolio.isPublished) {
            return res.status(403).send("Website is not published");
        }

        /*
        ========================================
        BUILD RAW HTML (STATIC TEMPLATE + DATA)
        ========================================
        */

        const skillsHTML = portfolio.skills
            .map((skill) => `<li>${skill.name}</li>`)
            .join("");

        const projectsHTML = portfolio.projects
            .map(
                (project) => `
        <div class="project">
          <h3>${project.name}</h3>
          <img src="${project.image}" width="200" />
          <p>${project.description}</p>
          <a href="${project.liveUrl}" target="_blank">Live</a>
          <a href="${project.githubUrl}" target="_blank">GitHub</a>
        </div>
      `
            )
            .join("");

        const socialLinksHTML = portfolio.socialLinks
            .map(
                (social) => `
        <a href="${social.url}" target="_blank">${social.platform}</a>
      `
            )
            .join("");


        const rawHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${portfolio.profile.name} | Creative Portfolio</title>

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- GSAP CDN -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>

  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Poppins:wght@400;600;700&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet">

  <style>
    /* Fonts */
    body {
      font-family: 'Poppins', sans-serif;
      margin: 0;
      padding: 0;
      background: #0a0a0a;
      color: #fff;
      overflow-x: hidden;
      transition: background 0.3s, color 0.3s;
    }
    h1, h2, h3 {
      font-family: 'Space Grotesk', sans-serif;
    }
    code, .mono {
      font-family: 'Roboto Mono', monospace;
    }

    /* Glassmorphism Panels */
    .glass {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      padding: 1.5rem;
    }

    /* Custom Cursor */
    #cursor {
      position: fixed;
      top: 0;
      left: 0;
      width: 20px;
      height: 20px;
      border: 2px solid #fff;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      mix-blend-mode: difference;
      transition: transform 0.15s ease-out, background 0.15s ease-out;
    }

    /* Particle Background */
    #particles {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      z-index: -1;
      pointer-events: none;
    }

    /* 3D Card Effects */
    .project-card {
      perspective: 1000px;
    }
    .project-inner {
      transition: transform 0.5s;
      transform-style: preserve-3d;
    }
    .project-card:hover .project-inner {
      transform: rotateY(15deg) rotateX(10deg) translateZ(10px);
    }

    /* Dark/Light Mode */
    .light-mode {
      background: #f4f4f4;
      color: #111;
    }
    .light-mode .glass {
      background: rgba(255,255,255,0.2);
      border-color: rgba(0,0,0,0.1);
    }
    .light-mode #cursor {
      border-color: #111;
    }
  </style>
</head>

<body>

  <!-- Particle Canvas -->
  <canvas id="particles"></canvas>

  <!-- Custom Cursor -->
  <div id="cursor"></div>

  <div class="max-w-6xl mx-auto px-6 py-16">

    <!-- HERO SECTION -->
    <section class="text-center mb-20 relative z-10">
      <div class="glass inline-block p-6">
        <img 
          src="${portfolio.profile.profileImage}" 
          alt="Profile Image"
          class="w-40 h-40 mx-auto rounded-full object-cover border-4 border-blue-400 shadow-xl hover:scale-105 transition-transform duration-300"
        />
        <h1 class="text-5xl md:text-6xl font-bold mt-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent tracking-wide">
          ${portfolio.profile.name}
        </h1>
        <p class="mt-4 text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
          ${portfolio.profile.description}
        </p>
        <div class="mt-6 space-x-6 text-sm text-gray-400">
          <span>📧 ${portfolio.profile.email}</span>
          <span>📱 ${portfolio.profile.phone}</span>
        </div>
      </div>
    </section>

    <!-- SKILLS -->
    <section class="mb-20 relative z-10">
      <h2 class="text-3xl font-semibold mb-8 border-b border-gray-700 pb-2">Skills</h2>
      <div class="flex flex-wrap gap-4">
        ${portfolio.skills
                .map(
                    (skill) => `<span class="px-4 py-2 bg-gray-800 rounded-full text-amber-50 text-sm hover:bg-blue-600 hover:scale-105 transition duration-300 cursor-pointer">${skill.name}</span>`
                )
                .join("")}
      </div>
    </section>

    <!-- PROJECTS -->
    <section class="mb-20 relative z-10">
      <h2 class="text-3xl font-semibold mb-8 border-b border-gray-700 pb-2">Projects</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        ${portfolio.projects
                .map(
                    (project) => `
          <div class="project-card">
            <div class="project-inner glass shadow-lg p-4">
              <img src="${project.image}" alt="${project.name}" class="w-full h-48 object-cover rounded-xl mb-4"/>
              <h3 class="text-xl font-semibold mb-2">${project.name}</h3>
              <p class="text-gray-400 text-sm mb-4">${project.description}</p>
              <div class="flex gap-4">
                <a href="${project.liveUrl}" target="_blank" class="text-blue-400 hover:text-blue-300 transition">Live</a>
                <a href="${project.githubUrl}" target="_blank" class="text-purple-400 hover:text-purple-300 transition">GitHub</a>
              </div>
            </div>
          </div>`
                )
                .join("")}
      </div>
    </section>

    <!-- SOCIAL LINKS -->
    <section class="relative z-10">
      <h2 class="text-3xl font-semibold mb-8 border-b border-gray-700 pb-2">Connect With Me</h2>
      <div class="flex flex-wrap gap-6 text-lg">
        ${portfolio.socialLinks
                .map(
                    (social) => `<a href="${social.url}" target="_blank" class="hover:text-blue-400 hover:scale-110 transition duration-300">${social.platform}</a>`
                )
                .join("")}
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="text-center mt-24 text-gray-600 text-sm relative z-10">
      © ${new Date().getFullYear()} ${portfolio.profile.name}. Built with ❤️ & GSAP Animations
    </footer>
  </div>

  <!-- Dark/Light Toggle -->
  <button id="themeToggle" class="fixed bottom-6 right-6 p-3 bg-blue-500 rounded-full z-50 shadow-lg">🌓</button>

  <script>
    // Cursor Animation
    const cursor = document.getElementById("cursor");
    document.addEventListener("mousemove", e => {
      cursor.style.transform = \`translate(\${e.clientX - 10}px, \${e.clientY - 10}px)\`;
    });

    // Cursor Hover Scale
    document.querySelectorAll("a, button, span").forEach(el => {
      el.addEventListener("mouseenter", () => cursor.classList.add("scale-150"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("scale-150"));
    });

    // Dark/Light Mode Toggle
    const toggle = document.getElementById("themeToggle");
    toggle.addEventListener("click", () => document.body.classList.toggle("light-mode"));

    // Particle Background
    const canvas = document.getElementById("particles");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particles = [];
    const particleCount = 100;

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 3 + 1,
          dx: (Math.random() - 0.5) * 0.5,
          dy: (Math.random() - 0.5) * 0.5
        });
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;

        if(p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if(p.y < 0 || p.y > canvas.height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fill();
      });
      requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
    window.addEventListener("resize", () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; initParticles(); });

    // GSAP 3D Scroll Animations
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.project-card').forEach(card => {
      gsap.from(card, {
        y: 50, 
        opacity: 0, 
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          end: "bottom 60%",
          toggleActions: "play none none reverse"
        }
      });
    });

    // Hero Image 3D Rotation
    gsap.to('.glass img', {
      rotateY: 15,
      rotateX: 10,
      yoyo: true,
      repeat: -1,
      duration: 4,
      ease: "power1.inOut"
    });
  </script>
</body>
</html>

`;


        return res.send(rawHTML);
    } catch (error) {
        console.log("Error fetching portfolio:", error);
        return res.status(500).send("Internal Server Error");
    }
});

export default router;
