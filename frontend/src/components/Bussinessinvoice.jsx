import React, { useRef, useState, useEffect } from "react";
import invoice23 from '../assets/invoice.png'


const Bussinessinvoice = () => {
    const canvasRef = useRef(null);

    const [items, setItems] = useState([]);
    const [item, setItem] = useState({ name: "", qty: "", price: "" });

    const [invoice, setInvoice] = useState({
        businessName: "",
        address: "",
        issueDate: "",
        billTo: "",
        details: "",
        dueDate: "",
        payment: "",
        tax: 0,
    });

    const subtotal = items.reduce((acc, i) => acc + i.qty * i.price, 0);
    const total = subtotal + Number(invoice.tax || 0);

    /* ================= CANVAS RENDER ================= */
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const dpi = window.devicePixelRatio || 1;
        const width = 900;
        const height = 1200;

        canvas.width = width * dpi;
        canvas.height = height * dpi;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpi, dpi);

        // Background
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, width, height);

        // Header
        ctx.fillStyle = "#000";
        ctx.font = "24px Arial";
        ctx.fillText(invoice.businessName || "Business Name", 40, 60);

        ctx.font = "14px Arial";
        ctx.fillText(invoice.address, 40, 90);
        ctx.fillText(`Issue Date: ${invoice.issueDate}`, 650, 60);

        // Bill To, Details, Payment
        ctx.font = "18px Arial";
        ctx.fillText("Bill To", 40, 150);
        ctx.font = "14px Arial";
        ctx.fillText(invoice.billTo, 40, 180);

        ctx.fillText("Details", 40, 230);
        ctx.fillText(invoice.details,40, 270);

        ctx.fillText("Payment", 450, 150);
        ctx.fillText(invoice.payment, 450, 180);

        // Items Table
        let y = 460;
        ctx.font = "16px Arial";
        ctx.fillText("Item", 40, y);
        ctx.fillText("Qty", 500, y);
        ctx.fillText("Price", 580, y);
        ctx.fillText("Amount", 680, y);

        y += 30;
        ctx.font = "14px Arial";

        items.forEach((i) => {
            ctx.fillText(i.name, 40, y);
            ctx.fillText(i.qty, 500, y);
            ctx.fillText(i.price, 580, y);
            ctx.fillText(i.qty * i.price, 680, y);
            y += 30;
        });

        ctx.fillText(`Subtotal: $${subtotal}`, 600, y + 40);
        ctx.fillText(`Tax: $${invoice.tax}`, 600, y + 70);
        ctx.font = "16px Arial";
        ctx.fillText(`Total Due: $${total}`, 600, y + 110);
       
    }, [invoice, items]);

    const downloadInvoice = () => {
        const link = document.createElement("a");
        link.download = "invoice.png";
        link.href = canvasRef.current.toDataURL();
        link.click();
    };

    return (
        <div className="bg-white min-h-screen p-6 grid lg:grid-cols-2 gap-8">

            {/* ================= FORM ================= */}
            <div className="space-y-6">

                {/* BUSINESS INFO */}
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Business Name"
                        onChange={(e) => setInvoice({ ...invoice, businessName: e.target.value })}
                    />
                    <Input
                        label="Issue Date"
                        type="date"
                        onChange={(e) => setInvoice({ ...invoice, issueDate: e.target.value })}
                    />
                </div>

                <Input
                    label="Address"
                    onChange={(e) => setInvoice({ ...invoice, address: e.target.value })}
                />

                {/* THREE COLUMN SECTION */}
                <div className="grid lg:grid-cols-3 gap-4">
                    <Textarea
                        label="Bill To"
                        onChange={(e) => setInvoice({ ...invoice, billTo: e.target.value })}
                    />
                    <Textarea
                        label="Details"
                        onChange={(e) => setInvoice({ ...invoice, details: e.target.value })}
                    />
                    <Textarea
                        label="Payment"
                        onChange={(e) => setInvoice({ ...invoice, payment: e.target.value })}
                    />
                </div>

                {/* ADD ITEMS */}
                <div className="border p-4 space-y-4">
                    <h3 className="font-semibold">Items</h3>

                    <div className="grid grid-cols-3 gap-3">
                        <Input
                            placeholder="Item name"
                            onChange={(e) => setItem({ ...item, name: e.target.value })}
                            value={item.name}
                        />
                        <Input
                            placeholder="Qty"
                            type="number"
                            onChange={(e) => setItem({ ...item, qty: Number(e.target.value) })}
                            value={item.qty}
                        />
                        <Input
                            placeholder="Price"
                            type="number"
                            onChange={(e) => setItem({ ...item, price: Number(e.target.value) })}
                            value={item.price}
                        />
                    </div>

                    <button
                        onClick={() => {
                            if (item.name && item.qty && item.price) {
                                setItems([...items, item]);
                                setItem({ name: "", qty: "", price: "" });
                            }
                        }}
                        className="bg-black text-white px-4 py-2"
                    >
                        Add Item
                    </button>
                </div>

                <div className="flex justify-between font-medium">
                    <span>Total Due</span>
                    <span>${total}</span>
                </div>

                <button
                    onClick={downloadInvoice}
                    className="w-full bg-black text-white py-3"
                >
                    Download Invoice
                </button>
            </div>

            <div className="border-4 h-[70vh] border-black p-4 flex flex-col items-center">
                {/* Text shown only on small screens */}
                <div className="block lg:hidden text-center text-gray-700 mb-2">
                    You can download your invoice by clicking the button above
                </div>
                <div className=" flex flex-col text-center text-gray-700 mb-2">
                    You can download your invoice by clicking the download button
                    your inoice will look like this 
                    <img className="p-5" src={invoice23} alt="" />
                </div>
                {/* Canvas shown on all screens, responsive */}
                <div className="hidden w-full sm:hidden max-w-[200px] overflow-auto">
                    <canvas
                        ref={canvasRef}
                        className="w-full h-[40vh] border"
                    />
                </div>
            </div>


        </div>
    );
};

export default Bussinessinvoice;

/* ================= SMALL COMPONENTS ================= */

const Input = ({ label, ...props }) => (
    <div className="flex flex-col gap-1">
        {label && <label className="text-sm text-gray-600">{label}</label>}
        <input
            {...props}
            className="border px-3 py-2 outline-none"
        />
    </div>
);

const Textarea = ({ label, ...props }) => (
    <div className="flex flex-col gap-1">
        {label && <label className="text-sm text-gray-600">{label}</label>}
        <textarea
            {...props}
            className="border px-3 py-2 h-28 resize-none outline-none"
        />
    </div>
);
