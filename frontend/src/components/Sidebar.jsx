import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    HomeIcon,
    CubeIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
motion

const Sidebar = () => {

    const navigate = useNavigate()
  return (
    <>
          <div className=' hidden lg:flex flex-col  p-10 h-screen border-2 w-[22%] bg-gray-900 text-amber-50' >
              <h3 className='text-2xl font-mono'>Scale up box</h3>
              {/* flex col  */}

              <div className='flex gap-3 mt-5 flex-col'>

                  <div
                      className="flex items-center cursor-pointer gap-3 p-2 rounded hover:bg-gray-800"
                      onClick={() => navigate("/dashboard")}
                  >
                      <HomeIcon className="h-6" />
                      <span>Home</span>
                  </div>

                  <div
                      className="flex items-center cursor-pointer gap-3 p-2 rounded hover:bg-gray-800"
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

          </div>
    </>
  )
}

export default Sidebar