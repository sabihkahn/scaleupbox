import React, { useState, useContext } from "react";
import { DashboardContext } from "../context/DashboardContext";
import { Globe, Image as ImageIcon, Users, FileText, TrendingUp, LayoutGrid, CheckCircle2, ListTodo, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

const sparkData = [{ pv: 400 }, { pv: 300 }, { pv: 600 }, { pv: 800 }, { pv: 500 }, { pv: 900 }, { pv: 1000 }];

const StatCard = ({ title, value, icon: Icon, loading, trend }) => (
    <motion.div
        whileHover={{ y: -5, borderColor: "#18181b" }}
        className="bg-white border border-zinc-100 rounded-3xl p-6 cursor-default group shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]"
    >
        <div className="flex justify-between items-start mb-6">
            <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-300">
                <Icon size={18} strokeWidth={2} />
            </div>
            <div className="text-[10px] font-bold text-zinc-500 bg-zinc-50 px-2 py-1 rounded-lg border border-zinc-100 flex items-center gap-1">
                <TrendingUp size={10} /> {trend}%
            </div>
        </div>
        <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">{title}</p>
            <h3 className="text-3xl font-black text-zinc-900 leading-none mt-2 tracking-tighter">
                {loading ? <div className="h-8 w-20 bg-zinc-100 animate-pulse rounded-lg" /> : value}
            </h3>
        </div>
    </motion.div>
);

const Card = () => {
    const { dashboardData, loading } = useContext(DashboardContext);

    // To-Do Logic
    const [tasks, setTasks] = useState([
        { id: 1, text: "Finish portfolio design", completed: false },
        { id: 2, text: "Compress client images", completed: true },
    ]);
    const [newTask, setNewTask] = useState("");

    const addTask = () => {
        if (!newTask.trim()) return;
        setTasks([{ id: Date.now(), text: newTask, completed: false }, ...tasks]);
        setNewTask("");
    };

    const toggleTask = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const stats = [
        { title: "Portfolios", value: dashboardData?.totalportfoliowebsites || 0, icon: Globe, trend: "12" },
        { title: "BG Removed", value: dashboardData?.totalbgremoveimgs || 0, icon: ImageIcon, trend: "18" },
        { title: "Clients", value: dashboardData?.totalclientinfo || 0, icon: Users, trend: "24" },
        { title: "Storage", value: dashboardData?.totalimgstroage || 0, icon: FileText, trend: "2" }
    ];

    return (
        <div className="p-6 md:p-10 bg-[#FFFFFF] min-h-screen font-sans text-zinc-900">
            {/* Header */}
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-zinc-400 font-bold text-[10px] uppercase tracking-[0.3em]">
                        <LayoutGrid size={12} /> Management Suite
                    </div>
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tighter">
                        Hi, {dashboardData?.username?.split(' ')[0] || 'User'}.
                    </h1>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-2xl">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Server: Optimized</span>
                </div>
            </header>

            <div className="h-[75vh] overflow-y-auto pr-2 no-scrollbar space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <StatCard key={idx} {...stat} loading={loading} />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Performance Chart */}
                    <div className="lg:col-span-2 bg-white border border-zinc-100 rounded-[2.5rem] p-8">
                        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-10 flex items-center gap-2">
                            Activity
                        </h3>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={sparkData}>
                                    <Area type="monotone" dataKey="pv" stroke="#18181b" strokeWidth={3} fill="#fafafa" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Task Manager (To-Do List) */}
                    <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 flex flex-col shadow-sm">
                        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <ListTodo size={18} /> Daily Tasks
                        </h3>

                        {/* Input Area */}
                        <div className="flex gap-2 mb-6">
                            <input
                                type="text"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                placeholder="Add new task..."
                                className="flex-1 bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-2 text-xs outline-none focus:border-zinc-900 transition-all"
                                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                            />
                            <button onClick={addTask} className="p-2 bg-zinc-950 text-white rounded-xl hover:bg-zinc-800 transition-all">
                                <Plus size={18} />
                            </button>
                        </div>

                        {/* List Area */}
                        <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar max-h-60">
                            <AnimatePresence>
                                {tasks.map((task) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        key={task.id}
                                        className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-100 rounded-2xl group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => toggleTask(task.id)} className={`transition-colors ${task.completed ? "text-emerald-500" : "text-zinc-300"}`}>
                                                <CheckCircle2 size={18} />
                                            </button>
                                            <span className={`text-xs font-medium ${task.completed ? "line-through text-zinc-400" : "text-zinc-700"}`}>
                                                {task.text}
                                            </span>
                                        </div>
                                        <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all">
                                            <Trash2 size={14} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className="mt-6 pt-6 border-t border-zinc-50">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                {tasks.filter(t => !t.completed).length} Tasks Remaining
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;