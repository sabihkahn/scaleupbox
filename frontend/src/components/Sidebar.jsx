import React, { useState, useContext } from 'react';
import {
    HomeIcon,
    Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { DashboardContext } from '../context/DashboardContext';
import {
    ArrowDown01, ArrowDownAzIcon, BoomBoxIcon, Code2, Crop,
    File, Image, ImageUpscale, ListCheck, PenSquareIcon,
    PersonStanding, QrCode, SquareSplitVertical, TextWrapIcon,
    Upload, Search, LayoutGrid, FileStack, Briefcase
} from 'lucide-react';

const Sidebar = () => {
    const { setcurrentpage } = useContext(DashboardContext);
    const [currentpage1, setcurrentpage1] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handelclik = (data) => {
        setcurrentpage(data);
        setcurrentpage1(data);
    };
    console.log(currentpage1);
    

    // Helper to determine if an item should be visible based on search
    const isVisible = (text) => text.toLowerCase().includes(searchTerm.toLowerCase());

    const navItemClass = "flex items-center cursor-pointer gap-3 px-4 py-2 rounded-xl transition-all duration-200 group hover:bg-zinc-900 text-zinc-400 hover:text-white mb-0.5";
    const categoryTitle = "text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2 mt-5 px-4 flex items-center gap-2";

    return (
        <>
            <div className='hidden lg:flex flex-col h-screen border-r border-zinc-800/60 w-[22%] bg-zinc-950 text-zinc-100 shadow-2xl overflow-hidden'>

                {/* Header Section */}
                <div className='p-6 pb-4'>
                    <div className='flex items-center gap-3 mb-6'>
                        <div className='bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20'>
                            <span className='font-black text-base'>S</span>
                        </div>
                        <h3 className='text-lg font-black tracking-tighter uppercase'>
                            Scale Up <span className='text-blue-500'>Box</span>
                        </h3>
                    </div>

                    {/* Search Bar with Icon */}
                    <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer">
                            <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search tools..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 text-xs py-2.5 pl-10 pr-4 rounded-xl focus:outline-none focus:border-zinc-700 transition-all placeholder:text-zinc-600"
                        />
                    </div>
                </div>

                {/* Navigation Links */}
                <div className='flex-1 overflow-y-auto px-3 pb-6 no-scrollbar'>

                    {isVisible("Dashboard") && (
                        <>
                            <div className={categoryTitle}><LayoutGrid size={12} /> General</div>
                            <div className={navItemClass} onClick={() => handelclik("home")}>
                                <HomeIcon className="h-4 w-4 group-hover:text-blue-500" />
                                <span className='text-sm font-medium'>Dashboard</span>
                            </div>
                        </>
                    )}

                    <div className={categoryTitle}><Image size={12} /> Image Studio</div>
                    {isVisible("BG Remover") && (
                        <div className={navItemClass} onClick={() => handelclik("Bgremover")}>
                            <Crop size={16} />
                            <span className='text-sm font-medium'>BG Remover</span>
                        </div>
                    )}
                    {isVisible("Image Resizer") && (
                        <div className={navItemClass} onClick={() => handelclik("ImageResizer")}>
                            <ImageUpscale size={16} />
                            <span className='text-sm font-medium'>Image Resizer</span>
                        </div>
                    )}
                    {isVisible("Compressor") && (
                        <div className={navItemClass} onClick={() => handelclik("Imagecompressor")}>
                            <Image size={16} />
                            <span className='text-sm font-medium'>Compressor</span>
                        </div>
                    )}
                    {isVisible("Converter") && (
                        <div className={navItemClass} onClick={() => handelclik("Imageconvertor")}>
                            <ArrowDownAzIcon size={16} />
                            <span className='text-sm font-medium'>Converter</span>
                        </div>
                    )}
                    {isVisible("Crop Image") && (
                        <div className={navItemClass} onClick={() => handelclik("Cropimage")}>
                            <Crop size={16} />
                            <span className='text-sm font-medium'>Crop Image</span>
                        </div>
                    )}
                    {isVisible("Bulk Rename") && (
                        <div className={navItemClass} onClick={() => handelclik("BulkImageRename")}>
                            <File size={16} />
                            <span className='text-sm font-medium'>Bulk Rename</span>
                        </div>
                    )}

                    <div className={categoryTitle}><FileStack size={12} /> PDF Toolbox</div>
                    {isVisible("PDF To Image") && (
                        <div className={navItemClass} onClick={() => handelclik("PDFToimage")}>
                            <ArrowDown01 size={16} />
                            <span className='text-sm font-medium'>PDF To Image</span>
                        </div>
                    )}
                    {isVisible("Image to PDF") && (
                        <div className={navItemClass} onClick={() => handelclik("Imagetopdf")}>
                            <TextWrapIcon size={16} />
                            <span className='text-sm font-medium'>Image to PDF</span>
                        </div>
                    )}
                    {isVisible("PDF Merger") && (
                        <div className={navItemClass} onClick={() => handelclik("Pdfmerger")}>
                            <File size={16} />
                            <span className='text-sm font-medium'>PDF Merger</span>
                        </div>
                    )}
                    {isVisible("PDF Splitter") && (
                        <div className={navItemClass} onClick={() => handelclik("PDFSplitter")}>
                            <SquareSplitVertical size={16} />
                            <span className='text-sm font-medium'>PDF Splitter</span>
                        </div>
                    )}
                    {isVisible("PDF Compressor") && (
                        <div className={navItemClass} onClick={() => handelclik("PDFCompressor")}>
                            <BoomBoxIcon size={16} />
                            <span className='text-sm font-medium'>PDF Compressor</span>
                        </div>
                    )}

                    <div className={categoryTitle}><Briefcase size={12} /> Business</div>
                    {isVisible("Portfolio Gen") && (
                        <div className={navItemClass} onClick={() => handelclik("PortfolioGenrator")}>
                            <Code2 size={16} />
                            <span className='text-sm font-medium'>Portfolio Gen</span>
                        </div>
                    )}
                    {isVisible("Resume Builder") && (
                        <div className={navItemClass} onClick={() => handelclik("ResumeBuilder")}>
                            <ListCheck size={16} />
                            <span className='text-sm font-medium'>Resume Builder</span>
                        </div>
                    )}
                    {isVisible("Invoice Gen") && (
                        <div className={navItemClass} onClick={() => handelclik("Invoicegenrator")}>
                            <PersonStanding size={16} />
                            <span className='text-sm font-medium'>Invoice Gen</span>
                        </div>
                    )}
                    {isVisible("QR Generator") && (
                        <div className={navItemClass} onClick={() => handelclik("Qrcodegenrator")}>
                            <QrCode size={16} />
                            <span className='text-sm font-medium'>QR Generator</span>
                        </div>
                    )}
                    {isVisible("Client Data") && (
                        <div className={navItemClass} onClick={() => handelclik("SaveClientData")}>
                            <PenSquareIcon size={16} />
                            <span className='text-sm font-medium'>Client Data</span>
                        </div>
                    )}
                    {isVisible("Storage") && (
                        <div className={navItemClass} onClick={() => handelclik("ImageStroge")}>
                            <Upload size={16} />
                            <span className='text-sm font-medium'>Storage</span>
                        </div>
                    )}
                </div>

                {/* Footer Section */}
                <div className='mt-auto p-4 border-t border-zinc-900 bg-zinc-950'>
                    <div className='flex items-center gap-3 px-4 py-2 cursor-pointer text-zinc-500 hover:text-white transition-colors' onClick={() => handelclik("Settings")}>
                        <Cog6ToothIcon className='h-4 w-4' />
                        <span className='text-sm font-medium'>Settings</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;