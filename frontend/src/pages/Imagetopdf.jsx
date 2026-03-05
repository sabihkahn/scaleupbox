import React, { useState, useRef } from 'react';
import {
    FileImage,
    FileText,
    Download,
    X,
    Plus,
    Settings2,
    Maximize,
    MoveHorizontal,
    Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
motion
import { jsPDF } from 'jspdf';

const ImageToPdf = () => {
    const [images, setImages] = useState([]);
    const [pageSize, setPageSize] = useState('a4'); // 'a4' | 'letter'
    const [orientation, setOrientation] = useState('p'); // 'p' (portrait) | 'l' (landscape)
    const [isGenerating, setIsGenerating] = useState(false);
    const fileInputRef = useRef(null);

    const handleUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file: file,
            preview: URL.createObjectURL(file)
        }));
        setImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (id) => {
        setImages(images.filter(img => img.id !== id));
    };

    const generatePdf = async () => {
        if (images.length === 0) return;
        setIsGenerating(true);

        const doc = new jsPDF({
            orientation: orientation,
            unit: 'mm',
            format: pageSize
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        for (let i = 0; i < images.length; i++) {
            if (i > 0) doc.addPage(pageSize, orientation);

            const imgData = await getBase64(images[i].file);

            // Auto-fit logic
            doc.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
        }

        doc.save('converted_images.pdf');
        setIsGenerating(false);
    };

    const getBase64 = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white overflow-y-auto">
            <div className="max-w-6xl mx-auto px-6 py-12">

                {/* SaaS Header */}
                <header className="mb-12 border-b border-gray-100 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="bg-black p-2 rounded-xl text-white shadow-lg">
                                <FileImage size={20} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">PDF Document Engine</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter">Compiler.</h1>
                    </div>
                    <p className="text-gray-400 max-w-xs text-sm font-medium">
                        Seamlessly convert your image collection into high-quality, standardized PDF documents.
                    </p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Sidebar: Controls */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-8">
                                <Settings2 size={18} className="text-gray-400" />
                                <h3 className="text-sm font-bold uppercase tracking-widest">Page Setup</h3>
                            </div>

                            <div className="space-y-6">
                                {/* Format Selection */}
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-2 block tracking-widest">Dimensions</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['A4', 'Letter'].map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setPageSize(size.toLowerCase())}
                                                className={`py-3 rounded-2xl font-bold text-sm border transition-all ${pageSize === size.toLowerCase() ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-100'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Orientation Selection */}
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-2 block tracking-widest">Orientation</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setOrientation('p')}
                                            className={`flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm border transition-all ${orientation === 'p' ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-100'
                                                }`}
                                        >
                                            <Layout size={16} /> Portrait
                                        </button>
                                        <button
                                            onClick={() => setOrientation('l')}
                                            className={`flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm border transition-all ${orientation === 'l' ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-100'
                                                }`}
                                        >
                                            <MoveHorizontal size={16} /> Landscape
                                        </button>
                                    </div>
                                </div>

                                <button
                                    disabled={images.length === 0 || isGenerating}
                                    onClick={generatePdf}
                                    className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:opacity-20 shadow-xl shadow-black/10 mt-4"
                                >
                                    {isGenerating ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <><Download size={18} /> Generate PDF</>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="p-6 bg-zinc-50 rounded-[24px] border border-zinc-100">
                            <div className="flex items-center gap-2 text-black font-bold text-xs uppercase tracking-widest mb-2">
                                <Maximize size={14} /> Auto-Fit
                            </div>
                            <p className="text-[11px] text-gray-400 leading-relaxed">
                                Images are automatically scaled to fill the entire page dimensions selected above.
                            </p>
                        </div>
                    </div>

                    {/* Main Stage: Image Queue */}
                    <div className="lg:col-span-8">
                        <div className="bg-white border border-gray-100 rounded-[40px] shadow-2xl shadow-gray-100/50 min-h-[500px] flex flex-col overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-[0.2em]">Image Queue</span>
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-zinc-800 transition-all active:scale-[0.95]"
                                >
                                    <Plus size={14} /> Add Images
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleUpload}
                                    multiple
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>

                            <div className="flex-1 overflow-y-auto p-8">
                                <AnimatePresence>
                                    {images.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="h-full flex flex-col items-center justify-center text-gray-200 py-20"
                                        >
                                            <FileImage size={64} strokeWidth={1} />
                                            <p className="mt-4 font-bold tracking-tight text-gray-300 italic text-xl">Upload images to begin</p>
                                        </motion.div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                            {images.map((img, index) => (
                                                <motion.div
                                                    key={img.id}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    className="relative group aspect-[3/4] rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm"
                                                >
                                                    <img
                                                        src={img.preview}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        alt="preview"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                                                        <button
                                                            onClick={() => removeImage(img.id)}
                                                            className="bg-white text-black p-3 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-xl"
                                                        >
                                                            <X size={20} />
                                                        </button>
                                                        <span className="mt-2 text-white font-black text-xs uppercase tracking-widest">
                                                            Page {index + 1}
                                                        </span>
                                                    </div>
                                                    <div className="absolute top-3 left-3 bg-black text-white text-[9px] font-bold px-2 py-1 rounded-md">
                                                        0{index + 1}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {images.length > 0 && (
                                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <FileText size={12} /> {images.length} Pages in document
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ImageToPdf;