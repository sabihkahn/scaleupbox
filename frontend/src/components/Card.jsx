import React, { useContext } from "react";
import { DashboardContext } from "../context/DashboardContext";
import { ArrowUpRight, Globe, Zap, Image as ImageIcon, Users, FileText, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
motion
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const sparkData = [{ pv: 400 }, { pv: 300 }, { pv: 600 }, { pv: 800 }, { pv: 500 }, { pv: 900 }, { pv: 1000 }];

const StatCard = ({ title, value, icon: Icon, color, loading, trend }) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
                <Icon className={`h-5 w-5 ${color.replace('bg-', 'text-')}`} />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                <TrendingUp size={10} /> {trend}%
            </div>
        </div>

        <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{title}</p>
            <h3 className="text-2xl font-black text-zinc-900 leading-none mt-1">
                {loading ? <div className="h-7 w-16 bg-zinc-100 animate-pulse rounded" /> : value}
            </h3>
        </div>

        <div className="h-10 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData}>
                    <Area type="monotone" dataKey="pv" stroke="#6366f1" strokeWidth={2} fill="transparent" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </motion.div>
);

const Card = () => {
    const { dashboardData, loading } = useContext(DashboardContext);

    const stats = [
        { title: "Portfolios", value: dashboardData?.totalportfoliowebsites || 0, icon: Globe, color: "bg-blue-600", trend: "12" },
      
        { title: "BG Removed", value: dashboardData?.totalbgremoveimgs || 0, icon: ImageIcon, color: "bg-purple-600", trend: "18" },
        { title: "Clients", value: dashboardData?.totalclientinfo || 0, icon: Users, color: "bg-emerald-600", trend: "24" },
        { title: "Storage", value: dashboardData?.totalimgstroage || 0, icon: FileText, color: "bg-rose-600", trend: "2" }
    ];

    return (
        <div className="p-4 md:p-8 bg-[#FAFAFA] min-h-screen font-sans overflow-hidden">
            {/* Header */}
            <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-zinc-900">Welcome, {dashboardData?.username?.split(' ')[0] || 'User'}</h1>
                    <p className="text-xs text-zinc-500 font-medium">Platform performance overview</p>
                </div>
                {/* <button className="flex items-center gap-2 bg-zinc-950 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all">
                    Report <ArrowUpRight size={14} />
                </button> */}
            </header>

            {/* SCROLLABLE AREA: h-75vh */}
            <div className="h-[75vh] overflow-y-auto pr-2 custom-scrollbar space-y-8">

                {/* Responsive Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {stats.map((stat, idx) => (
                        <StatCard key={idx} {...stat} loading={loading} />
                    ))}
                </div>

                {/* Charts & Actions Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Activity Box */}
                    <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-zinc-900 mb-4">Activity Growth</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={sparkData}>
                                    <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '12px' }} />
                                    <Area type="monotone" dataKey="pv" stroke="#18181b" strokeWidth={3} fill="#f4f4f5" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Promo Box */}
                    {/* <div className="bg-zinc-900 rounded-3xl p-8 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="relative z-10">
                            <Zap className="text-blue-500 mb-4" size={32} fill="currentColor" />
                            <h2 className="text-2xl font-black">Go Pro</h2>
                            <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                                Unlock unlimited Background Removal and Portfolio hosting today.
                            </p>
                        </div>
                        <button className="relative z-10 mt-6 w-full bg-white text-zinc-950 py-3 rounded-xl font-bold text-xs hover:bg-zinc-100 transition-all">
                            Upgrade Now
                        </button>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default Card;