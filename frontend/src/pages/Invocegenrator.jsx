import React, { useState } from "react"
import { motion } from "framer-motion"
import { Briefcase, Laptop, User, Building2 } from "lucide-react"
motion
import Bussinessinvoice from "../components/Bussinessinvoice"


const Invocegenrator = () => {
  const [currentInvoice, setCurrentInvoice] = useState(null)

  return (
    <div className="min-h-screen bg-white flex   px-4">
      <div className="w-full max-w-6xl">

        {/* ================= BUSINESS ================= */}
        {currentInvoice === "business" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-black p-6"
          >
            <Header
              title="Business Invoice"
              back={() => setCurrentInvoice(null)}
            />

            {/* IMPORTANT: no fixed height, no flex center */}
            <Bussinessinvoice />

          </motion.div>

        ) : currentInvoice === "freelance" ? (

          /* ================= FREELANCE ================= */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-black p-8"
          >
            <Header title="Freelance Invoice" back={() => setCurrentInvoice(null)} />

            <div className="h-56 border border-dashed flex items-center justify-center text-gray-500">
              Freelance invoice form here
            </div>
          </motion.div>

        ) : currentInvoice === "personal" ? (

          /* ================= PERSONAL ================= */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-black p-8"
          >
            <Header title="Personal Invoice" back={() => setCurrentInvoice(null)} />

            <div className="h-56 border border-dashed flex items-center justify-center text-gray-500">
              Personal invoice form here
            </div>
          </motion.div>

            ) : currentInvoice === "rental" ? (

              /* ================= RENTAL ================= */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-black   p-8"
              >
                <Header title="Personal Invoice" back={() => setCurrentInvoice(null)} />

                <div className="h-56 border border-dashed flex items-center justify-center text-gray-500">
                  rental invoice form here
                </div>
              </motion.div>

            ) : (

          /* ================= MAIN SELECTION ================= */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >

            <InvoiceBox
              label="Business"
              icon={<Briefcase size={30} />}
              onClick={() => setCurrentInvoice("business")}
            />

            <InvoiceBox
              label="Freelance"
              icon={<Laptop size={30} />}
              onClick={() => setCurrentInvoice("freelance")}
            />

            <InvoiceBox
              label="Personal"
              icon={<User size={30} />}
              onClick={() => setCurrentInvoice("personal")}
            />
                  <InvoiceBox
                    label="Rental"
                    icon={<User size={30} />}
                    onClick={() => setCurrentInvoice("rental")}
                  />
      

          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Invocegenrator

/* ================= REUSABLE PARTS ================= */

const InvoiceBox = ({ label, icon, onClick }) => (
  <motion.button
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className="
      aspect-square
      border border-black
      bg-white
      flex flex-col items-center justify-center
      gap-4
      text-black
      hover:bg-black hover:text-white
      transition
      font-medium
    "
  >
    {icon}
    <span className="text-sm">{label} Invoice</span>
  </motion.button>
)

const Header = ({ title, back }) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-semibold text-black">{title}</h2>
    <button
      onClick={back}
      className="px-5 py-2 bg-black text-white text-sm hover:bg-gray-800 transition"
    >
      Back
    </button>
  </div>
)
