import React, { useRef, useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { ChevronRight, ChevronLeft, Download, Plus, Trash2, Camera, Mail, Phone, MapPin, Globe } from "lucide-react";

const inputClass =
    "w-full border border-zinc-200 bg-zinc-50/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:bg-white transition-all text-zinc-900 placeholder:text-zinc-400 shadow-sm";

const buttonPrimary =
    "flex-1 bg-zinc-950 text-white py-3 px-6 rounded-xl hover:bg-zinc-800 transition-all font-semibold flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-zinc-200";

const buttonSecondary =
    "bg-white border border-zinc-200 text-zinc-600 px-4 py-3 rounded-xl hover:bg-zinc-50 transition-all font-medium flex items-center justify-center gap-2 shadow-sm";

const ResumeBuilder = () => {
    const canvasRef = useRef(null);
    const [step, setStep] = useState(1);

    // Form States
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [social, setSocial] = useState("");
    const [photo, setPhoto] = useState(null);
    const [skillInput, setSkillInput] = useState("");
    const [skills, setSkills] = useState([]);
    const [langInput, setLangInput] = useState("");
    const [languages, setLanguages] = useState([]);
    const [expInput, setExpInput] = useState("");
    const [experiences, setExperiences] = useState([]);
    const [eduInput, setEduInput] = useState("");
    const [educations, setEducations] = useState([]);

    useEffect(() => {
        if (step !== 5) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, 600, 900);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 600, 900);
        ctx.fillStyle = "#18181b";
        ctx.fillRect(0, 0, 230, 900);

        if (photo) {
            const img = new Image();
            img.src = photo;
            img.onload = () => {
                ctx.save();
                ctx.beginPath();
                ctx.arc(115, 120, 65, 0, Math.PI * 2);
                ctx.clip();
                ctx.drawImage(img, 50, 55, 130, 130);
                ctx.restore();
            };
        }

        ctx.fillStyle = "white";
        ctx.font = "bold 20px Helvetica";
        ctx.fillText("Contact", 25, 230);
        ctx.font = "12px Helvetica";
        ctx.fillText(email, 25, 260);
        ctx.fillText(phone, 25, 280);
        ctx.fillText(address, 25, 300);
        if (social) ctx.fillText(social, 25, 320);

        let y = 380;
        ctx.font = "bold 20px Helvetica";
        ctx.fillText("Skills", 25, y);
        ctx.font = "12px Helvetica";
        skills.forEach(s => { y += 22; ctx.fillText("• " + s, 25, y); });

        y += 40;
        ctx.font = "bold 20px Helvetica";
        ctx.fillText("Languages", 25, y);
        ctx.font = "12px Helvetica";
        languages.forEach(l => { y += 22; ctx.fillText("• " + l, 25, y); });

        ctx.fillStyle = "black";
        ctx.font = "bold 40px Helvetica";
        ctx.fillText(name.toUpperCase(), 260, 90);

        let ry = 160;
        ctx.font = "bold 22px Helvetica";
        ctx.fillText("Experience", 260, ry);
        ctx.font = "14px Helvetica";
        experiences.forEach(exp => { ry += 24; ctx.fillText(exp, 260, ry, 300); });

        ry += 50;
        ctx.font = "bold 22px Helvetica";
        ctx.fillText("Education", 260, ry);
        ctx.font = "14px Helvetica";
        educations.forEach(edu => { ry += 24; ctx.fillText(edu, 260, ry); });
    }, [step, name, email, phone, address, social, photo, skills, languages, experiences, educations]);

    const downloadPDF = () => {
        const imgData = canvasRef.current.toDataURL("image/png");
        const pdf = new jsPDF("p", "px", [600, 900]);
        pdf.addImage(imgData, "PNG", 0, 0, 600, 900);
        pdf.save(`${name || 'resume'}.pdf`);
    };

    return (
        <div className="min-h-screen overflow-y-scroll bg-[#FAFAFA] flex justify-center py-12 px-4 text-zinc-900 selection:bg-zinc-200">
            <div className="w-full max-w-xl">

                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">
                        Resume<span className="text-zinc-400 font-light">Plus</span>
                    </h1>
                    <div className="flex justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step >= i ? 'w-8 bg-zinc-950' : 'w-4 bg-zinc-200'}`} />
                        ))}
                    </div>
                </div>

                <div className="bg-white shadow-2xl shadow-zinc-200/50 rounded-3xl p-6 md:p-8 border border-zinc-100">

                    {/* STEP 1: PERSONAL INFO */}
                    {step === 1 && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="flex flex-col items-center mb-6">
                                <label className="w-24 h-24 rounded-full bg-zinc-50 border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center cursor-pointer hover:border-zinc-950 transition-all group overflow-hidden">
                                    {photo ? <img src={photo} className="w-full h-full object-cover" /> : <Camera className="text-zinc-300 group-hover:text-zinc-950" />}
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = () => setPhoto(reader.result);
                                            reader.readAsDataURL(file);
                                        }
                                    }} />
                                </label>
                                <span className="text-xs text-zinc-400 mt-2 font-medium">Upload Profile Photo</span>
                            </div>

                            <input className={inputClass} placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input className={inputClass} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                                <input className={inputClass} placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} />
                            </div>
                            <input className={inputClass} placeholder="Mailing Address" value={address} onChange={e => setAddress(e.target.value)} />
                            <input className={inputClass} placeholder="LinkedIn / Portfolio URL" value={social} onChange={e => setSocial(e.target.value)} />

                            <button className={buttonPrimary} onClick={() => setStep(2)}>Next Step <ChevronRight size={18} /></button>
                        </div>
                    )}

                    {/* STEP 2: SKILLS & LANGUAGES */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-3 ml-1">Core Skills</h3>
                                <div className="flex gap-2 mb-4">
                                    <input className={inputClass} value={skillInput} onChange={e => setSkillInput(e.target.value)} placeholder="e.g. React.js" />
                                    <button className="bg-zinc-950 text-white px-4 rounded-xl hover:bg-zinc-800" onClick={() => { if (skillInput) setSkills([...skills, skillInput]); setSkillInput(""); }}>
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((s, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-zinc-100 text-zinc-700 text-xs font-bold rounded-lg flex items-center gap-2">
                                            {s} <Trash2 size={12} className="cursor-pointer text-zinc-400 hover:text-red-500" onClick={() => setSkills(skills.filter((_, idx) => idx !== i))} />
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-3 ml-1">Languages</h3>
                                <div className="flex gap-2 mb-4">
                                    <input className={inputClass} value={langInput} onChange={e => setLangInput(e.target.value)} placeholder="e.g. English" />
                                    <button className="bg-zinc-950 text-white px-4 rounded-xl hover:bg-zinc-800" onClick={() => { if (langInput) setLanguages([...languages, langInput]); setLangInput(""); }}>
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {languages.map((l, i) => (
                                        <span key={i} className="px-3 py-1.5 border border-zinc-200 text-zinc-700 text-xs font-bold rounded-lg flex items-center gap-2">
                                            {l} <Trash2 size={12} className="cursor-pointer text-zinc-400 hover:text-red-500" onClick={() => setLanguages(languages.filter((_, idx) => idx !== i))} />
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button className={buttonSecondary} onClick={() => setStep(1)}><ChevronLeft size={18} /> Back</button>
                                <button className={buttonPrimary} onClick={() => setStep(3)}>Next Step <ChevronRight size={18} /></button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: EXPERIENCE */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest ml-1">Professional Experience</h3>
                            <textarea className={inputClass} rows={4} placeholder="e.g. Senior Developer at Google (2020-2023)" value={expInput} onChange={e => setExpInput(e.target.value)} />
                            <button className={buttonSecondary} onClick={() => { if (expInput) setExperiences([...experiences, expInput]); setExpInput(""); }}>
                                <Plus size={18} /> Add Entry
                            </button>

                            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                {experiences.map((exp, i) => (
                                    <div key={i} className="p-3 border border-zinc-100 rounded-xl text-xs bg-zinc-50 flex justify-between items-center group">
                                        <span className="truncate">{exp}</span>
                                        <Trash2 size={14} className="cursor-pointer text-zinc-300 hover:text-red-500" onClick={() => setExperiences(experiences.filter((_, idx) => idx !== i))} />
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button className={buttonSecondary} onClick={() => setStep(2)}><ChevronLeft size={18} /> Back</button>
                                <button className={buttonPrimary} onClick={() => setStep(4)}>Next Step <ChevronRight size={18} /></button>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: EDUCATION */}
                    {step === 4 && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest ml-1">Education</h3>
                            <input className={inputClass} placeholder="e.g. Computer Science, Stanford University (2018)" value={eduInput} onChange={e => setEduInput(e.target.value)} />
                            <button className={buttonSecondary} onClick={() => { if (eduInput) setEducations([...educations, eduInput]); setEduInput(""); }}>
                                <Plus size={18} /> Add Entry
                            </button>

                            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                {educations.map((edu, i) => (
                                    <div key={i} className="p-3 border border-zinc-100 rounded-xl text-xs bg-zinc-50 flex justify-between items-center group">
                                        <span className="truncate">{edu}</span>
                                        <Trash2 size={14} className="cursor-pointer text-zinc-300 hover:text-red-500" onClick={() => setEducations(educations.filter((_, idx) => idx !== i))} />
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button className={buttonSecondary} onClick={() => setStep(3)}><ChevronLeft size={18} /> Back</button>
                                <button className={buttonPrimary} onClick={() => setStep(5)}>Generate Preview</button>
                            </div>
                        </div>
                    )}

                    {/* STEP 5: PREVIEW */}
                    {step === 5 && (
                        <div className="space-y-6 overflow-y-scroll animate-in zoom-in-95 duration-500">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button className={buttonSecondary} onClick={() => setStep(4)}><ChevronLeft size={18} /> Back</button>
                                <button className={buttonPrimary} onClick={downloadPDF}><Download size={18} /> Download PDF</button>
                            </div>
                            <div className="border overflow-y-scroll border-zinc-200 rounded-2xl overflow-hidden shadow-2xl">
                                <canvas ref={canvasRef} width={600} height={900} className="w-full h-auto" />
                            </div>
                        </div>
                    )}
                </div>
                <p className="text-center text-zinc-400 text-xs mt-8">Secure & Private • Local Processing Only</p>
            </div>
        </div>
    );
};

export default ResumeBuilder;