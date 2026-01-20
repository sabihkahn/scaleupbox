import React from 'react'
import {
  HomeIcon,
  CubeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Card from '../components/Card';
import Bgremover from './Bgremover';
import { useContext } from 'react';
import { DashboardContext } from '../context/DashboardContext';
import ImageStroge from './ImageStroge';
// import { useEffect } from 'react';

// import axios from 'axios';


const Dashboard = () => {


  const { currentpage } = useContext(DashboardContext);

console.log(currentpage);

  return (
    <>

      <div className=" lg:overflow-y-hidden h-screen w-full m-0 p-0 flex flex-col lg:flex-row">

        {/* left div with 22percent width */}

        <Sidebar />

        {/*  Right div   */}
        <div className='h-screen lg:w-[78%] flex flex-col sm:w-full'>
          {/* header */}
          <Header />
          {/* header closed */}


          {/* cards */}
          {currentpage == "Bgremover" ? <Bgremover /> : currentpage == "ImageStroge" ? <ImageStroge /> : <div><Card /></div>}
          {/* Card closed */}
        </div>


      </div>


    </>
  )
}


export default Dashboard