import React, { useState, useRef } from 'react';
import {
  FileText,
  Scissors,
  Download,
  X,
  Plus,
  Archive,
  Files,
  Layers,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
motion
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

const PDFSplitter = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [splitMode, setSplitMode] = useState('range'); // 'range' | 'specific' | 'every'
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setPageCount(pdfDoc.getPageCount());
      setPdfFile(file);
    }
  };

  const parsePages = () => {
    const pages = [];
    if (splitMode === 'every') {
      for (let i = 0; i < pageCount; i++) pages.push([i]);
    } else if (splitMode === 'range') {
      const [start, end] = inputValue.split('-').map(n => parseInt(n.trim()) - 1);
      if (!isNaN(start) && !isNaN(end)) {
        const range = [];
        for (let i = start; i <= end; i++) if (i < pageCount) range.push(i);
        pages.push(range);
      }
    } else {
      const specific = inputValue.split(',').map(n => parseInt(n.trim()) - 1);
      pages.push(specific.filter(n => !isNaN(n) && n < pageCount));
    }
    return pages;
  };

  const processPDF = async (asZip = false) => {
    if (!pdfFile) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const mainPdfDoc = await PDFDocument.load(arrayBuffer);
      const groups = parsePages();
      const zip = new JSZip();

      for (let i = 0; i < groups.length; i++) {
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(mainPdfDoc, groups[i]);
        copiedPages.forEach(page => newPdf.addPage(page));

        const pdfBytes = await newPdf.save();
        const fileName = `split_part_${i + 1}.pdf`;

        if (asZip) {
          zip.file(fileName, pdfBytes);
        } else {
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
        }
      }

      if (asZip) {
        const content = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = "split_pdfs.zip";
        link.click();
      }
    } catch (error) {
      console.error("Error splitting PDF:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setPdfFile(null);
    setPageCount(0);
    setInputValue('');
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <header className="mb-16 border-b border-gray-100 pb-8 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-black p-1.5 rounded-lg text-white">
                <Scissors size={18} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">PDF Studio</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter">Splitter.</h1>
          </div>
          {pdfFile && (
            <button onClick={reset} className="text-xs font-bold hover:text-red-500 transition-colors flex items-center gap-2 mb-1">
              <X size={14} /> Close File
            </button>
          )}
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Sidebar: Configuration */}
          <div className="lg:col-span-4 space-y-8">
            <section className="bg-gray-50 rounded-[32px] p-8 border border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Split Method</h3>

              <div className="space-y-3">
                {[
                  { id: 'range', label: 'Page Range', desc: 'e.g. 1-5' },
                  { id: 'specific', label: 'Specific Pages', desc: 'e.g. 1, 3, 7' },
                  { id: 'every', label: 'Split All', desc: 'Every page to separate PDF' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSplitMode(mode.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${splitMode === mode.id ? 'bg-black border-black text-white shadow-xl shadow-black/10' : 'bg-white border-gray-100 hover:border-gray-300'
                      }`}
                  >
                    <p className="font-bold text-sm">{mode.label}</p>
                    <p className={`text-[10px] ${splitMode === mode.id ? 'text-gray-400' : 'text-gray-400'}`}>{mode.desc}</p>
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {splitMode !== 'every' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-gray-200/50"
                  >
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Input {splitMode}</label>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={splitMode === 'range' ? "1-5" : "1, 3, 5"}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 mt-1 font-bold focus:ring-2 focus:ring-black outline-none"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-8 space-y-3">
                <button
                  disabled={!pdfFile || isProcessing}
                  onClick={() => processPDF(false)}
                  className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:opacity-20"
                >
                  <Download size={18} /> Download PDFs
                </button>
                <button
                  disabled={!pdfFile || isProcessing}
                  onClick={() => processPDF(true)}
                  className="w-full bg-white border border-gray-200 text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:border-black transition-all active:scale-[0.98] disabled:opacity-20"
                >
                  <Archive size={18} /> Download ZIP
                </button>
              </div>
            </section>
          </div>

          {/* Main Stage: File Preview */}
          <div className="lg:col-span-8">
            {!pdfFile ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => fileInputRef.current.click()}
                className="h-full min-h-[500px] border-2 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all group"
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf" />
                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-black group-hover:text-white transition-all duration-500">
                  <FileText size={32} />
                </div>
                <p className="text-xl font-bold tracking-tight">Drop PDF file here</p>
                <p className="text-gray-400 mt-2 text-sm uppercase tracking-widest font-medium">Local processing • Secure</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full bg-gray-50/50 border border-gray-100 rounded-[40px] p-10 flex flex-col"
              >
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <FileText className="text-gray-400" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold truncate max-w-[200px] md:max-w-md">{pdfFile.name}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{pageCount} Pages detected</p>
                    </div>
                  </div>
                </div>

                {/* Visual Page Grid (Mocked Preview) */}
                <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[400px]">
                  {Array.from({ length: pageCount }).map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center p-4 shadow-sm relative group overflow-hidden">
                      <span className="text-gray-200 font-black text-4xl leading-none">{i + 1}</span>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest">
                    <Layers size={14} /> Ready to Extract
                  </div>
                  <div className="text-gray-400 text-[10px] font-mono">
                    {pdfFile.size > 1024 * 1024 ? `${(pdfFile.size / 1024 / 1024).toFixed(2)} MB` : `${(pdfFile.size / 1024).toFixed(2)} KB`}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PDFSplitter;