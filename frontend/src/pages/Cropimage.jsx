import React, { useRef, useState } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Download, ImagePlus, Crop as CropIcon, RotateCcw, Maximize } from "lucide-react";

const Cropimage = () => {
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState();
    const [aspect, setAspect] = useState(1);

    const imageRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;
        const initialCrop = centerCrop(
            makeAspectCrop({ unit: "%", width: 90 }, aspect, width, height),
            width,
            height
        );
        setCrop(initialCrop);
    };

    const onCropComplete = (pixelCrop) => {
        if (!imageRef.current || !pixelCrop.width || !pixelCrop.height) return;
        const image = imageRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const pixelRatio = window.devicePixelRatio || 1;

        canvas.width = pixelCrop.width * scaleX * pixelRatio;
        canvas.height = pixelCrop.height * scaleY * pixelRatio;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(
            image,
            pixelCrop.x * scaleX,
            pixelCrop.y * scaleY,
            pixelCrop.width * scaleX,
            pixelCrop.height * scaleY,
            0, 0,
            pixelCrop.width * scaleX,
            pixelCrop.height * scaleY
        );
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setImageSrc(reader.result);
        reader.readAsDataURL(file);
    };

    const downloadImage = () => {
        const canvas = canvasRef.current;
        const link = document.createElement("a");
        link.download = "studio-crop.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    return (
        <div className="flex flex-col h-screen bg-white text-black overflow-hidden">
            {/* HEADER: Compact for mobile */}
            <header className="p-4 md:p-6 border-b border-black flex items-center justify-between bg-white z-10">
                <div>
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter italic">Studio Crop.</h2>
                </div>

                {imageSrc && (
                    <button
                        onClick={downloadImage}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:invert transition"
                    >
                        <Download size={14} /> <span className="hidden sm:inline">Download</span>
                    </button>
                )}
            </header>

            <main className="flex-1 flex flex-col lg:grid lg:grid-cols-12 overflow-hidden">

                {/* WORKSPACE: Centered scrolling area */}
                <div className="flex-1 lg:col-span-8 bg-gray-50 p-4 md:p-10 overflow-auto flex items-center justify-center custom-scroll">
                    {!imageSrc ? (
                        <div
                            onClick={() => fileInputRef.current.click()}
                            className="w-full max-w-md aspect-square md:aspect-video border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-black transition-all p-6 text-center"
                        >
                            <div className="p-4 bg-black text-white rounded-full">
                                <ImagePlus size={28} />
                            </div>
                            <div>
                                <p className="font-black uppercase tracking-widest text-xs">Tap to Upload</p>
                                <p className="text-[10px] text-gray-400 mt-1 uppercase">Supports JPG, PNG, WEBP</p>
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </div>
                    ) : (
                        <div className="max-w-full inline-block shadow-[15px_15px_0px_0px_rgba(0,0,0,0.05)] border border-black bg-white">
                            <ReactCrop
                                crop={crop}
                                onChange={(c) => setCrop(c)}
                                onComplete={onCropComplete}
                                aspect={aspect}
                            >
                                <img
                                    ref={imageRef}
                                    src={imageSrc}
                                    alt="Source"
                                    onLoad={onImageLoad}
                                    className="max-w-full max-h-[60vh] lg:max-h-[75vh] object-contain"
                                />
                            </ReactCrop>
                        </div>
                    )}
                </div>

                {/* CONTROLS: Bottom bar on mobile, Sidebar on desktop */}
                <aside className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-black bg-white p-6 md:p-8 flex flex-col gap-6">
                    <div className="flex flex-row lg:flex-col gap-4">
                        <button
                            onClick={() => setAspect(aspect === 1 ? undefined : 1)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 border border-black text-[10px] font-black uppercase tracking-widest transition-all ${aspect === 1 ? 'bg-black text-white' : 'bg-white text-black'}`}
                        >
                            <Maximize size={14} /> {aspect === 1 ? "1:1 Ratio" : "Free Form"}
                        </button>

                        <button
                            onClick={() => setImageSrc(null)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 border border-black text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-500 transition-all"
                        >
                            <RotateCcw size={14} /> <span className="hidden lg:inline">Reset Canvas</span><span className="lg:hidden">Reset</span>
                        </button>
                    </div>

                    <div className="hidden lg:block space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2 flex items-center gap-2">
                            <CropIcon size={12} /> Dimensions
                        </h3>
                        <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                            <div className="bg-gray-50 p-3 border border-gray-100">
                                <span className="block text-[9px] text-gray-400 uppercase font-sans">Width</span>
                                {Math.round(crop?.width || 0)}px
                            </div>
                            <div className="bg-gray-50 p-3 border border-gray-100">
                                <span className="block text-[9px] text-gray-400 uppercase font-sans">Height</span>
                                {Math.round(crop?.height || 0)}px
                            </div>
                        </div>
                    </div>

                    <canvas ref={canvasRef} className="hidden" />

                    <p className="hidden lg:block text-[9px] leading-relaxed text-gray-400 font-medium pt-4">
                        Use the handles on the image to adjust your selection. Final export is high-DPI for professional use.
                    </p>
                </aside>
            </main>

            <style>{`
        .custom-scroll::-webkit-scrollbar { width: 3px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #000; }
        .ReactCrop { max-width: 100%; }
        .ReactCrop__crop-selection { border: 2px solid #000 !important; box-shadow: 0 0 0 9999em rgba(255, 255, 255, 0.5) !important; }
        .ReactCrop__drag-handle::after { background-color: #000 !important; border: 1px solid #fff !important; width: 10px !important; height: 10px !important; }
      `}</style>
        </div>
    );
};

export default Cropimage;