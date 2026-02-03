import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import {
    HomeIcon,
    CubeIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import Dashboard from '../pages/Dashboard';
motion


import { useContext } from 'react';
import { DashboardContext } from '../context/DashboardContext';
import { Crop, File, ListCheck, PenSquareIcon, PersonStanding, QrCode, Upload } from 'lucide-react';

const Sidebar = () => {
    const { setcurrentpage } = useContext(DashboardContext);
    const [currentpage1, setcurrentpage1] = useState('')
    // const navigate = useNavigate()
    console.log(currentpage1);
    


  const handelclik = (data) => {
    setcurrentpage(data);
    setcurrentpage1(currentpage1)
 
  }

  return (
    <>
          <div className=' hidden lg:flex flex-col  p-10 h-screen border-2 w-[22%] bg-gray-900 text-amber-50' >
              <h3 className='text-2xl font-mono'>Scale up box</h3>
              {/* flex col  */}

              <div className='flex gap-3 mt-5 flex-col'>

                  <div
                      className="flex items-center cursor-pointer gap-3 p-2 rounded hover:bg-gray-800"
                      onClick={() => handelclik("home")}
                  >
                      <HomeIcon className="h-6" />
                      <span>Home</span>
                  </div>

                  <div
                      className="flex items-center cursor-pointer gap-3 p-2 rounded hover:bg-gray-800"
                       onClick={() => handelclik("Bgremover")}
                  >
                      <CubeIcon className="h-6" />
                      <span>BG remover</span>
                  </div>

                  <div
                      className="flex items-center cursor-pointer gap-3 p-2 rounded hover:bg-gray-800"
                      onClick={() => handelclik("ImageStroge")}
                  >
                      <Upload className='h-6' />
                      <span> Image Storage  </span>
                  </div>

                  <div
                      className="flex items-center cursor-pointer gap-3 p-2 rounded hover:bg-gray-800"
                      onClick={() => handelclik("Invoicegenrator")}
                  >
                      <PersonStanding className='h-6' />
                      <span> Invoice genrator  </span>
                  </div>
                  <div
                      className="flex items-center cursor-pointer gap-3 p-2 rounded hover:bg-gray-800"
                      onClick={() => handelclik("Qrcodegenrator")}
                  >
                      <QrCode className='h-6' />
                      <span> Qrcodegenrator  </span>
                  </div>
                  <div
                      className="flex items-center cursor-pointer gap-3 p-2 rounded hover:bg-gray-800"
                      onClick={() => handelclik("Pdfmerger")}
                  >
                      <File className='h-6' />
                      <span> Pdf merger  </span>
                  </div>
                  <div
                      className="flex items-center cursor-pointer gap-3 p-2 rounded hover:bg-gray-800"
                      onClick={() => handelclik("ResumeBuilder")}
                  >
                      <ListCheck className='h-6' />
                      <span> Resume Builder  </span>
                  </div>
                  <div
                      className="flex items-center cursor-pointer gap-3 p-2 rounded hover:bg-gray-800"
                      onClick={() => handelclik("SaveClientData")}
                  >
                      <PenSquareIcon className='h-6' />
                      <span> SaveClientData </span>
                  </div>
                  <div
                      className="flex items-center cursor-pointer gap-3 p-2 rounded hover:bg-gray-800"
                      onClick={() => handelclik("Cropimage")}
                  >
                      <Crop className='h-6' />
                      <span> Cropimage </span>
                  </div>

                  {/* ExpenseTracker */}
                  <div
                      className="flex items-center cursor-pointer gap-3 p-2 rounded hover:bg-gray-800"
                      onClick={() => handelclik("ExpenseTracker")}
                  >
                      <ChartBarIcon className="h-6" />
                      <span>Expense Tracker</span>
                  </div>



              </div>

          </div>
    </>
  )
}

export default Sidebar