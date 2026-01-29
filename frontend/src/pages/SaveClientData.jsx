import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, User } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const SaveClientData = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: ""
    });

    const token = localStorage.getItem("token");

    /* ================= FETCH CLIENTS ================= */
    const fetchClients = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${BASE_URL}/client/get-clients?page=1`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setClients(res.data.clientInfos || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    /* ================= ADD CLIENT ================= */
    const handleAddClient = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                `${BASE_URL}/client/add-client`,
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setClients((prev) => [res.data, ...prev]);
            setForm({ name: "", email: "", phone: "", address: "" });
        } catch (err) {
            console.error(err);
        }
    };

    /* ================= DELETE CLIENT ================= */
    const handleDelete = async (id) => {
        try {
            await axios.delete(
                `${BASE_URL}/client/delete-client?clientId=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setClients((prev) => prev.filter((c) => c._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-white p-6">
            {/* ================= HEADER ================= */}
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-semibold mb-6">
                    Client Management
                </h1>

                {/* ================= ADD CLIENT FORM ================= */}
                <form
                    onSubmit={handleAddClient}
                    className="border border-gray-300 rounded-lg p-4 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4"
                >
                    <input
                        className="border px-3 py-2 rounded"
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                        required
                    />
                    <input
                        className="border px-3 py-2 rounded"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                        required
                    />
                    <input
                        className="border px-3 py-2 rounded"
                        placeholder="Phone"
                        value={form.phone}
                        onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                        }
                    />
                    <input
                        className="border px-3 py-2 rounded"
                        placeholder="Address"
                        value={form.address}
                        onChange={(e) =>
                            setForm({ ...form, address: e.target.value })
                        }
                    />

                    <button
                        type="submit"
                        className="md:col-span-4 bg-black text-white py-2 rounded flex items-center justify-center gap-2 hover:opacity-90 transition"
                    >
                        <Plus size={18} />
                        Add Client
                    </button>
                </form>

                {/* ================= CLIENT LIST ================= */}
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div
                        className="
              grid gap-4
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
            "
                    >
                        {clients.map((client) => (
                            <div
                                key={client._id}
                                className="border border-gray-300 rounded-lg p-4 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <User size={18} />
                                        <h2 className="font-semibold">
                                            {client.name}
                                        </h2>
                                    </div>

                                    <p className="text-sm text-gray-600">
                                        {client.email}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {client.phone}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {client.address}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleDelete(client._id)}
                                    className="mt-4 bg-black text-white py-1 rounded flex items-center justify-center gap-2 hover:opacity-90"
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SaveClientData;
