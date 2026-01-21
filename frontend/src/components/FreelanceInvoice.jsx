import React, { useRef, useState, useEffect } from "react";
import invoice23 from "../assets/invoice.png";

const FreelanceInvoice = () => {
  const canvasRef = useRef(null);

  /* ================= STATE ================= */

  const [freelancer, setFreelancer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [payment, setPayment] = useState({
    method: "",
    bank: "",
    branch: "",
    reference: "",
  });

  const [items, setItems] = useState([]);

  const [item, setItem] = useState({
    service: "",
    description: "",
    qty: 0,        // FIXED
    price: 0,      // FIXED
  });

  const subtotal = items.reduce(
    (acc, i) => acc + Number(i.qty) * Number(i.price),
    0
  );

  /* ================= CANVAS ================= */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpi = window.devicePixelRatio || 1;

    const width = 900;
    const height = 1200;

    canvas.width = width * dpi;
    canvas.height = height * dpi;
    canvas.style.width = "100%";
    canvas.style.height = "auto";

    ctx.setTransform(dpi, 0, 0, dpi, 0, 0);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#000";

    /* Freelancer */
    ctx.font = "22px Arial";
    ctx.fillText(freelancer.name || "Freelancer Name", 40, 50);

    ctx.font = "14px Arial";
    ctx.fillText(freelancer.email || "", 40, 75);
    ctx.fillText(freelancer.phone || "", 40, 95);
    ctx.fillText(freelancer.address || "", 40, 115);

    /* Customer */
    ctx.font = "18px Arial";
    ctx.fillText("Bill To:", 40, 170);

    ctx.font = "14px Arial";
    ctx.fillText(customer.name || "", 40, 195);
    ctx.fillText(customer.email || "", 40, 215);
    ctx.fillText(customer.phone || "", 40, 235);
    ctx.fillText(customer.address || "", 40, 255);

    /* Table Header */
    let y = 320;
    ctx.font = "16px Arial";
    ctx.fillText("Service", 40, y);
    ctx.fillText("Description", 220, y);
    ctx.fillText("Qty", 520, y);
    ctx.fillText("Price", 600, y);
    ctx.fillText("Amount", 700, y);

    y += 30;
    ctx.font = "14px Arial";

    items.forEach((i) => {
      ctx.fillText(i.service, 40, y);
      ctx.fillText(i.description.slice(0, 40), 220, y); // SAFE
      ctx.fillText(String(i.qty), 520, y);
      ctx.fillText(`$${i.price}`, 600, y);
      ctx.fillText(`$${i.qty * i.price}`, 700, y);
      y += 28;
    });

    /* Totals & Payment */
    y += 40;
    ctx.font = "16px Arial";
    ctx.fillText(`Subtotal: $${subtotal}`, 600, y);

    ctx.font = "14px Arial";
    y += 30;
    ctx.fillText(`Payment Method: ${payment.method || ""}`, 40, y);
    y += 20;
    ctx.fillText(`Bank: ${payment.bank || ""}`, 40, y);
    y += 20;
    ctx.fillText(`Branch: ${payment.branch || ""}`, 40, y);
    y += 20;
    ctx.fillText(`Reference: ${payment.reference || ""}`, 40, y);
  }, [freelancer, customer, items, payment, subtotal]);

  /* ================= DOWNLOAD ================= */

  const downloadInvoice = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "invoice.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  /* ================= UI ================= */

  return (
    <div className="h-[70vh] overflow-hidden bg-gray-100 p-4">
      <div className="h-full bg-white rounded-xl shadow-lg grid lg:grid-cols-2 gap-6 p-4">

        {/* FORM (SCROLLABLE) */}
        <div className="h-full overflow-y-auto pr-2 space-y-6">
          <Section title="Freelancer Information">
            <Input label="Name" onChange={e => setFreelancer({ ...freelancer, name: e.target.value })} />
            <Input label="Email" onChange={e => setFreelancer({ ...freelancer, email: e.target.value })} />
            <Input label="Phone" onChange={e => setFreelancer({ ...freelancer, phone: e.target.value })} />
            <Textarea label="Address" onChange={e => setFreelancer({ ...freelancer, address: e.target.value })} />
          </Section>

          <Section title="Customer Information">
            <Input label="Name" onChange={e => setCustomer({ ...customer, name: e.target.value })} />
            <Input label="Email" onChange={e => setCustomer({ ...customer, email: e.target.value })} />
            <Input label="Phone" onChange={e => setCustomer({ ...customer, phone: e.target.value })} />
            <Textarea label="Address" onChange={e => setCustomer({ ...customer, address: e.target.value })} />
          </Section>

          <Section title="Services">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <Input placeholder="Service" value={item.service}
                onChange={e => setItem({ ...item, service: e.target.value })} />
              <Input placeholder="Description" value={item.description}
                onChange={e => setItem({ ...item, description: e.target.value })} />
              <Input type="number" placeholder="Qty" value={item.qty}
                onChange={e => setItem({ ...item, qty: Number(e.target.value) })} />
              <Input type="number" placeholder="Price" value={item.price}
                onChange={e => setItem({ ...item, price: Number(e.target.value) })} />
            </div>

            <button
              onClick={() => {
                if (item.service && item.qty > 0 && item.price > 0) {
                  setItems([...items, item]);
                  setItem({ service: "", description: "", qty: 0, price: 0 });
                }
              }}
              className="bg-black text-white px-4 py-2 mt-2"
            >
              Add Service
            </button>
          </Section>

          <Section title="Payment Information">
            <Input label="Payment Method" onChange={e => setPayment({ ...payment, method: e.target.value })} />
            <Input label="Bank Name" onChange={e => setPayment({ ...payment, bank: e.target.value })} />
            <Input label="Branch" onChange={e => setPayment({ ...payment, branch: e.target.value })} />
            <Input label="Reference No" onChange={e => setPayment({ ...payment, reference: e.target.value })} />
          </Section>

          <button
            onClick={downloadInvoice}
            className="w-full bg-black text-white py-3 rounded"
          >
            Download Invoice
          </button>
        </div>

        {/* PREVIEW */}
        <div className="h-full border-4 border-black rounded flex items-center justify-center overflow-hidden">
          <div className="lg:hidden text-center text-gray-600">
            <p className="mb-3">Preview available on desktop</p>
            <img src={invoice23} className="max-w-full rounded" alt="Invoice preview" />
          </div>

          <div className="hidden lg:flex w-full h-full justify-center overflow-auto">
            <canvas ref={canvasRef} className="max-h-full w-full" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default FreelanceInvoice;

/* ================= COMPONENTS ================= */

const Section = ({ title, children }) => (
  <div className="border rounded p-4 space-y-3">
    <h3 className="font-semibold">{title}</h3>
    {children}
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm text-gray-600">{label}</label>}
    <input {...props} className="border px-3 py-2 rounded outline-none" />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm text-gray-600">{label}</label>}
    <textarea {...props} className="border px-3 py-2 h-24 rounded resize-none outline-none" />
  </div>
);
