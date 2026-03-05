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
import Invocegenrator from './Invocegenrator';
import QRcodegenrator from './QRcodegenrator';
import Pdfmerger from './Pdfmerger';
import ResumeBuilder from './ResumeBuilder';
import SaveClientData from './SaveClientData';
import Cropimage from './Cropimage';
import ExpenseTracker from './ExpenseTracker';
import PortfolioGenrator from './PortfolioGenrator';
import Imagecompressor from './Imagecompressor'
import Settings from './Settings';
import Imageconvertor from './Imageconvertor';
import ImageResizer from './ImageResizer';
import BulkImageRename from './BulkImageRename';
import PDFSplitter from './PDFSplitter';
import Pdfcompressor from './Pdfcompressor';
import Imagetopdf from './Imagetopdf';
import PdfToimage from './PdfToimage';
const Dashboard = () => {


  const { currentpage } = useContext(DashboardContext);

console.log(currentpage);

  return (
    <>

      <div className="overflow-y-scroll lg:overflow-y-hidden h-screen w-full m-0 p-0 flex flex-col lg:flex-row">

        {/* left div with 22percent width */}

        <Sidebar />

        {/*  Right div   */}
        <div className='h-screen lg:w-[78%] flex flex-col sm:w-full'>
          {/* header */}
          <Header />
          {/* header closed */}


          {/* cards */}
          {currentpage == "Bgremover" ? <Bgremover /> : currentpage == "ImageStroge" ? <ImageStroge /> : currentpage == "Invoicegenrator" ? <Invocegenrator /> : currentpage == "Qrcodegenrator" ? <QRcodegenrator /> : currentpage == "Pdfmerger" ? <Pdfmerger /> : currentpage == "ResumeBuilder" ? <ResumeBuilder /> : currentpage == "SaveClientData" ? <SaveClientData /> : currentpage == "Cropimage" ? <Cropimage /> : currentpage == "ExpenseTracker" ? <ExpenseTracker /> : currentpage == "PortfolioGenrator" ? <PortfolioGenrator /> : currentpage == "Imagecompressor" ? <Imagecompressor /> : currentpage == "Settings" ? <Settings /> : currentpage == "Imageconvertor" ? <Imageconvertor /> : currentpage == "ImageResizer" ? <ImageResizer /> : currentpage == "BulkImageRename" ? <BulkImageRename /> : currentpage == "PDFSplitter" ? <PDFSplitter /> : currentpage == "PDFCompressor" ? <Pdfcompressor /> : currentpage == "Imagetopdf" ? <Imagetopdf /> : currentpage == "PDFToimage" ? <PdfToimage /> : <div><Card /></div>}
          {/* Card closed */}
        </div>


      </div>


    </>
  )
}


export default Dashboard