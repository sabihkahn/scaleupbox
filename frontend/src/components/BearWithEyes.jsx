import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Box, Zap, ShieldCheck, Cpu } from "lucide-react";

const PremiumHero = () => {
    return (
        <div className="relative group overflow-hidden rounded-[2.5rem] bg-zinc-950 p-12 shadow-2xl shadow-zinc-200 border border-zinc-900">

            {/* Animated Background Mesh - SaaS Feel */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse delay-700" />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">

                {/* Text Content */}
                <div className="max-w-xl space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md"
                    >
                        <Sparkles size={12} className="text-blue-400" />
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em]">Core Engine v2.0</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-[0.9]"
                    >
                        SCALE UP <span className="text-blue-500">BOX.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-400 text-sm font-medium leading-relaxed max-w-sm"
                    >
                        The ultimate neural workspace for image processing, PDF management, and business scaling.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex gap-4 pt-4"
                    >
                        <button className="bg-white text-black px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center gap-2">
                            Launch Studio <ArrowRight size={14} />
                        </button>
                    </motion.div>
                </div>

                {/* Abstract Visual Elements */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="relative grid grid-cols-2 gap-4 w-full max-w-[320px]"
                >
                    {/* Feature Tiles */}
                    <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl flex flex-col items-center gap-3 group-hover:border-blue-500/50 transition-all">
                        <Cpu className="text-blue-400" size={24} />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">Neural</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl flex flex-col items-center gap-3 translate-y-6">
                        <ShieldCheck className="text-emerald-400" size={24} />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">Secure</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl flex flex-col items-center gap-3">
                        <Zap className="text-amber-400" size={24} />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">Fast</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl flex flex-col items-center gap-3 translate-y-6">
                        <Box className="text-purple-400" size={24} />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">Scalable</span>
                    </div>
                </motion.div>

            </div>

            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30" />
        </div>
    );
};

export default PremiumHero;