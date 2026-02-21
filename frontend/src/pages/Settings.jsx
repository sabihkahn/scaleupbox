import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
motion
import { User, Mail, ArrowRight, Loader2, Camera } from 'lucide-react';

const Settings = () => {
  const [formData, setFormData] = useState({ username: '', email: '', picture: '' });
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          username: data.data.username,
          email: data.data.email,
          picture: data.data.picture,
        });
      } catch (error) {
        console.log(error)
        toast.error("Error loading profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(`${import.meta.env.VITE_BASE_URL}/user/updateProfile`,
        { username: formData.username, email: formData.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(data);
      
      toast.success("Profile Updated");
    } catch (error) {
      console.log(error);
      toast.error("Update failed");
    } finally {
      setIsUpdating(false);
      window.location.reload();
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Loader2 className="h-8 w-8 animate-spin text-black" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-xl mx-auto"
      >
        <header className="mb-12">
          <h1 className="text-4xl font-black tracking-tighter text-black uppercase italic">
            Settings
          </h1>
          <div className="h-1 w-12 bg-black mt-2"></div>
        </header>

        <section className="space-y-12">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={formData.picture}
                alt="Profile"
                className="w-24 h-24 rounded-full grayscale border border-black p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Profile Source</p>
              <p className="text-sm font-medium text-black">Google Account Sync</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleUpdate} className="space-y-8">
            <div className="space-y-4">
              <div className="group border-b border-black py-2">
                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-500">Username</label>
                <div className="flex items-center gap-3 mt-1">
                  <User size={18} />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full bg-transparent outline-none text-lg font-medium placeholder:text-gray-300"
                    placeholder="User Name"
                  />
                </div>
              </div>

              <div className="group border-b border-black py-2">
                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-500">Email</label>
                <div className="flex items-center gap-3 mt-1">
                  <Mail size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent outline-none text-lg font-medium placeholder:text-gray-300"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              disabled={isUpdating}
              className="w-full bg-black text-white py-5 px-8 font-black uppercase tracking-widest flex items-center justify-between group transition-all"
            >
              {isUpdating ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                <>
                  <span>Save Changes</span>
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </motion.button>
          </form>
        </section>
      </motion.div>
    </div>
  );
};

export default Settings;