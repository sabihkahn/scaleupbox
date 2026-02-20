import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
motion
import { Plus, Trash2, X, ExternalLink, Globe, Briefcase, GraduationCap, Share2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const PortfolioGenerator = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    profile: { name: "", email: "", phone: "", description: "", profileImage: "" },
    websiteType: "software_dev",
    skills: [{ name: "" }],
    experience: [{ title: "", description: "" }],
    education: [{ description: "" }],
    projects: [{ name: "", description: "", image: "", liveUrl: "", githubUrl: "" }],
    socialLinks: [{ platform: "", url: "" }],
    slug: "",
    isPublished: true,
  });

  const fetchPortfolios = async () => {
    try {
      const res = await api.get("/portfolio-all");
      setPortfolios(res.data.portfoliowebsites || []);
    } catch (err) {
      console.log(err);
      
      toast.error("Failed to fetch portfolios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPortfolios(); }, []);

  // Generic handler for nested profile object
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, profile: { ...prev.profile, [name]: value } }));
  };

  // Helper to add/remove/edit array items
  const handleArrayChange = (index, field, value, arrayName) => {
    const newArray = [...formData[arrayName]];
    newArray[index][field] = value;
    setFormData({ ...formData, [arrayName]: newArray });
  };

  const addItem = (arrayName, emptyObj) => {
    setFormData({ ...formData, [arrayName]: [...formData[arrayName], emptyObj] });
  };

  const removeItem = (index, arrayName) => {
    const newArray = formData[arrayName].filter((_, i) => i !== index);
    setFormData({ ...formData, [arrayName]: newArray });
  };

  const handleCreate = async () => {
    try {
      if (!formData.profile.name || !formData.slug) return toast.warning("Name and Slug are required");
      await api.post("/portfolio/create", formData);
      toast.success("Portfolio created successfully!");
      setShowModal(false);
      fetchPortfolios();
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this portfolio?")) return;
    try {
      await api.delete(`/portfolio/delete/${id}`);
      setPortfolios(prev => prev.filter(p => p._id !== id));
      toast.success("Deleted");
    } catch { toast.error("Delete failed"); }
  };

  return (
    <div className="min-h-screen overflow-y-scroll p-9 bg-white text-black font-sans selection:bg-black selection:text-white">
      <ToastContainer position="bottom-right" />

      {/* NAV */}
      <nav className="border-b sticky top-0 bg-white/80 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <h1 className="text-xl font-black tracking-tighter uppercase">Studio.</h1>
          <button onClick={() => setShowModal(true)} className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:scale-105 transition-transform flex items-center gap-2">
            <Plus size={16} /> Create New
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-8 border rounded-3xl">
            <p className="text-sm text-gray-500 font-medium uppercase tracking-widest mb-2">Total Portfolios</p>
            <h2 className="text-4xl font-bold">{portfolios.length}</h2>
          </div>
          <div className="p-8 border rounded-3xl md:col-span-2 flex flex-col justify-center">
            <p className="text-sm text-gray-500 font-medium uppercase tracking-widest mb-4">Analytics Overview</p>
            <div className="h-20 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={portfolios}>
                  <Line type="step" dataKey="clicks" stroke="#000" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* LIST */}
        <h3 className="text-2xl font-bold mb-8">Active Projects</h3>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-black border-t-transparent animate-spin rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((p) => (
              <motion.div layout key={p._id} className="group p-6 border rounded-3xl hover:border-black transition-colors relative">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center font-bold">
                    {p.profile?.name[0]}
                  </div>
                  <button onClick={() => handleDelete(p._id)} className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
                <h4 className="font-bold text-lg mb-1">{p.profile?.name}</h4>
                <p className="text-sm text-gray-500 mb-6 flex items-center gap-1">
                  <Globe size={14} /> /{p.slug}
                </p>
                <a href={`${BASE_URL}/portfolio/${p.slug}`} target="_blank" className="w-full py-3 border rounded-xl flex items-center justify-center gap-2 font-semibold text-sm hover:bg-black hover:text-white transition-all">
                  View Live <ExternalLink size={14} />
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
            <motion.div initial={{ y: 50, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 50, scale: 0.95 }} className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="px-8 py-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
                <h2 className="text-xl font-bold">Portfolio Details</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X /></button>
              </div>

              <div className="overflow-y-auto p-8 space-y-10">
                {/* Section: Identity */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Basic Identity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="name" placeholder="Full Name" className="modal-input" onChange={handleProfileChange} />
                    <input name="email" placeholder="Email Address" className="modal-input" onChange={handleProfileChange} />
                    <input name="slug" placeholder="Unique Slug (e.g. asad-dev)" className="modal-input" onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
                    <input name="profileImage" placeholder="Profile Image URL" className="modal-input" onChange={handleProfileChange} />
                  </div>
                  <textarea name="description" placeholder="Short Bio" className="modal-input mt-4 h-24 resize-none" onChange={handleProfileChange} />
                </div>

                {/* Section: Skills */}
                <ArraySection title="Skills" icon={<Briefcase size={16} />}
                  items={formData.skills}
                  onAdd={() => addItem('skills', { name: "" })}
                  onRemove={(i) => removeItem(i, 'skills')}>
                  {formData.skills.map((item, i) => (
                    <input key={i} placeholder="Skill name" className="modal-input" value={item.name} onChange={(e) => handleArrayChange(i, 'name', e.target.value, 'skills')} />
                  ))}
                </ArraySection>

                {/* Section: Projects */}
                <ArraySection title="Projects" icon={<Share2 size={16} />}
                  items={formData.projects}
                  onAdd={() => addItem('projects', { name: "", description: "", image: "", liveUrl: "", githubUrl: "" })}
                  onRemove={(i) => removeItem(i, 'projects')}>
                  {formData.projects.map((item, i) => (
                    <div key={i} className="p-4 border rounded-2xl grid grid-cols-2 gap-3 relative">
                      <input placeholder="Project Name" className="modal-input" onChange={(e) => handleArrayChange(i, 'name', e.target.value, 'projects')} />
                      <input placeholder="Image URL" className="modal-input" onChange={(e) => handleArrayChange(i, 'image', e.target.value, 'projects')} />
                      <input placeholder="Live Link" className="modal-input col-span-2" onChange={(e) => handleArrayChange(i, 'liveUrl', e.target.value, 'projects')} />
                    </div>
                  ))}
                </ArraySection>

                <ArraySection title="socialLinks" icon={<Briefcase size={16} />}
                  items={formData.socialLinks}
                  onAdd={() => addItem('socialLinks', { name: "", url: "" })}
                  onRemove={(i) => removeItem(i, 'socialLinks')}>
                  {formData.socialLinks.map((item, i) => (
                    <div key={i} className="grid grid-cols-2 gap-3">
                      <input placeholder="Platform Name" className="modal-input" value={item.name} onChange={(e) => handleArrayChange(i, 'name', e.target.value, 'socialLinks')} />
                      <input placeholder="URL" className="modal-input" value={item.url} onChange={(e) => handleArrayChange(i, 'url', e.target.value, 'socialLinks')} />
                    </div>
                  ))}
                </ArraySection>
              </div>

              <div className="p-8 border-t bg-gray-50">
                <button onClick={handleCreate} className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:opacity-90 transition-opacity">
                  Generate Portfolio
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .modal-input {
          width: 100%; border: 1.5px solid #eee; padding: 14px 18px; border-radius: 16px;
          outline: none; transition: border-color 0.2s; font-size: 0.95rem;
        }
        .modal-input:focus { border-color: #000; }
      `}</style>
    </div>
  );
};

// Sub-component for cleaner array handling
const ArraySection = ({ title, icon, items, onAdd, onRemove, children }) => (

 <div className="space-y-4">
  <p>{items.length} items</p>
    <div className="flex justify-between items-center">
      <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
        {icon} {title}
      </h3>
      <button onClick={onAdd} className="text-xs font-bold flex items-center gap-1 hover:underline"><Plus size={14} /> Add</button>
    </div>
    <div className="grid grid-cols-1 gap-3">
      {React.Children.map(children, (child, index) => (
        <div className="flex gap-2">
          {child}
          <button onClick={() => onRemove(index) } className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
        </div>
      ))}
    </div>
  </div>
);

export default PortfolioGenerator;