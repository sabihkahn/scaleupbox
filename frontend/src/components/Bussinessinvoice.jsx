import React, { useRef, useState, useEffect } from "react";
import { Download, Plus, Trash2, FileText, ArrowLeft } from "lucide-react";

const BusinessInvoice = () => {
    const canvasRef = useRef(null);
    const [items, setItems] = useState([]);
    const [item, setItem] = useState({ name: "", qty: "", price: "" });

    const [invoice, setInvoice] = useState({
        businessName: "",
        address: "",
        issueDate: new Date().toISOString().split("T")[0],
        billTo: "",
        details: "",
        payment: "",
        tax: 0,
    });

    const subtotal = items.reduce((acc, i) => acc + i.qty * i.price, 0);
    const total = subtotal + Number(invoice.tax || 0);

    /* ================= CANVAS RENDER (A4 Ratio & High DPI) ================= */
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const dpi = 2;
        const width = 800;
        const height = 1132;

        canvas.width = width * dpi;
        canvas.height = height * dpi;
        ctx.scale(dpi, dpi);

        // Background
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, width, height);

        // Branding
        ctx.fillStyle = "#000";
        ctx.font = "bold 32px Helvetica";
        ctx.fillText(invoice.businessName.toUpperCase() || "BUSINESS NAME", 50, 80);

        ctx.font = "14px Helvetica";
        ctx.fillStyle = "#666";
        const addressLines = invoice.address.split("\n");
        addressLines.forEach((line, i) => ctx.fillText(line, 50, 105 + i * 18));

        // Header Meta
        ctx.fillStyle = "#000";
        ctx.font = "bold 12px Helvetica";
        ctx.fillText("INVOICE DATE", 600, 70);
        ctx.font = "14px Helvetica";
        ctx.fillText(invoice.issueDate, 600, 90);

        // Info Grid
        ctx.font = "bold 12px Helvetica";
        ctx.fillText("BILL TO", 50, 220);
        ctx.fillText("PAYMENT METHOD", 300, 220);
        ctx.fillText("NOTES", 550, 220);

        ctx.font = "13px Helvetica";
        ctx.fillStyle = "#444";
        ctx.fillText(invoice.billTo || "—", 50, 245);
        ctx.fillText(invoice.payment || "—", 300, 245);
        ctx.fillText(invoice.details || "—", 550, 245);

        // Table Header
        ctx.fillStyle = "#000";
        ctx.fillRect(50, 350, 700, 40);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 12px Helvetica";
        ctx.fillText("DESCRIPTION", 65, 375);
        ctx.fillText("QTY", 450, 375);
        ctx.fillText("PRICE", 550, 375);
        ctx.fillText("TOTAL", 670, 375);

        // Render Items
        ctx.fillStyle = "#000";
        let y = 420;
        items.forEach((it) => {
            ctx.font = "13px Helvetica";
            ctx.fillText(it.name, 65, y);
            ctx.fillText(it.qty.toString(), 450, y);
            ctx.fillText(`$${it.price}`, 550, y);
            ctx.fillText(`$${(it.qty * it.price).toFixed(2)}`, 670, y);

            ctx.strokeStyle = "#eee";
            ctx.beginPath();
            ctx.moveTo(50, y + 15);
            ctx.lineTo(750, y + 15);
            ctx.stroke();
            y += 40;
        });

        // Totals Section
        const totalY = Math.max(y + 50, 980);
        ctx.font = "14px Helvetica";
        ctx.fillText("Subtotal", 550, totalY);
        ctx.fillText(`$${subtotal.toFixed(2)}`, 670, totalY);

        ctx.fillText(`Tax`, 550, totalY + 25);
        ctx.fillText(`$${Number(invoice.tax).toFixed(2)}`, 670, totalY + 25);

        ctx.font = "bold 18px Helvetica";
        ctx.fillText("TOTAL DUE", 550, totalY + 65);
        ctx.fillText(`$${total.toFixed(2)}`, 670, totalY + 65);
    }, [invoice, items, subtotal, total]);

    const addItem = () => {
        if (item.name && item.qty && item.price) {
            setItems([...items, { ...item, qty: Number(item.qty), price: Number(item.price) }]);
            setItem({ name: "", qty: "", price: "" });
        }
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const downloadInvoice = () => {
        const link = document.createElement("a");
        link.download = `Invoice_${invoice.businessName || "Studio"}.png`;
        link.href = canvasRef.current.toDataURL("image/png");
        link.click();
    };

    return (
        <div className="overflow-y-scroll bg-white h-[70vh] grid lg:grid-cols-2">

            {/* LEFT: SCROLLABLE FORM */}
            <div className="  h-[70vh] p-6 md:p-0 border-r border-black flex flex-col  ">
                <div className="flex-1 space-y-10">
                    <header className="space-y-2">
                        <div className="flex items-center gap-2 text-black mb-2">
                            <FileText size={18} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Business Module</span>
                        </div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter italic">Studio Invoice.</h2>
                    </header>

                    <div className="space-y-8">
                        {/* BRANDING SECTION */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Company Name" placeholder="Agency Name"
                                onChange={(e) => setInvoice({ ...invoice, businessName: e.target.value })} />
                            <Input label="Date" type="date" value={invoice.issueDate}
                                onChange={(e) => setInvoice({ ...invoice, issueDate: e.target.value })} />
                        </div>

                        <Textarea label="Address" placeholder="Street, City, Zip"
                            onChange={(e) => setInvoice({ ...invoice, address: e.target.value })} />

                        {/* BILLING INFO */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input label="Bill To" placeholder="Client Name" onChange={(e) => setInvoice({ ...invoice, billTo: e.target.value })} />
                            <Input label="Payment" placeholder="Bank / PayPal" onChange={(e) => setInvoice({ ...invoice, payment: e.target.value })} />
                            <Input label="Tax ($)" type="number" onChange={(e) => setInvoice({ ...invoice, tax: e.target.value })} />
                        </div>

                        {/* ITEM CREATION */}
                        <div className="border-2 border-black p-5 space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <Plus size={12} /> Add Line Items
                            </h3>
                            <div className="flex flex-col md:grid md:grid-cols-12 gap-2">
                                <div className="md:col-span-6">
                                    <input placeholder="Item Description" className="studio-input"
                                        value={item.name} onChange={(e) => setItem({ ...item, name: e.target.value })} />
                                </div>
                                <div className="md:col-span-2">
                                    <input placeholder="Qty" type="number" className="studio-input"
                                        value={item.qty} onChange={(e) => setItem({ ...item, qty: e.target.value })} />
                                </div>
                                <div className="md:col-span-3">
                                    <input placeholder="Price" type="number" className="studio-input"
                                        value={item.price} onChange={(e) => setItem({ ...item, price: e.target.value })} />
                                </div>
                                <button onClick={addItem} className="md:col-span-1 bg-black text-white flex items-center justify-center h-11 hover:bg-gray-800 transition">
                                    <Plus size={20} />
                                </button>
                            </div>

                            {/* DYNAMIC LIST */}
                            <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto custom-scroll pr-2">
                                {items.map((it, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-100 group">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold uppercase">{it.name}</span>
                                            <span className="text-[10px] text-gray-400">Qty: {it.qty} × ${it.price}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-black">${(it.qty * it.price).toFixed(2)}</span>
                                            <button onClick={() => removeItem(idx)} className="text-gray-300 hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* STICKY FOOTER */}
                <div className="mt-2 pt-8 border-t-2 border-black sticky bottom-5 bg-white pb-6 z-10">
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Grand Total</span>
                        <span className="text-5xl font-black tracking-tighter">${total.toFixed(2)}</span>
                    </div>
                    <button onClick={downloadInvoice}
                        className="w-full bg-black text-white py-2 font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:invert transition-all active:scale-[0.98]">
                        <Download size={20} /> Export Invoice
                    </button>
                </div>
            </div>

            {/* RIGHT: PREVIEW (HIDDEN ON MOBILE) */}
            <div className="hidden lg:flex bg-gray-50 items-center justify-center p-12 sticky top-0 h-screen overflow-hidden">
                <div className="flex flex-col items-center">
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-6 tracking-[0.5em]">Live Preview</p>
                    <div className="shadow-[40px_40px_0px_0px_rgba(0,0,0,0.03)] border border-gray-200 bg-white scale-[0.85] origin-top">
                        <canvas ref={canvasRef} style={{ width: "450px", height: "636px" }} />
                    </div>
                </div>
            </div>

            <style>{`
        .studio-input {
          width: 100%; border: 1px solid #000; padding: 10px 14px;
          outline: none; font-size: 0.8rem; font-family: inherit;
        }
        .studio-input:focus { background: #fafafa; }
        .custom-scroll::-webkit-scrollbar { width: 3px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #000; }
        @media (max-width: 1024px) {
           .min-h-screen { height: auto !important; }
        }
      `}</style>
        </div>
    );
};

const Input = ({ label, ...props }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</label>
        <input {...props} className="border border-black px-4 py-3 outline-none focus:bg-gray-50 transition-colors text-sm" />
    </div>
);

const Textarea = ({ label, ...props }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</label>
        <textarea {...props} className="border border-black px-4 py-3 h-24 resize-none outline-none focus:bg-gray-50 transition-colors text-sm" />
    </div>
);

export default BusinessInvoice;