import React, { useState, useRef } from 'react';
import {
  Maximize,
  Instagram,
  Youtube,
  Linkedin,
  Link as LinkIcon,
  Unlink,
  Download,
  Upload,
  X,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
motion

const ImageResizer = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 1080, height: 1080 });
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [isResizing, setIsResizing] = useState(false);
  const fileInputRef = useRef(null);

  const presets = [
    { name: 'Instagram Post', width: 1080, height: 1080, icon: <Instagram size={18} /> },
    { name: 'Instagram Story', width: 1080, height: 1920, icon: <Instagram size={18} /> },
    { name: 'LinkedIn Banner', width: 1584, height: 396, icon: <Linkedin size={18} /> },
    { name: 'YouTube Thumb', width: 1280, height: 720, icon: <Youtube size={18} /> },
  ];

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setPreviewUrl(url);

      const img = new Image();
      img.src = url;
      img.onload = () => {
        setDimensions({ width: img.width, height: img.height });
        setAspectRatio(img.width / img.height);
      };
    }
  };

  const handleWidthChange = (val) => {
    const width = parseInt(val) || 0;
    if (maintainAspect) {
      setDimensions({ width, height: Math.round(width / aspectRatio) });
    } else {
      setDimensions(prev => ({ ...prev, width }));
    }
  };

  const handleHeightChange = (val) => {
    const height = parseInt(val) || 0;
    if (maintainAspect) {
      setDimensions({ height, width: Math.round(height * aspectRatio) });
    } else {
      setDimensions(prev => ({ ...prev, height }));
    }
  };

  const applyPreset = (p) => {
    setDimensions({ width: p.width, height: p.height });
    // When applying a specific platform preset, we usually break custom aspect ratio
    setMaintainAspect(false);
  };

  const downloadResized = () => {
    setIsResizing(true);
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);
      const link = document.createElement('a');
      link.download = `resized-${file.name}`;
      link.href = canvas.toDataURL(file.type);
      link.click();
      setIsResizing(false);
    };
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <header className="flex items-center justify-between mb-12 border-b border-gray-100 pb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Resizer<span className="text-gray-300">.pro</span></h1>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-widest mt-1">Platform Studio</p>
          </div>
          {file && (
            <button onClick={() => setFile(null)} className="flex items-center gap-2 text-sm font-bold hover:text-red-500 transition-colors">
              <X size={18} /> Clear
            </button>
          )}
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Controls Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Presets</h3>
              <div className="grid grid-cols-1 gap-2">
                {presets.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => applyPreset(p)}
                    className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-black hover:bg-gray-50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 group-hover:text-black transition-colors">{p.icon}</span>
                      <span className="font-bold text-sm">{p.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400">{p.width}x{p.height}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-gray-50 rounded-[32px] p-6 space-y-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Custom Canvas</h3>

              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 ml-1">Width (px)</label>
                  <input
                    type="number"
                    value={dimensions.width}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  />
                </div>

                <button
                  onClick={() => setMaintainAspect(!maintainAspect)}
                  className={`mt-6 p-3 rounded-xl transition-all ${maintainAspect ? 'bg-black text-white shadow-lg' : 'bg-white text-gray-300 border border-gray-100'}`}
                >
                  {maintainAspect ? <LinkIcon size={18} /> : <Unlink size={18} />}
                </button>

                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 ml-1">Height (px)</label>
                  <input
                    type="number"
                    value={dimensions.height}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  />
                </div>
              </div>

              <button
                disabled={!file || isResizing}
                onClick={downloadResized}
                className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-black/10"
              >
                <Download size={20} /> Export Image
              </button>
            </section>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="h-full min-h-[500px] border-2 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group"
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-black group-hover:text-white transition-all duration-500">
                    <Upload size={32} />
                  </div>
                  <p className="text-xl font-bold tracking-tight">Drop your masterpiece</p>
                  <p className="text-gray-400 mt-2">Maximum file size: 25MB</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col"
                >
                  <div className="flex-1 bg-gray-100/50 rounded-[40px] p-10 flex items-center justify-center relative overflow-hidden border border-gray-50">
                    {/* Visual representation of the canvas */}
                    <div
                      className="bg-white shadow-2xl transition-all duration-300 ease-out overflow-hidden flex items-center justify-center"
                      style={{
                        aspectRatio: `${dimensions.width} / ${dimensions.height}`,
                        maxHeight: '100%',
                        maxWidth: '100%'
                      }}
                    >
                      <img src={previewUrl} className="w-full h-full object-cover" alt="Resize Target" />
                    </div>

                    <div className="absolute bottom-6 left-6 bg-black/5 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                      <Maximize size={12} /> {dimensions.width} × {dimensions.height} PX
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        <footer className="mt-20 border-t border-gray-50 pt-10 flex flex-col md:flex-row justify-between items-center text-gray-300 text-[10px] font-bold uppercase tracking-[0.3em]">
          <div className="flex gap-8 mb-4 md:mb-0">
            <span>Precision Scaling</span>
            <span>Batch Ready</span>
            <span>Local Secure</span>
          </div>
          <p>© 2026 Studio Utility</p>
        </footer>
      </div>
    </div>
  );
};

export default ImageResizer;