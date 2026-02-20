import React, { useEffect, useState } from "react";
import { uploadphotogetalldata } from "../cloudinary/Cloudinary";
import axios from "axios";
import { Download, Upload, X, ImageIcon, Loader2, History as HistoryIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
motion
const Bgremover = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [rembgphoto, setrembgphoto] = useState("");
  const [historydata, sethistorydata] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/photo/rembg/history`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        sethistorydata(res.data.bgRemovedHistory || []);
      } catch (error) {
        console.error("History fetch error", error);
      }
    };
    fetchHistory();
  }, [token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }
    setError("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const resetAll = () => {
    setImage(null);
    setPreview(null);
    setrembgphoto("");
    setError("");
  };

  const uploadimage = async () => {
    if (!image) return setError("Please select an image");
    try {
      setProcessing(true);
      const data = await uploadphotogetalldata(image);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/photo/rembg`,
        { publicid: data.public_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setrembgphoto(res.data.bgRemovedUrl);
    } catch (err) {
      console.log(err);
      
      setError("Failed to process background. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">

        {/* --- Header --- */}
        <header className="text-center space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-black tracking-tight"
          >
            Clear<span className="text-zinc-400">BG</span>
          </motion.h1>
          <p className="text-zinc-500 text-sm md:text-base">Professional AI Background Removal</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* --- UPLOADER SECTION (Lg: 7 columns) --- */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              layout
              className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-10 shadow-sm"
            >
              <AnimatePresence mode="wait">
                {!rembgphoto ? (
                  <motion.div
                    key="upload-view"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center"
                  >
                    {!preview ? (
                      <label className="w-full h-80 border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-50 hover:border-zinc-300 transition-all group">
                        <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                        <div className="bg-zinc-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                          <Upload className="text-zinc-500" />
                        </div>
                        <p className="font-semibold">Click to upload</p>
                        <p className="text-zinc-400 text-xs mt-1">PNG, JPG up to 5MB</p>
                      </label>
                    ) : (
                      <div className="w-full space-y-6">
                        <div className="relative w-full h-80 bg-zinc-50 rounded-2xl overflow-hidden border border-zinc-100">
                          <img src={preview} alt="preview" className="w-full h-full object-contain" />
                          <button
                            onClick={resetAll}
                            className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                        <button
                          disabled={processing}
                          onClick={uploadimage}
                          className="w-full bg-zinc-950 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-800 disabled:opacity-50 transition-all active:scale-[0.98]"
                        >
                          {processing ? (
                            <> <Loader2 className="animate-spin" /> Processing AI... </>
                          ) : (
                            <> <ImageIcon size={20} /> Remove Background </>
                          )}
                        </button>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="result-view"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center space-y-6"
                  >
                    <div className="w-full h-80 bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] bg-zinc-100 rounded-2xl border border-zinc-200 overflow-hidden">
                      <img src={rembgphoto} alt="result" className="w-full h-full object-contain animate-in fade-in duration-700" />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                      <a
                        href={rembgphoto}
                        download="cleared_bg.png"
                        className="flex-1 bg-zinc-950 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-[0.98]"
                      >
                        Download Image <Download size={18} />
                      </a>
                      <button
                        onClick={resetAll}
                        className="px-8 py-4 border border-zinc-200 rounded-2xl font-semibold hover:bg-zinc-50 transition-all"
                      >
                        Start Over
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {error && <p className="text-red-500 text-center text-sm mt-4 font-medium">{error}</p>}
            </motion.div>
          </div>

          {/* --- HISTORY SECTION (Lg: 5 columns) --- */}
          <aside className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-zinc-400">
                <HistoryIcon size={18} />
                <h2 className="text-lg font-bold text-zinc-800">Recent Assets</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {historydata.length === 0 ? (
                  <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-100 rounded-2xl text-zinc-400 text-sm">
                    No history yet
                  </div>
                ) : (
                  historydata.map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -4 }}
                      className="group relative border border-zinc-100 p-2 rounded-2xl bg-zinc-50/50 hover:bg-white hover:shadow-xl hover:shadow-zinc-200/50 transition-all"
                    >
                      <div className="h-32 rounded-xl overflow-hidden bg-white mb-2 bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] bg-[length:15px_15px]">
                        <img src={item} alt="history" className="w-full h-full object-contain" />
                      </div>
                      <a
                        href={item}
                        download
                        className="flex items-center justify-center gap-2 bg-white border border-zinc-200 py-2 rounded-xl text-xs font-bold hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-all"
                      >
                        <Download size={14} /> Download
                      </a>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default Bgremover;