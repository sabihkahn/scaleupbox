import React, { useState, useContext } from 'react';
import {
    HomeIcon,
    CubeIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardContext } from '../context/DashboardContext';
motion
import { Code2, Crop, File, ListCheck, PenSquareIcon, PersonStanding, QrCode, Upload } from 'lucide-react';

const Sidebar = () => {
    const { setcurrentpage } = useContext(DashboardContext);
    const [currentpage1, setcurrentpage1] = useState('')
console.log(currentpage1);

    const handelclik = (data) => {
        setcurrentpage(data);
        setcurrentpage1(data); // Updated to pass data correctly for logic
    }

    // Modern utility class for navigation items
    const navItemClass = "flex items-center cursor-pointer gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group hover:bg-zinc-800 hover:shadow-lg hover:shadow-black/20 text-zinc-400 hover:text-white";

    return (
        <>
            <div className='hidden lg:flex flex-col h-screen border-r border-zinc-800 w-[22%] bg-zinc-950 text-zinc-100 shadow-2xl overflow-y-auto no-scrollbar'>

                {/* Header Section */}
                <div className='p-8 pb-10'>
                    <h3 className='text-xl font-bold tracking-tighter uppercase flex items-center gap-2'>
                        <span className='bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm'>S</span>
                        Scale Up <span className='text-blue-500'>Box</span>
                    </h3>
                </div>

                {/* Navigation Links */}
                <div className='flex flex-col gap-1 px-4'>
                    <p className='text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 px-4'>Main Menu</p>

                    <div className={navItemClass} onClick={() => handelclik("home")}>
                        <HomeIcon className="h-5 w-5 group-hover:text-blue-400" />
                        <span className='text-sm font-medium'>Home</span>
                    </div>

                    <div className={navItemClass} onClick={() => handelclik("PortfolioGenrator")}>
                        <Code2 className="h-5 w-5 group-hover:text-blue-400" />
                        <span className='text-sm font-medium'>Portfolio Generator</span>
                    </div>

                    <div className={navItemClass} onClick={() => handelclik("Bgremover")}>
                        <CubeIcon className="h-5 w-5 group-hover:text-blue-400" />
                        <span className='text-sm font-medium'>BG Remover</span>
                    </div>

                    <div className={navItemClass} onClick={() => handelclik("ImageStroge")}>
                        <Upload className='h-5 w-5 group-hover:text-blue-400' />
                        <span className='text-sm font-medium'>Image Storage</span>
                    </div>

                    <div className={navItemClass} onClick={() => handelclik("Invoicegenrator")}>
                        <PersonStanding className='h-5 w-5 group-hover:text-blue-400' />
                        <span className='text-sm font-medium'>Invoice Generator</span>
                    </div>

                    <div className={navItemClass} onClick={() => handelclik("Qrcodegenrator")}>
                        <QrCode className='h-5 w-5 group-hover:text-blue-400' />
                        <span className='text-sm font-medium'>QR Generator</span>
                    </div>

                    <div className={navItemClass} onClick={() => handelclik("Pdfmerger")}>
                        <File className='h-5 w-5 group-hover:text-blue-400' />
                        <span className='text-sm font-medium'>PDF Merger</span>
                    </div>

                    <div className={navItemClass} onClick={() => handelclik("ResumeBuilder")}>
                        <ListCheck className='h-5 w-5 group-hover:text-blue-400' />
                        <span className='text-sm font-medium'>Resume Builder</span>
                    </div>

                    <div className={navItemClass} onClick={() => handelclik("SaveClientData")}>
                        <PenSquareIcon className='h-5 w-5 group-hover:text-blue-400' />
                        <span className='text-sm font-medium'>Client Data</span>
                    </div>

                    <div className={navItemClass} onClick={() => handelclik("Cropimage")}>
                        <Crop className='h-5 w-5 group-hover:text-blue-400' />
                        <span className='text-sm font-medium'>Crop Image</span>
                    </div>

                    <div className={navItemClass} onClick={() => handelclik("ExpenseTracker")}>
                        <ChartBarIcon className="h-5 w-5 group-hover:text-blue-400" />
                        <span className='text-sm font-medium'>Expense Tracker</span>
                    </div>
                </div>

                {/* Footer/Settings Area */}
                <div className='mt-auto p-6 border-t border-zinc-900'>
                    <div className='flex items-center gap-3 px-4 py-3 cursor-pointer text-zinc-500 hover:text-white transition-colors'>
                        <Cog6ToothIcon className='h-5 w-5' />
                        <span className='text-sm font-medium'>Settings</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar;