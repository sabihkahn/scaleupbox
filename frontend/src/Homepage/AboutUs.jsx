import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
motion
// Icons or Images from your assets
import scaleupLogo from "../assets/scaleup.webp";
import dashboardImg from "../assets/dashboard.png";

export default function AboutUs() {
  const navigate = useNavigate();

  const stats = [
    { label: "Tools Built", value: "25+" },
    { label: "Origin", value: "Pakistan" },
    { label: "Status", value: "Always Free" },
    { label: "Focus", value: "User Privacy" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* HEADER - Consistent with Homepage */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={scaleupLogo} alt="ScaleUpBox Logo" className="w-10 h-10 rounded-md shadow-sm" />
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              ScaleUpBox
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 font-medium text-slate-600">
            <button onClick={() => navigate("/")} className="hover:text-blue-600 transition-colors">Home</button>
            <button onClick={() => navigate("/contactus")} className="hover:text-blue-600 transition-colors">Contact</button>
          </nav>
          <button
            onClick={() => navigate("/auth")}
            className="bg-blue-600 text-white px-5 py-2.5 not-lg:px-3  rounded-full font-medium shadow-lg hover:bg-blue-700 transition-all active:scale-95"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full">
              Our Story
            </span>
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8">
              Empowering global growth from <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-green-600">
                Pakistan.
              </span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              ScaleUpBox was born out of a simple idea: that professional tools shouldn't be scattered across the web. We built a unified ecosystem that handles everything from image processing and PDF management to business invoicing and portfolio generation.
            </p>
            <div className="flex flex-wrap gap-8">
              {stats.map((stat, i) => (
                <div key={i}>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500 uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
            <img
              src={dashboardImg}
              alt="Our Platform"
              className="relative rounded-2xl shadow-2xl border border-white"
            />
          </motion.div>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="bg-white py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-12">Built for the Modern Workflow</h2>
          <div className="grid md:grid-cols-3 gap-12 text-left">
            <MissionCard
              title="All-in-One Utility"
              description="Whether you are renaming bulk images, merging PDFs, or generating QR codes, we have a specialized studio for every task."
            />
            <MissionCard
              title="Professional Suites"
              description="From Resume Building to Expense Tracking, we help freelancers and agencies stay organized and look professional."
            />
            <MissionCard
              title="Global Innovation"
              description="Developed with passion in Pakistan, we aim to provide high-performance web utilities for professionals worldwide."
            />
          </div>
        </div>
      </section>

      {/* TECH & CULTURE */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full" />
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Privacy-First & Fast.</h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Your data security is our priority. Most of our tools are designed to handle processing efficiently while ensuring your business information—from invoices to client data—remains secure and accessible only to you.
              </p>
              <button
                onClick={() => navigate("/auth")}
                className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-slate-200 transition-all"
              >
                Join the ScaleUp community
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Placeholder for local imagery or icons */}
              <div className="h-40 bg-slate-800 rounded-2xl border border-slate-700 flex flex-col items-center justify-center p-4">
                <span className="text-blue-400 font-bold mb-2">Image Studio</span>
                <p className="text-xs text-center text-slate-500">Compress, Convert, Crop & BG Removal</p>
              </div>
              <div className="h-40 bg-slate-800 rounded-2xl border border-slate-700 flex flex-col items-center justify-center p-4">
                <span className="text-purple-400 font-bold mb-2">PDF Toolbox</span>
                <p className="text-xs text-center text-slate-500">Merge, Split, Compress & Convert</p>
              </div>
              <div className="h-40 bg-slate-800 rounded-2xl border border-slate-700 flex flex-col items-center justify-center p-4">
                <span className="text-emerald-400 font-bold mb-2">Business</span>
                <p className="text-xs text-center text-slate-500">Invoices, Resumes & Portfolios</p>
              </div>
              <div className="h-40 bg-slate-800 rounded-2xl border border-slate-700 flex flex-col items-center justify-center p-4">
                <span className="text-pink-400 font-bold mb-2">Security</span>
                <p className="text-xs text-center text-slate-500">Safe Storage & QR Management</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER - SIMPLE VERSION */}
      <footer className="py-12 border-t border-slate-200 text-center">
        <p className="text-slate-500">© {new Date().getFullYear()} ScaleUpBox • Crafted in Pakistan 🇵🇰</p>
      </footer>
    </div>
  );
}

function MissionCard({ title, description }) {
  return (
    <div className="group">
      <div className="w-12 h-12 bg-blue-600 rounded-xl mb-6 flex items-center justify-center text-white shadow-lg shadow-blue-200 transition-transform group-hover:rotate-12">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}