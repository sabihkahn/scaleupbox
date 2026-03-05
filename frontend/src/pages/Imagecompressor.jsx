import React, { useState, useRef } from 'react';
import { Upload, ImageIcon, CheckCircle, Download, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
motion
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for merging tailwind classes
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
console.log(cn);

const ImageCompressor = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedData, setCompressedData] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setCompressedData(null);
    }
  };

  const compressImage = () => {
    if (!selectedFile) return;
    setIsCompressing(true);

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set dimensions (keeping aspect ratio)
        const maxWidth = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to 70% quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);

        // Small delay for better UX/Animation
        setTimeout(() => {
          setCompressedData(dataUrl);
          setIsCompressing(false);
        }, 800);
      };
    };
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setCompressedData(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white overflow-y-auto">
      <div className="max-w-xl mx-auto px-6 py-12 md:py-20">

        {/* Header Section */}
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            Shrink.
          </h1>
          <p className="text-gray-500 text-lg">
            Professional grade image compression.
          </p>
        </header>

        <main>
          <AnimatePresence mode="wait">
            {!selectedFile ? (
              /* Upload State */
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                className="group relative border-2 border-dashed border-gray-200 rounded-3xl p-16 flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-gray-50 transition-all duration-300"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <div className="bg-black text-white p-4 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Upload size={28} />
                </div>
                <p className="text-xl font-semibold">Drop image here</p>
                <p className="text-gray-400 mt-2 text-sm">PNG, JPG up to 10MB</p>
              </motion.div>
            ) : (
              /* Preview & Action State */
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-gray-100 shadow-2xl rounded-[32px] overflow-hidden"
              >
                {/* File Info Bar */}
                <div className="px-6 py-4 bg-gray-50/50 flex items-center justify-between border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <ImageIcon size={18} className="text-gray-400" />
                    <span className="text-sm font-medium truncate max-w-[150px]">
                      {selectedFile.name}
                    </span>
                  </div>
                  <button
                    onClick={clearSelection}
                    className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Main Content */}
                <div className="p-8">
                  <div className="relative aspect-square w-full bg-gray-50 rounded-2xl mb-8 flex items-center justify-center overflow-hidden border border-gray-50">
                    <img
                      src={compressedData || URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="max-h-full max-w-full object-contain p-4"
                    />
                  </div>

                  {!compressedData ? (
                    <button
                      onClick={compressImage}
                      disabled={isCompressing}
                      className="w-full h-14 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-800 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {isCompressing ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Compressing...
                        </>
                      ) : (
                        "Compress Now"
                      )}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-600 mb-2">
                        <CheckCircle size={16} />
                        Optimization Complete
                      </div>
                      <a
                        href={compressedData}
                        download={`compressed_${selectedFile.name}`}
                        className="w-full h-14 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-800 active:scale-[0.98] transition-all"
                      >
                        <Download size={20} />
                        Download File
                      </a>
                      <button
                        onClick={clearSelection}
                        className="w-full py-2 text-sm text-gray-400 hover:text-black transition-colors"
                      >
                        Compress another
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="mt-16 text-center">
          <p className="text-xs text-gray-300 uppercase tracking-widest font-medium">
            Privacy First • Local Processing
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ImageCompressor;