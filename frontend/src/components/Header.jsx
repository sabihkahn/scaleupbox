import React, { useState, useContext } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
motion
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DashboardContext } from "../context/DashboardContext";
import {
    Home, File, ListCheck, PenSquare,
    QrCode, Settings, Upload, LogOut, LayoutGrid, FileText, Image,
    ArrowDownAzIcon, ImageUpscale, SquareSplitVertical,
    BoomBoxIcon, TextWrapIcon, ArrowDown01, Search, Crop, Briefcase, FileStack
} from "lucide-react";

const Header = () => {
    const { dashboardData, loading, setcurrentpage } = useContext(DashboardContext);
    const [showMenu, setShowMenu] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const logout = async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_BASE_URL}/auth/user/logout`,
                {},
                { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
            );
            localStorage.clear();
            navigate("/auth");
        } catch (err) {
            console.log("Logout error", err);
        }
    };

    const handleNav = (page) => {
        setcurrentpage(page);
        setShowMenu(false);
    };

    const isVisible = (text) => text.toLowerCase().includes(searchTerm.toLowerCase());

    const navItems = [
        { id: "home", label: "Dashboard", icon: <Home size={18} />, cat: "General" },
        { id: "Bgremover", label: "BG Remover", icon: <Crop size={18} />, cat: "Image Studio" },
        { id: "ImageResizer", label: "Image Resizer", icon: <ImageUpscale size={18} />, cat: "Image Studio" },
        { id: "Imagecompressor", label: "Compressor", icon: <Image size={18} />, cat: "Image Studio" },
        { id: "Imageconvertor", label: "Converter", icon: <ArrowDownAzIcon size={18} />, cat: "Image Studio" },
        { id: "Cropimage", label: "Crop Image", icon: <Crop size={18} />, cat: "Image Studio" },
        { id: "BulkImageRename", label: "Bulk Rename", icon: <File size={18} />, cat: "Image Studio" },
        { id: "PDFToimage", label: "PDF to Image", icon: <ArrowDown01 size={18} />, cat: "PDF Toolbox" },
        { id: "Imagetopdf", label: "Image to PDF", icon: <TextWrapIcon size={18} />, cat: "PDF Toolbox" },
        { id: "Pdfmerger", label: "PDF Merger", icon: <File size={18} />, cat: "PDF Toolbox" },
        { id: "PDFSplitter", label: "PDF Splitter", icon: <SquareSplitVertical size={18} />, cat: "PDF Toolbox" },
        { id: "PDFCompressor", label: "PDF Compressor", icon: <BoomBoxIcon size={18} />, cat: "PDF Toolbox" },
        { id: "PortfolioGenrator", label: "Portfolio Gen", icon: <FileText size={18} />, cat: "Business" },
        { id: "ResumeBuilder", label: "Resume Builder", icon: <ListCheck size={18} />, cat: "Business" },
        { id: "Invoicegenrator", label: "Invoice Gen", icon: <FileText size={18} />, cat: "Business" },
        { id: "Qrcodegenrator", label: "QR Code", icon: <QrCode size={18} />, cat: "Business" },
        { id: "SaveClientData", label: "Client Data", icon: <PenSquare size={18} />, cat: "Business" },
        { id: "ImageStroge", label: "Storage", icon: <Upload size={18} />, cat: "Business" },
    ];

    const menuCategoryClass = "text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2 mt-6 flex items-center gap-2 px-4";

    return (
        <>
            <AnimatePresence>
                {showMenu && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowMenu(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 z-50 w-[300px] h-screen bg-zinc-950 text-zinc-100 shadow-2xl lg:hidden flex flex-col"
                        >
                            {/* Mobile Sidebar Header */}
                            <div className="p-6 border-b border-zinc-900 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="bg-blue-600 w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-sm">S</div>
                                    <h3 className="text-base font-black uppercase tracking-tighter">ScaleUp<span className="text-blue-500">Box</span></h3>
                                </div>
                                <button onClick={() => setShowMenu(false)} className="p-2 bg-zinc-900 rounded-full"><XMarkIcon className="h-5 w-5 text-zinc-400" /></button>
                            </div>

                            {/* Mobile Search */}
                            <div className="px-4 pt-4">
                                <div className="relative group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                                    <input
                                        type="text" placeholder="Search tools..." value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-800 text-xs py-2 pl-9 pr-4 rounded-xl focus:outline-none focus:border-blue-500/50"
                                    />
                                </div>
                            </div>

                            {/* Mobile Nav Links */}
                            <div className="flex-1 overflow-y-auto px-2 pb-6 no-scrollbar">
                                {isVisible("General") && <div className={menuCategoryClass}><LayoutGrid size={12} /> General</div>}
                                {navItems.filter(i => i.cat === "General" && isVisible(i.label)).map(item => (
                                    <button key={item.id} onClick={() => handleNav(item.id)} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-all">
                                        {item.icon} {item.label}
                                    </button>
                                ))}

                                <div className={menuCategoryClass}><Image size={12} /> Image Studio</div>
                                {navItems.filter(i => i.cat === "Image Studio" && isVisible(i.label)).map(item => (
                                    <button key={item.id} onClick={() => handleNav(item.id)} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-all">
                                        {item.icon} {item.label}
                                    </button>
                                ))}

                                <div className={menuCategoryClass}><FileStack size={12} /> PDF Toolbox</div>
                                {navItems.filter(i => i.cat === "PDF Toolbox" && isVisible(i.label)).map(item => (
                                    <button key={item.id} onClick={() => handleNav(item.id)} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-all">
                                        {item.icon} {item.label}
                                    </button>
                                ))}

                                <div className={menuCategoryClass}><Briefcase size={12} /> Business</div>
                                {navItems.filter(i => i.cat === "Business" && isVisible(i.label)).map(item => (
                                    <button key={item.id} onClick={() => handleNav(item.id)} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-all">
                                        {item.icon} {item.label}
                                    </button>
                                ))}
                            </div>

                            <div className="p-4 border-t border-zinc-900">
                                <button onClick={logout} className="w-full flex items-center justify-center gap-2 bg-zinc-100 text-black py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors">
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* HEADER BAR */}
            <div className="sticky top-0 z-30 flex items-center justify-between w-full px-6 py-3  bg-white backdrop-blur-xl border-b border-zinc-900">
                <div className="flex items-center gap-4">
                    <button onClick={() => setShowMenu(!showMenu)} className="lg:hidden p-2 bg-gray-900  hover:bg-zinc-900 rounded-xl transition-colors">
                        <Bars3Icon className="h-6 w-6 text-zinc-100" />
                    </button>

                    <div className="hidden lg:flex items-center gap-2 text-zinc-100">
                        <LayoutGrid size={18} className="text-blue-500" />
                        <span className="font-black tracking-tighter text-lg uppercase"></span>
                    </div>

                    <div className="h-4 w-[1px] bg-black hidden lg:block mx-2"></div>

                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Workspace /</span>
                        <h2 className="text-xs font-bold text-zinc-700 uppercase tracking-tight">
                            {loading ? "..." : dashboardData?.username}
                        </h2>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <button onClick={logout} className="hidden md:flex items-center gap-2 px-4 py-2 bg-zinc-900 text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-zinc-800">
                        Logout <LogOut size={12} />
                    </button>

                    <div className="relative group cursor-pointer" onClick={() => handleNav("Settings")}>
                        <div className="w-9 h-9 rounded-xl overflow-hidden border border-zinc-800 transition-all hover:border-blue-500/50">
                            <img
                                src={dashboardData?.picture || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4YreOWfDX3kK-QLAbAL4ufCPc84ol2MA8Xg&s"}
                                alt="Profile" className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-zinc-950 rounded-full"></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;