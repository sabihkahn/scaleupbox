import React, { useState, useContext } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DashboardContext } from "../context/DashboardContext";
import { Box, Home, PersonStanding, QrCode, Settings, Upload } from "lucide-react";
motion
const Header = () => {
    const { dashboardData, loading, setcurrentpage } =
        useContext(DashboardContext);

    const [showMenu, setShowMenu] = useState(false);
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

    return (
        <>
            {/* MOBILE SLIDE MENU */}
            <AnimatePresence>
                {showMenu && (
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", stiffness: 260, damping: 25 }}
                        className="fixed top-0 left-0 z-40 w-[70vw] h-screen bg-gray-900 text-white p-6 lg:hidden"
                    >
                        <h3 className="text-xl font-mono mb-6">Scale up box</h3>

                        <div className="flex flex-col gap-4">
                            <button onClick={() => handleNav("home")} className="text-left flex flex-row items-center gap-2">
                             <Home className="h-4" /> Home
                            </button>
                            <button onClick={() => handleNav("Bgremover")} className="text-left">
                             <Box className="h-4" /> BG Remover
                            </button>
                            <button
                                onClick={() => handleNav("ImageStroge")}
                                className="text-left"
                            >
                              <Upload className="h-4" />   Image Storage
                            </button>

                            <button onClick={() => handleNav("Invoicegenrator")} className="text-left">
                                <PersonStanding />   Invoice Genrator
                            </button>
                            <button onClick={() => handleNav("Qrcodegenrator")} className="text-left">
                                <QrCode />   QRcode Genrator
                            </button>
                         
                            <button onClick={() => navigate("/settings")} className="text-left">
                             <Settings />   Settings
                            </button>

                            <button
                                onClick={logout}
                                className="mt-6 bg-indigo-500 py-2 rounded-lg"
                            >
                                Logout
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* HEADER BAR */}
            <div className="flex items-center justify-between w-full px-4 py-3 bg-white border-b border-gray-200">
                {/* LEFT */}
                <div className="flex items-center gap-3">
                    {/* Mobile menu button */}
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="lg:hidden"
                    >
                        {showMenu ? (
                            <XMarkIcon className="h-6 w-6 text-gray-700" />
                        ) : (
                            <Bars3Icon className="h-6 w-6 text-gray-700" />
                        )}
                    </button>

                    <h2 className="text-lg font-semibold text-gray-800">
                        Welcome,{" "}
                        <span className="text-indigo-600">
                            {loading ? "Loading..." : dashboardData?.username}
                        </span>
                    </h2>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">
                    {/* Logout only on desktop */}
                    <button
                        onClick={logout}
                        className="hidden md:block px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                    >
                        Logout
                    </button>

                    {/* Profile */}
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-500">
                        <img
                            src={
                                dashboardData?.picture ||
                                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4YreOWfDX3kK-QLAbAL4ufCPc84ol2MA8Xg&s"
                            }
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
