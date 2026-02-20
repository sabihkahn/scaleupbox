import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, User, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
motion
const BASE_URL = import.meta.env.VITE_BASE_URL;

const SaveClientData = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: ""
    });

    const token = localStorage.getItem("token");

    const fetchClients = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/client/get-clients?page=1`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClients(res.data.clientInfos || []);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleAddClient = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await axios.post(`${BASE_URL}/client/add-client`, form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update UI with the new client from response
            setClients((prev) => [res.data, ...prev]);
            setForm({ name: "", email: "", phone: "", address: "" });
        } catch (err) {
            console.error("Add error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/client/delete-client?clientId=${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClients((prev) => prev.filter((c) => c._id !== id));
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    return (
        <div className="min-h-screen overflow-y-scroll p-6 bg-[#FAFAFA] text-zinc-900 font-sans selection:bg-zinc-200">
            <div className="max-w-6xl mx-auto px-4 py-12 md:px-8">
                
                {/* --- HEADER --- */}
                <header className="mb-12">
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-bold tracking-tight text-zinc-950"
                    >
                        Client Directory
                    </motion.h1>
                    <p className="text-zinc-500 mt-2">Manage your customer relationships and contact data.</p>
                </header>

                {/* --- FORM SECTION --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-zinc-200 rounded-2xl p-6 mb-12 shadow-sm"
                >
                    <form onSubmit={handleAddClient} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium uppercase tracking-wider text-zinc-500 ml-1">Full Name</label>
                                <input
                                    className="w-full border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-950/5 transition-all"
                                    placeholder="John Doe"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium uppercase tracking-wider text-zinc-500 ml-1">Email Address</label>
                                <input
                                    className="w-full border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-950/5 transition-all"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium uppercase tracking-wider text-zinc-500 ml-1">Phone</label>
                                <input
                                    className="w-full border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-950/5 transition-all"
                                    placeholder="+1 (555) 000-0000"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium uppercase tracking-wider text-zinc-500 ml-1">Address</label>
                                <input
                                    className="w-full border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-950/5 transition-all"
                                    placeholder="City, Country"
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isSubmitting}
                            type="submit"
                            className="w-full bg-zinc-950 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors disabled:opacity-70"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                            {isSubmitting ? "Adding..." : "Add Client"}
                        </motion.button>
                    </form>
                </motion.div>

                {/* --- CLIENT LIST --- */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                        <Loader2 className="animate-spin mb-4" size={32} />
                        <p className="animate-pulse">Retrieving clients...</p>
                    </div>
                ) : (
                    <motion.div 
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {clients.length > 0 ? (
                                clients.map((client) => (
                                    <motion.div
                                        key={client._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="group bg-white border border-zinc-200 rounded-2xl p-5 flex flex-col justify-between hover:border-zinc-400 hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-300"
                                    >
                                        <div>
                                            <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-zinc-950 group-hover:text-white transition-colors">
                                                <User size={20} />
                                            </div>
                                            <h2 className="text-lg font-bold text-zinc-950 mb-3 truncate">
                                                {client.name}
                                            </h2>
                                            
                                            <div className="space-y-2 mb-6">
                                                <div className="flex items-center gap-2 text-sm text-zinc-500">
                                                    <Mail size={14} />
                                                    <span className="truncate">{client.email}</span>
                                                </div>
                                                {client.phone && (
                                                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                                                        <Phone size={14} />
                                                        <span>{client.phone}</span>
                                                    </div>
                                                )}
                                                {client.address && (
                                                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                                                        <MapPin size={14} />
                                                        <span className="truncate">{client.address}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDelete(client._id)}
                                            className="w-full py-2 text-sm font-medium border border-zinc-200 rounded-lg flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
                                        >
                                            <Trash2 size={14} />
                                            Remove
                                        </button>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-200 rounded-3xl">
                                    <p className="text-zinc-400">No clients found. Start by adding one above.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default SaveClientData;