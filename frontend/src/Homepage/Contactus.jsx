import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
motion
import axios from "axios";
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// Asset Import
import scaleupLogo from "../assets/scaleup.webp";

export default function Contactus() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple Email Regex Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${BASE_URL}/contactus`, formData);

      // Store the specific message from your API
      setResponseMsg(data.message || "Your message has been received!");
      setSubmitted(true);
      toast.success("Sent successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans selection:bg-blue-100">
      <Toaster position="top-center" />

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src={scaleupLogo} alt="Logo" className="w-10 h-10 rounded-xl shadow-sm" />
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
              ScaleUpBox
            </span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={18} /> Back Home
          </button>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-12">

          {/* INFO PANEL (2 Columns) */}
          <div className="lg:col-span-2 space-y-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-5xl font-black leading-tight mb-6">
                Let's build <br />
                <span className="text-blue-600 underline decoration-blue-100 underline-offset-8">something</span> great.
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed">
                Whether you're curious about features, pricing, or even just a greeting—we're ready to answer.
              </p>
            </motion.div>

            <div className="space-y-6">
              <ContactMethod
                icon={<Phone className="text-blue-600" />}
                title="Call us"
                value="+92 300 1234567"
                link="tel:+923001234567"
              />
              <ContactMethod
                icon={<Mail className="text-indigo-600" />}
                title="Email us"
                value="sabihkhan.dev@gmail.com"
                link="mailto:hello@scaleupbox.com"
              />
              <div className="p-6 bg-slate-900 rounded-[2rem] text-white overflow-hidden relative group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                <h4 className="text-xl font-bold mb-1 flex items-center gap-2">
                  <MapPin size={20} className="text-blue-400" /> Pakistan 🇵🇰
                </h4>
                <p className="text-slate-400 text-sm">Headquartered in the heart of innovation.</p>
              </div>
            </div>
          </div>

          {/* FORM PANEL (3 Columns) */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onSubmit={handleSubmit}
                  className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                      <input
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Your Message</label>
                    <textarea
                      required
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      placeholder="Tell us what you're thinking..."
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    disabled={loading}
                    className="group w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
                  >
                    {loading ? "Sending..." : "Send Message"}
                    {!loading && <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                  </button>
                </motion.form>
              ) : (
                /* SUCCESS STATE - Displaying data.message */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-12 rounded-[3rem] shadow-2xl border border-blue-50 text-center flex flex-col items-center justify-center min-h-[500px]"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-3xl font-black mb-4">Message Sent!</h2>
                  <p className="text-lg text-slate-600 mb-8 max-w-sm">
                    {responseMsg}
                  </p>
                  <div className="p-4 bg-blue-50 rounded-2xl text-blue-700 font-bold text-sm mb-8">
                    We will reply you soon via your email.
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-slate-500 font-bold hover:text-slate-900 transition-colors"
                  >
                    Send another message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

function ContactMethod({ icon, title, value, link }) {
  return (
    <a
      href={link}
      className="flex items-center gap-5 p-5 bg-white rounded-3xl border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
    >
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <p className="text-lg font-bold text-slate-800">{value}</p>
      </div>
    </a>
  );
}