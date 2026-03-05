import React, { useState, useRef } from 'react';
import {
    FileText,
    Image as ImageIcon,
    Download,
    X,
    Zap,
    Settings2,
    Loader2,
    Trash2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
motion
// 1. IMPORT PDF.JS LOCALLY
import * as pdfjsLib from 'pdfjs-dist';

// 2. CONFIGURE WORKER FOR VITE (The modern way)
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const PdfToImage = () => {
    const [file, setFile] = useState(null);
    const [pages, setPages] = useState([]);
    const [scale, setScale] = useState(2);
    const [format, setFormat] = useState('image/png');
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    console.log(setFormat, progress);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setError(null);
        if (selectedFile?.type === 'application/pdf') {
            setFile(selectedFile);
            setPages([]);
        } else {
            setError("Please select a valid PDF file.");
        }
    };

    const convertPdf = async () => {
        if (!file) return;
        setIsProcessing(true);
        setError(null);
        const renderedPages = [];

        try {
            const data = await file.arrayBuffer();
            // Use the local library to load the document
            const loadingTask = pdfjsLib.getDocument({
                data,
                // Ensure we don't use CMYK or other complex color spaces that crash browsers
                disableFontFace: false
            });

            const pdf = await loadingTask.promise;
            setProgress({ current: 0, total: pdf.numPages });

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale });

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');

                // High quality rendering settings
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };

                await page.render(renderContext).promise;

                renderedPages.push({
                    id: i,
                    url: canvas.toDataURL(format, 0.95)
                });
                setProgress(prev => ({ ...prev, current: i }));
            }
            setPages(renderedPages);
        } catch (err) {
            console.error("PDF.js Error:", err);
            setError("Engine Error: Try a different PDF or check if the file is password protected.");
        } finally {
            setIsProcessing(false);
        }
    };

    const reset = () => {
        setFile(null);
        setPages([]);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-[#111] font-sans">
            <div className="max-w-6xl mx-auto px-6 py-16">

                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-black p-2 rounded-xl text-white">
                            <ImageIcon size={20} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Pro Visuals</span>
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter">Raster.</h1>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Controls */}
                    <aside className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-[2rem] p-8 border border-zinc-100 shadow-xl shadow-zinc-200/40">
                            <h3 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-2">
                                <Settings2 size={16} /> Config
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase mb-3 block">Quality</label>
                                    <div className="flex gap-2 p-1 bg-zinc-50 rounded-xl">
                                        {[1, 2, 3].map(s => (
                                            <button key={s} onClick={() => setScale(s)} className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${scale === s ? 'bg-white text-black shadow-sm' : 'text-zinc-400'}`}>
                                                {s}x
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    disabled={!file || isProcessing}
                                    onClick={convertPdf}
                                    className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 disabled:opacity-20 transition-all"
                                >
                                    {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} fill="currentColor" />}
                                    {isProcessing ? `Processing...` : 'Convert PDF'}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex gap-3 items-center text-xs font-bold border border-red-100">
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}
                    </aside>

                    {/* Stage */}
                    <section className="lg:col-span-8">
                        <div className="bg-white rounded-[2.5rem] border border-zinc-100 min-h-[500px] flex flex-col relative overflow-hidden">
                            {!file ? (
                                <div onClick={() => fileInputRef.current.click()} className="flex-1 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-50/50 transition-all group">
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf" />
                                    <div className="w-20 h-20 bg-zinc-100 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-all">
                                        <FileText size={32} />
                                    </div>
                                    <p className="font-bold text-lg">Select a PDF to start</p>
                                </div>
                            ) : (
                                <div className="flex flex-col h-full">
                                    <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
                                        <span className="text-sm font-bold truncate max-w-[300px]">{file.name}</span>
                                        <button onClick={reset} className="p-2 hover:bg-zinc-100 rounded-full"><X size={20} /></button>
                                    </div>

                                    <div className="p-8 bg-zinc-50/50 flex-1 overflow-y-auto max-h-[600px]">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {pages.map(page => (
                                                <motion.div key={page.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-3 rounded-2xl shadow-sm border border-zinc-100">
                                                    <img src={page.url} className="w-full rounded-lg mb-3" alt="page" />
                                                    <div className="flex justify-between items-center px-1">
                                                        <span className="text-[10px] font-black text-zinc-300">PAGE {page.id}</span>
                                                        <a href={page.url} download={`page-${page.id}.png`} className="text-white bg-black px-3 py-1 rounded-md hover:scale-110 transition-transform"><Download size={26} /></a>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default PdfToImage;