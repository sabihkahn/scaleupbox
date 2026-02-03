import React, { useRef, useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Download, ImagePlus } from "lucide-react";

const Cropimage = () => {
    const [crop, setCrop] = useState({
        unit: "px",
        width: 150,
        height: 150,
        x: 50,
        y: 50,
    });

    const [imageSrc, setImageSrc] = useState(null);

    const imageRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    const onCropComplete = (crop) => {
        if (!imageRef.current || !crop.width || !crop.height) return;

        const image = imageRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const pixelRatio = window.devicePixelRatio;

        canvas.width = crop.width * scaleX * pixelRatio;
        canvas.height = crop.height * scaleY * pixelRatio;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = "high";
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY
        );
    };

    const downloadImage = () => {
        const canvas = canvasRef.current;
        const link = document.createElement("a");
        link.download = "cropped-image.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => setImageSrc(reader.result);
        reader.readAsDataURL(file);
    };

    return (
        <div className="flex  flex-col items-center gap-6 p-3 bg-gray-50 min-h-screen overflow-y-scroll">

            {/* Upload Box */}
            <div
                onClick={() => fileInputRef.current.click()}
                className="cursor-pointer flex items-center gap-3 px-6 py-4 rounded-xl border-2 border-dashed border-gray-300 bg-white hover:border-black transition"
            >
                <ImagePlus className="w-6 h-6 text-gray-700" />
                <span className="text-gray-700 font-medium">
                    Click to upload image
                </span>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />
            </div>

            {/* Cropper */}
            {imageSrc && (
                <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={onCropComplete}
                >
                    <img
                        ref={imageRef}
                        src={imageSrc}
                        alt="Crop source"
                        className="h-[70vh] rounded-lg"
                    />
                </ReactCrop>
            )}

            <canvas ref={canvasRef} className="hidden" />

            {/* Download Button */}
            {imageSrc && (
                <button
                    onClick={downloadImage}
                    className="flex items-center gap-2 px-6 py-3 bg-black text-white text-lg rounded-lg hover:bg-gray-900 transition"
                >
                    <Download className="w-5 h-5" />
                    Download
                </button>
            )}
        </div>
    );
};

export default Cropimage;
