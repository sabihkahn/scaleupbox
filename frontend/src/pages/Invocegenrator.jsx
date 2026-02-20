import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
motion
import { Briefcase, Laptop, User, ArrowLeft, Plus } from "lucide-react";
import Bussinessinvoice from "../components/Bussinessinvoice";
import FreelanceInvoice from "../components/FreelanceInvoice";
import RentalInvoice from "../components/RentalInvoice";

const InvoiceGenerator = () => {
  const [currentInvoice, setCurrentInvoice] = useState(null);

  return (
    <div className="h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
  

      <main className="max-w-7xl overflow-y-scroll mx-auto px-6  md:py-3">
        <AnimatePresence mode="wait">
          {!currentInvoice ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              <div className="max-w-2xl">
                <h2 className="text-5xl font-bold tracking-tight mb-4">Invoice Generator</h2>
                <p className="text-gray-500 text-lg">Select a template to begin crafting your professional invoice.</p>
              </div>

              <div className="overflow-y-scroll grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <InvoiceBox
                  className="flex-1 overflow-y-scroll"
                  label="Business"
                  description="For registered companies and corporate billing."
                  icon={<Briefcase size={28} />}
                  onClick={() => setCurrentInvoice("business")}
                />
                <InvoiceBox
                  label="Freelance"
                  description="Tailored for independent contractors and creators."
                  icon={<Laptop size={28} />}
                  onClick={() => setCurrentInvoice("freelance")}
                />
                <InvoiceBox
                  label="Rental"
                  description="Simple billing for property owners and tenants."
                  icon={<User size={28} />}
                  onClick={() => setCurrentInvoice("rental")}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="editor"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <Header
                title={`${currentInvoice.charAt(0).toUpperCase() + currentInvoice.slice(1)} Invoice`}
                back={() => setCurrentInvoice(null)}
              />

              <div className="border-[1.5px] border-black p-4 md:p-10 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                {currentInvoice === "business" && <Bussinessinvoice />}
                {currentInvoice === "freelance" && <FreelanceInvoice />}
                {currentInvoice === "rental" && <RentalInvoice />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const InvoiceBox = ({ label, description, icon, onClick }) => (
  <motion.button
    whileHover={{ y: -5, boxShadow: "0px 10px 0px 0px rgba(0,0,0,1)" }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="
      group
      w-full text-left
      border-2 border-black
      p-8
      bg-white
      flex flex-col gap-6
      transition-all duration-300
    "
  >
    <div className="p-3 bg-black text-white w-fit rounded-lg group-hover:rotate-12 transition-transform">
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">{label}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest mt-auto group-hover:translate-x-2 transition-transform">
      Select Template <Plus size={14} />
    </div>
  </motion.button>
);

const Header = ({ title, back }) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-black">
    <div>
      <button
        onClick={back}
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-4 hover:gap-4 transition-all"
      >
        <ArrowLeft size={16} /> Back to dashboard
      </button>
      <h2 className="text-4xl font-black uppercase tracking-tighter">{title}</h2>
    </div>

    <div className="flex gap-3">
      {/* Placeholder for any additional actions like "Save Draft" */}
      <button
        onClick={back}
        className="px-8 py-3 bg-black text-white font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors shadow-[4px_4px_0px_0px_rgba(150,150,150,1)]"
      >
        Close Editor
      </button>
    </div>
  </div>
);

export default InvoiceGenerator;