import React, { useState } from 'react'
import { Bars3Icon } from "@heroicons/react/24/outline";
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import {
    HomeIcon,
    CubeIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
motion
const Header = () => {

    const [show, setshow] = useState(false)
    const navigate = useNavigate('')
    return (
        <>
            <AnimatePresence>
                {show ?
                    <>
                        <motion.div
                            initial={{ x: "-100%" }}   // start off-screen to the left
                            animate={{ x: 0 }}         // slide in
                            exit={{ x: "-100%" }}      // slide out when unmounted
                            transition={{ type: "spring", stiffness: 260, damping: 25 }}
                            className=' flex flex-col p-4 items-center absolute left-0 w-[55vw] z-10 h-screen text-amber-50 bg-blue-950'>
                            <h3 className='text-2xl font-mono'>Scale up box</h3>
                            <div className='flex gap-3 mt-5 flex-col'>

                                <div
                                    className="flex items-center cursor-pointer gap-3 p-2 rounded hover:bg-gray-800"
                                    onClick={() => navigate("/dashboard")}
                                >
                                    <HomeIcon className="h-6" />
                                    <span>Home</span>
                                </div>

                                <div
                                    className="flex items-start cursor-pointer gap-3 p-2 rounded hover:bg-gray-800"
                                    onClick={() => navigate("/aibuilder")}
                                >
                                    <CubeIcon className="h-6" />
                                    <span>AI Builder</span>
                                </div>

                                <div
                                    className="flex items-center cursor-pointer gap-3 p-2 rounded hover:bg-gray-800"
                                    onClick={() => navigate("/mywebsites")}
                                >
                                    <ChartBarIcon className="h-6" />
                                    <span>My Websites</span>
                                </div>

                                <div
                                    className="flex items-center cursor-pointer gap-3 p-2 rounded hover:bg-gray-800"
                                    onClick={() => navigate("/settings")}
                                >
                                    <Cog6ToothIcon className="h-6" />
                                    <span>Settings</span>
                                </div>



                            </div>


                        </motion.div>

                    </> :

                    ''}
            </AnimatePresence>
            <div className="flex justify-between relative items-center w-full p-4 bg-white shadow-md rounded-md">
                {/* Left side: Welcome message */}
                {/* here will be side bar */}


                <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                        Welcome, <span className="text-indigo-500">User</span>
                    </h2>
                </div>

                {/* Right side: Button + Profile */}
                <div className="flex items-center gap-4">
                    {show ? <XMarkIcon className=' text- h-6 lg:hidden ' onClick={() => { setshow(false) }} /> : <Bars3Icon className=' text- h-6 lg:hidden ' onClick={() => { setshow(true) }} />}
                    <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition">
                        Create Now
                    </button>
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-500">
                        <img
                            src="https://i.pravatar.cc/100"
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>

        </>
    )
}

export default Header