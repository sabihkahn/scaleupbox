import React, { useRef, useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import src from "../assets/alien.png";
import { Download } from "lucide-react";

const Cropimage = () => {
    const [crop, setCrop] = useState({
        unit: "px",
        width: 150,
        height: 150,
        x: 50,
        y: 50,
    });

    const imageRef = useRef(null);
    const canvasRef = useRef(null);

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

    return (
        <div className="flex flex-col items-center p-10">
            <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={onCropComplete}
            >
                <img ref={imageRef} src={src} alt="Crop source" />
            </ReactCrop>

            <canvas ref={canvasRef} className="hidden" />

            <button
                onClick={downloadImage}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white text-lg mt-4 rounded"
            >
                <Download /> Download
            </button>
        </div>
    );
};

export default Cropimage;
