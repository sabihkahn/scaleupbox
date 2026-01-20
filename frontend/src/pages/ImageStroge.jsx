import React, { useEffect, useState } from "react";
import axios from "axios";
import { uploadphoto } from "../cloudinary/Cloudinary";

const ImageStorage = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false); // uploading state
    const [fetching, setFetching] = useState(false); // fetching images
    const [message, setMessage] = useState(""); // success/error

    const token = localStorage.getItem("token");

    /* ===========================
       FETCH SAVED IMAGES
       =========================== */
    const fetchImages = async () => {
        try {
            setFetching(true);
            setMessage("");
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/imgstorage/getimgsaveddb`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setImages(res.data.imgstroage || []);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message == "Token has expired" || err.response.data.message == "user authorizatrion failed" || err.response.data.message == "Request failed with status code 400") {
              window.location.reload()
                console.error(err);
            
            }
            
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    /* ===========================
       HANDLE FILE SELECTION
       =========================== */
    const handleUpload = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        if (!selected.type.startsWith("image/")) {
            setMessage("❌ Only image files are allowed");
            return;
        }

        setFile(selected);
        setPreview(URL.createObjectURL(selected));
        setMessage("");
    };

    const removeImage = () => {
        setFile(null);
        setPreview("");
        setMessage("");
    };

    /* ===========================
       UPLOAD IMAGE FLOW
       =========================== */
    const uploadImage = async () => {
        if (!file) {
            setMessage("❌ Please select an image before uploading.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            // 1️⃣ Upload to Cloudinary
            const imageUrl = await uploadphoto(file);

            // 2️⃣ Save URL to backend (DB + Redis)
            await axios.post(
                `${import.meta.env.VITE_BASE_URL}/imgstorage/imgsaveddb`,
                { imgstroage: imageUrl },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // 3️⃣ Clear selection & refresh gallery
            removeImage();
            fetchImages();

            setMessage("✅ Image uploaded successfully!");
        } catch (err) {
            console.error(err);
            setMessage("❌ Error uploading image. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-6xl mx-auto flex flex-col gap-10">

                {/* ================= UPLOAD CARD ================= */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 max-w-md mx-auto w-full">
                    <h2 className="text-2xl font-semibold text-center mb-4">
                        Image Storage
                    </h2>

                    {/* FILE INPUT */}
                    {!preview && (
                        <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center gap-2 hover:border-gray-400 transition">
                            <input type="file" hidden onChange={handleUpload} />
                            <p className="font-medium text-gray-700">Click to upload image</p>
                            <span className="text-sm text-gray-400">PNG / JPG supported</span>
                        </label>
                    )}

                    {/* PREVIEW */}
                    {preview && (
                        <div className="flex flex-col items-center gap-4">
                            <img
                                src={preview}
                                alt="preview"
                                className="w-full h-52 object-contain bg-gray-50 border rounded-lg"
                            />

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={uploadImage}
                                    disabled={loading}
                                    className="flex-1 bg-black text-white py-2 rounded-md hover:bg-gray-900 transition disabled:opacity-60"
                                >
                                    {loading ? "Uploading..." : "Upload"}
                                </button>

                                <button
                                    onClick={removeImage}
                                    className="flex-1 bg-gray-200 text-black py-2 rounded-md hover:bg-gray-300 transition"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    )}

                    {/* MESSAGE */}
                    {message && (
                        <p
                            className={`text-center text-sm mt-3 ${message.startsWith("✅") ? "text-green-600" : "text-red-500"
                                }`}
                        >
                            {message}
                        </p>
                    )}
                </div>

                {/* ================= IMAGE GALLERY ================= */}
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Saved Images</h3>

                    {fetching ? (
                        <p className="text-gray-500">Loading images...</p>
                    ) : images.length === 0 ? (
                        <p className="text-gray-500">No images uploaded yet</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {images.map((url, index) => (
                                <div
                                    key={index}
                                    className="bg-white border border-gray-200 rounded-lg shadow-sm p-2 flex flex-col gap-2"
                                >
                                    <img
                                        src={url}
                                        alt={`stored-${index}`}
                                        className="h-40 w-full object-cover rounded-md"
                                    />

                                    <a
                                        href={url}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-center bg-black text-white py-1.5 rounded-md text-sm hover:bg-gray-900 transition"
                                    >
                                        Download
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageStorage;
