import React, { useState, useRef } from 'react';
import {
  Files,
  Type,
  Download,
  X,
  Plus,
  Archive,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
motion
import JSZip from 'jszip';

const BulkImageRename = () => {
  const [files, setFiles] = useState([]);
  const [prefix, setPrefix] = useState('image');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const downloadAsZip = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    const zip = new JSZip();

    files.forEach((file, index) => {
      const extension = file.name.split('.').pop();
      const newName = `${prefix}_${index + 1}.${extension}`;
      zip.file(newName, file);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `${prefix}_batch.zip`;
    link.click();

    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-black p-2 rounded-lg">
              <Files className="text-white" size={20} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Batch Tools</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">Bulk Rename.</h1>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Settings Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100">
              <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
                <Type size={18} /> Naming Convention
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">File Prefix</label>
                  <input
                    type="text"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    placeholder="e.g. vacation_photos"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 mt-1 font-medium focus:ring-2 focus:ring-black outline-none transition-all"
                  />
                </div>

                <div className="p-4 bg-white rounded-2xl border border-gray-100 italic text-sm text-gray-500">
                  Preview: <span className="font-bold text-black">{prefix}_1.jpg</span>, {prefix}_2.jpg...
                </div>

                <button
                  onClick={downloadAsZip}
                  disabled={files.length === 0 || isProcessing}
                  className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:opacity-20 shadow-xl shadow-black/5"
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Archive size={18} /> Download ZIP</>
                  )}
                </button>
              </div>
            </div>

            {files.length > 0 && (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-4 rounded-2xl text-sm font-bold">
                <CheckCircle2 size={16} />
                {files.length} files ready for renaming
              </div>
            )}
          </div>

          {/* Upload & List Area */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-gray-100 rounded-[40px] shadow-2xl shadow-gray-100/50 min-h-[500px] flex flex-col overflow-hidden">

              {/* Toolbar */}
              <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                <span className="text-xs font-bold uppercase text-gray-400 tracking-widest">Queue</span>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-zinc-800 transition-all"
                >
                  <Plus size={14} /> Add Files
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  className="hidden"
                  accept="image/*"
                />
              </div>

              {/* Scrollable List */}
              <div className="flex-1 overflow-y-auto max-h-[600px] p-6">
                <AnimatePresence>
                  {files.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center text-gray-300 py-20"
                    >
                      <Files size={48} strokeWidth={1} />
                      <p className="mt-4 font-medium italic">Your queue is empty</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <motion.div
                          key={`${file.name}-${index}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-gray-100 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-mono text-gray-400 w-4">{index + 1}</span>
                            <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center">
                              <img
                                src={URL.createObjectURL(file)}
                                className="object-cover w-full h-full"
                                alt="thumb"
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold truncate max-w-[150px] md:max-w-sm">
                                {file.name}
                              </span>
                              <span className="text-[10px] text-emerald-500 font-bold uppercase">
                                → {prefix}_{index + 1}.{file.name.split('.').pop()}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer Info */}
              {files.length > 0 && (
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <span>Total Size: {(files.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2)} MB</span>
                  <span>{files.length} Items Selected</span>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BulkImageRename;