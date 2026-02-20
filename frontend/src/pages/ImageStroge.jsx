import React, { useEffect, useState } from "react";
import axios from "axios";
import { uploadphoto } from "../cloudinary/Cloudinary";
import { Upload, X, CheckCircle, AlertCircle, Download, ImageIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
motion
const ImageStorage = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const token = localStorage.getItem("token");

    const fetchImages = async () => {
        try {
            setFetching(true);
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/imgstorage/getimgsaveddb`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setImages(res.data.imgstroage || []);
        } catch (err) {
            if (err.response?.status === 400 || err.response?.data?.message === "Token has expired") {
                window.location.reload();
            }
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => { fetchImages(); }, []);

    const handleUpload = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        if (!selected.type.startsWith("image/")) {
            setMessage({ text: "Only image files are allowed", type: "error" });
            return;
        }

        setFile(selected);
        setPreview(URL.createObjectURL(selected));
        setMessage({ text: "", type: "" });
    };

    const removeImage = () => {
        setFile(null);
        setPreview("");
        setMessage({ text: "", type: "" });
    };

    const uploadImage = async () => {
        if (!file) return;

        try {
            setLoading(true);
            const imageUrl = await uploadphoto(file);
            await axios.post(
                `${import.meta.env.VITE_BASE_URL}/imgstorage/imgsaveddb`,
                { imgstroage: imageUrl },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            removeImage();
            fetchImages();
            setMessage({ text: "Upload successful!", type: "success" });
        } catch (err) {
            console.log(err);
            
            setMessage({ text: "Upload failed. Please try again.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen overflow-y-scroll bg-[#FAFAFA] py-12 px-4 font-sans text-zinc-900">
            <div className="max-w-5xl mx-auto space-y-1">

                {/* Header Section */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Cloud Gallery</h1>
                    <p className="text-zinc-500 text-sm">Upload and manage your images in one place.</p>
                </div>

                {/* ================= UPLOAD CARD ================= */}
                <motion.div
                    layout
                    className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 max-w-lg mx-auto w-full"
                >
                    <AnimatePresence mode="wait">
                        {!preview ? (
                            <motion.label
                                key="dropzone"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="cursor-pointer border-2 border-dashed border-zinc-200 rounded-xl p-10 flex flex-col items-center justify-center gap-3 hover:border-zinc-950 hover:bg-zinc-50 transition-all group"
                            >
                                <input type="file" hidden onChange={handleUpload} />
                                <div className="p-3 bg-zinc-100 rounded-full group-hover:scale-110 transition-transform">
                                    <Upload className="text-zinc-600" size={24} />
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold text-zinc-800">Choose an image</p>
                                    <p className="text-xs text-zinc-400 mt-1">PNG, JPG, or GIF (Max 5MB)</p>
                                </div>
                            </motion.label>
                        ) : (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                className="space-y-4"
                            >
                                <div className="relative rounded-xl overflow-hidden border border-zinc-100 bg-zinc-50">
                                    <img src={preview} alt="preview" className="w-full h-64 object-contain" />
                                    <button onClick={removeImage} className="absolute top-2 right-2 p-1.5 bg-white shadow-md rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={uploadImage}
                                        disabled={loading}
                                        className="flex-1 bg-zinc-950 text-white py-3 rounded-xl font-bold hover:bg-zinc-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                                        {loading ? "Uploading..." : "Confirm Upload"}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {message.text && (
                        <div className={`mt-4 flex items-center justify-center gap-2 text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                            {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                            {message.text}
                        </div>
                    )}
                </motion.div>

                {/* ================= IMAGE GALLERY ================= */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                        <h3 className="text-xl font-bold">Your Gallery</h3>
                        <span className="bg-zinc-100 text-zinc-600 px-3 py-1 rounded-full text-xs font-bold">{images.length} Images</span>
                    </div>

                    {fetching ? (
                        <div className="flex flex-col items-center py-20 text-zinc-400">
                            <Loader2 className="animate-spin mb-2" size={32} />
                            <p className="text-sm">Retrieving your storage...</p>
                        </div>
                    ) : images.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-200 rounded-3xl bg-white">
                            <ImageIcon className="text-zinc-200 mb-4" size={48} />
                            <p className="text-zinc-400 text-sm italic">Gallery is empty</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {images.map((url, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ y: -5 }}
                                    className="group relative bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-hidden"
                                >
                                    <img src={url} alt={`stored-${index}`} className="h-44 w-full object-cover group-hover:scale-110 transition-transform duration-500" />

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <a
                                            href={url}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-white text-zinc-950 p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
                                        >
                                            <Download size={20} />
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageStorage;