import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";

const PdfMerger = () => {
    const [files, setFiles] = useState([]);
    const [mergedPdfUrl, setMergedPdfUrl] = useState(null);

    // Handle selected files
    const handleFiles = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
        setMergedPdfUrl(null); // reset preview when new files selected
    };

    // Merge PDFs
    const mergePdfs = async () => {
        if (files.length === 0) {
            alert("Please select PDFs first");
            return;
        }

        try {
            const mergedPdf = await PDFDocument.create();

            for (let file of files) {
                const arrayBuffer = await file.arrayBuffer(); // important
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const mergedBytes = await mergedPdf.save();
            const blob = new Blob([mergedBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setMergedPdfUrl(url);
        } catch (err) {
            console.error("PDF Merge Error:", err);
            alert("Failed to merge PDFs. Check console for details.");
        }
    };

    // Download merged PDF
    const downloadPdf = () => {
        if (!mergedPdfUrl) return;
        const link = document.createElement("a");
        link.href = mergedPdfUrl;
        link.download = "merged.pdf";
        link.click();
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center p-6 gap-6">
            {/* Upload */}
            <label className="w-full max-w-lg p-6 border-4 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-black transition text-center">
                <input
                    type="file"
                    accept="application/pdf"
                    multiple
                    className="hidden"
                    onChange={handleFiles}
                />
                <p className="text-lg font-semibold">Click to select PDF files</p>
                <p className="text-sm text-gray-500">or drag & drop here</p>
            </label>

            {/* Selected files preview */}
            {files.length > 0 && (
                <div className="flex flex-wrap gap-4 max-w-lg w-full">
                    {files.map((file, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 w-full"
                        >
                            <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded">
                                📄
                            </div>
                            <span className="text-sm truncate">{file.name}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Merge & Download buttons */}
            {files.length > 0 && (
                <div className="flex gap-4 flex-wrap">
                    <button
                        onClick={mergePdfs}
                        className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
                    >
                        Merge PDFs
                    </button>
                    {mergedPdfUrl && (
                        <button
                            onClick={downloadPdf}
                            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
                        >
                            Download Merged PDF
                        </button>
                    )}
                </div>
            )}

            {/* Preview merged PDF */}
            {mergedPdfUrl && (
                <iframe
                    src={mergedPdfUrl}
                    title="Merged PDF Preview"
                    className="w-full max-w-4xl h-[600px] border rounded shadow-lg mt-4"
                />
            )}
        </div>
    );
};

export default PdfMerger;
