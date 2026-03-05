import React, { useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
motion
// Importing local assets from your folder structure
import scaleupLogo from "../assets/scaleup.webp";
import bgRemoveImg from "../assets/bgremove.png";
import dashboardImg from "../assets/dashboard.png";
import invoiceImg from "../assets/invoice.png";
import portfolioImg from "../assets/portfoliobuilder.png";
import clientDataImg from "../assets/clientdatasave.png";
import ResumeBuilder from "../assets/ResumeBuilder.png";
import Expense from "../assets/Expense.png";

export default function HomePage() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  // Handle navigation and auto-close mobile menu
  const handleNav = (path) => {
    setIsMobileMenuOpen(false);
    if (path.startsWith("#")) {
      document.querySelector(path)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-hidden">
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">

          {/* Logo */}
          <div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer z-50"
            onClick={() => handleNav("/")}
          >
            <img src={scaleupLogo} alt="ScaleUpBox Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-md shadow-sm" />
            <span className="text-xl sm:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight">
              ScaleUpBox
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-slate-600">
            <button onClick={() => handleNav("/aboutus")} className="hover:text-blue-600 transition-colors">About</button>
            <button onClick={() => handleNav("/contactus")} className="hover:text-blue-600 transition-colors">Contact Us</button>
            <button onClick={() => handleNav("#features")} className="hover:text-blue-600 transition-colors">Features</button>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => handleNav("/auth")}
              className="text-slate-600 font-medium hover:text-blue-600 transition-colors"
            >
              Log in
            </button>
            <button
              onClick={() => handleNav("/auth")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium shadow-lg shadow-blue-600/30 transition-all active:scale-95"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            className="md:hidden p-2 text-slate-600 z-50 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-100 shadow-xl overflow-hidden absolute w-full"
            >
              <div className="flex flex-col px-6 py-8 gap-6 text-center">
                <button onClick={() => handleNav("/aboutus")} className="text-lg font-medium text-slate-700 hover:text-blue-600">About</button>
                <button onClick={() => handleNav("/contactus")} className="text-lg font-medium text-slate-700 hover:text-blue-600">Contact Us</button>
                <button onClick={() => handleNav("#features")} className="text-lg font-medium text-slate-700 hover:text-blue-600">Features</button>
                <hr className="border-slate-100 w-1/2 mx-auto" />
                <button onClick={() => handleNav("/auth")} className="text-lg font-medium text-slate-700 hover:text-blue-600">Log in</button>
                <button onClick={() => handleNav("/auth")} className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium shadow-md mx-auto w-full max-w-xs">
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <motion.section
        className="pt-32 sm:pt-40 pb-16 sm:pb-20 px-4 sm:px-6 max-w-7xl mx-auto text-center"
        style={{ opacity: heroOpacity, y: heroY }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-tight sm:leading-tight">
            Your Ultimate <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500">
              Business Toolkit.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed px-2">
            From Image Studio and PDF Toolbox to automated Invoice Generation and Portfolio Building. ScaleUpBox is the all-in-one platform for modern professionals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 px-4 sm:px-0">
            <button
              onClick={() => handleNav("/auth")}
              className="bg-slate-900 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl active:scale-95 w-full sm:w-auto"
            >
              Start for free
            </button>
            <button
              onClick={() => handleNav("/aboutus")}
              className="bg-white text-slate-900 border-2 border-slate-200 px-8 py-4 rounded-full text-lg font-semibold hover:border-slate-300 transition-all active:scale-95 w-full sm:w-auto"
            >
              Learn more
            </button>
          </div>
        </motion.div>

        {/* HERO DASHBOARD PREVIEW */}
        <motion.div
          className="mt-16 sm:mt-20 relative mx-auto max-w-5xl rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-slate-200"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.3 }}
        >
          <img src={dashboardImg} alt="Dashboard Preview" className="w-full h-auto object-cover" />
        </motion.div>
      </motion.section>

      {/* SCROLLING LOGOS / TECH STRIP */}
      <div className="bg-slate-50 py-8 sm:py-10 border-y border-slate-100 flex overflow-hidden">
        <div className="whitespace-nowrap animate-marquee flex gap-8 sm:gap-16 items-center px-4 sm:px-10 text-slate-400 font-bold text-lg sm:text-2xl tracking-widest uppercase">
          <span>Image Studio</span> • <span>PDF Toolbox</span> • <span>Resume Builder</span> • <span>Invoice Gen</span> • <span>QR Generator</span> • <span>Client Storage</span>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">Everything you need to scale.</h2>
          <p className="text-lg sm:text-xl text-slate-500 px-4">Powerful tools neatly organized into intuitive studios.</p>
        </div>

        {/* Changed to a responsive grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

          <FeatureCard
            title="Image Studio"
            desc="Remove backgrounds, resize, crop, compress, and convert images instantly."
            imgSrc={bgRemoveImg}
            gradient="from-emerald-400 to-teal-500"
            delay={0.1}
          />

          <FeatureCard
            title="Business Suite"
            desc="Generate professional invoices, build portfolios, and manage client data securely."
            imgSrc={invoiceImg}
            gradient="from-blue-500 to-indigo-600"
            delay={0.2}
          />

          <FeatureCard
            title="Portfolio Generator"
            desc="Stand out with beautiful, automated portfolio websites ready in minutes."
            imgSrc={portfolioImg}
            gradient="from-purple-500 to-pink-500"
            delay={0.3}
          />

          <FeatureCard
            title="Client CRM & Data"
            desc="Keep your client roster organized. Secure cloud storage tailored for freelancers."
            imgSrc={clientDataImg}
            gradient="from-orange-400 to-rose-500"
            delay={0.4}
          />

          <FeatureCard
            title="Expense Tracker"
            desc="Track and manage your expenses with our intuitive expense tracker."
            imgSrc={Expense}
            gradient="from-cyan-400 to-blue-500"
            delay={0.5}
          />

          <FeatureCard
            title="Resume Builder"
            desc="Generate professional resumes easily with our intuitive builder."
            imgSrc={ResumeBuilder}
            gradient="from-rose-400 to-orange-500"
            delay={0.6}
          />

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={scaleupLogo} alt="ScaleUpBox Logo" className="w-8 h-8 rounded" />
              <span className="text-xl font-bold text-white">ScaleUpBox</span>
            </div>
            <p className="text-sm text-slate-500 pr-4">The all-in-one toolkit to streamline your workflow and scale your business.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => handleNav("/dashboard")} className="hover:text-white transition-colors">Dashboard</button></li>
              <li><button onClick={() => handleNav("/auth")} className="hover:text-white transition-colors">Image Studio</button></li>
              <li><button onClick={() => handleNav("/auth")} className="hover:text-white transition-colors">PDF Toolbox</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => handleNav("/aboutus")} className="hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => handleNav("/contactus")} className="hover:text-white transition-colors">Contact</button></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Ready to start?</h4>
            <button
              onClick={() => handleNav("/auth")}
              className="bg-white text-slate-900 px-6 py-2 rounded-full font-medium hover:bg-slate-200 transition-colors w-full sm:w-auto"
            >
              Sign Up Now
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-sm text-slate-500 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} ScaleUpBox. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Reusable animated feature card component
function FeatureCard({ title, desc, imgSrc, gradient, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: delay }}
      className="bg-slate-50 rounded-[2rem] p-6 sm:p-8 border border-slate-100 hover:shadow-2xl transition-all duration-300 overflow-hidden relative group flex flex-col h-full"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full transition-transform duration-500 group-hover:scale-150`} />

      <div className="flex-grow relative z-10">
        <h3 className="text-xl sm:text-2xl font-bold mb-2 text-slate-900">{title}</h3>
        <p className="text-sm sm:text-base text-slate-500 mb-6">{desc}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-2 transform group-hover:-translate-y-2 transition-transform duration-300 mt-auto relative z-10">
        {imgSrc ? (
          <img src={imgSrc} alt={title} className="w-full h-40 sm:h-48 rounded-lg object-cover bg-slate-50" />
        ) : (
          <div className="w-full h-40 sm:h-48 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-sm">Image Asset Missing</div>
        )}
      </div>
    </motion.div>
  );
}