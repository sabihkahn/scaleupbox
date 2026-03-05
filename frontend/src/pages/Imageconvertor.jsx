import React, { useState, useRef } from 'react';
import {
  Upload,
  ArrowRight,
  Download,
  X,
  Image as ImageIcon,
  RefreshCcw,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
motion
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const ImageConvertor = () => {
  const [file, setFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState('image/png');
  const [isConverting, setIsConverting] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const formats = [
    { label: 'PNG', value: 'image/png' },
    { label: 'JPG', value: 'image/jpeg' },
    { label: 'WebP', value: 'image/webp' },
  ];

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setResult(null);
    }
  };

  const convertImage = () => {
    if (!file) return;
    setIsConverting(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Convert to selected format
        const dataUrl = canvas.toDataURL(targetFormat, 0.9);

        setTimeout(() => {
          setResult(dataUrl);
          setIsConverting(false);
        }, 1000);
      };
    };
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white overflow-y-auto font-sans">
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* SaaS Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Utility Studio</span>
            <h1 className="text-5xl font-black tracking-tighter mt-2">Convert.</h1>
          </div>
          <p className="text-gray-500 max-w-[280px] text-sm leading-relaxed">
            High-fidelity image transformation. Instant, secure, and entirely in your browser.
          </p>
        </div>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Upload & Options */}
          <div className="lg:col-span-5 space-y-6">
            {!file ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => fileInputRef.current?.click()}
                className="group border-2 border-dashed border-gray-100 rounded-[32px] p-12 flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-gray-50 transition-all duration-500"
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500">
                  <Upload className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold">Select Image</h3>
                <p className="text-gray-400 text-sm mt-2 text-center">Drag and drop or click to browse</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-50 rounded-[32px] p-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-xl text-gray-400 italic">Settings</h3>
                  <button onClick={reset} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-400 mb-3 block">Export As</label>
                    <div className="grid grid-cols-3 gap-2">
                      {formats.map((f) => (
                        <button
                          key={f.value}
                          onClick={() => setTargetFormat(f.value)}
                          className={cn(
                            "py-3 rounded-xl text-sm font-bold transition-all border",
                            targetFormat === f.value
                              ? "bg-black text-white border-black shadow-lg"
                              : "bg-white text-gray-500 border-gray-100 hover:border-gray-300"
                          )}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={convertImage}
                    disabled={isConverting}
                    className="w-full py-4 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-[0.97] disabled:opacity-50"
                  >
                    {isConverting ? (
                      <RefreshCcw className="animate-spin" size={20} />
                    ) : (
                      <>Transform <ArrowRight size={18} /></>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {file ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative bg-white border border-gray-100 rounded-[32px] shadow-2xl shadow-gray-200/50 overflow-hidden h-full min-h-[400px] flex flex-col"
                >
                  <div className="p-6 border-b border-gray-50 flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="ml-2 text-xs font-medium text-gray-400 uppercase tracking-widest">Preview Window</span>
                  </div>

                  <div className="flex-1 p-8 flex items-center justify-center bg-[#fafafa]">
                    <img
                      src={result || URL.createObjectURL(file)}
                      className="max-h-[350px] object-contain rounded-lg shadow-sm"
                      alt="Preview"
                    />
                  </div>

                  {result && (
                    <motion.div
                      initial={{ y: 50 }}
                      animate={{ y: 0 }}
                      className="p-6 bg-white border-t border-gray-50 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 text-emerald-600 font-bold">
                        <Check size={20} />
                        Ready for download
                      </div>
                      <a
                        href={result}
                        download={`converted_image.${targetFormat.split('/')[1]}`}
                        className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-800 transition-all"
                      >
                        <Download size={18} /> Download
                      </a>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <div className="h-full min-h-[400px] rounded-[32px] bg-gray-50 border border-gray-100 border-dashed flex flex-col items-center justify-center text-gray-300">
                  <ImageIcon size={48} strokeWidth={1} />
                  <p className="mt-4 font-medium italic">Waiting for input...</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ImageConvertor;