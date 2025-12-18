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

const Dashboard = () => {




  return (
    <>

      <div className=" h-screen w-full m-0 p-0 flex flex-col lg:flex-row">

        {/* left div with 22percent width */}

        <Sidebar />

        {/*  Right div   */}
        <div className='h-screen lg:w-[78%] flex flex-col sm:w-full'>
          {/* header */}
          <Header />
          {/* header closed */}


          {/* cards */}
          <Card />
          {/* Card closed */}
        </div>
  

      </div>


    </>
  )
}

export default Dashboard