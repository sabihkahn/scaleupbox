import React, { useRef, useState, useEffect } from "react";
import { jsPDF } from "jspdf";

const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black";

const buttonPrimary =
    "w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition font-medium";

const buttonSecondary =
    "w-full bg-gray-200 text-black py-2 rounded-lg hover:bg-gray-300 transition font-medium";

const ResumeBuilder = () => {
    const canvasRef = useRef(null);
    const [step, setStep] = useState(1);

    // Step 1
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [social, setSocial] = useState("");
    const [photo, setPhoto] = useState(null);

    // Step 2
    const [skillInput, setSkillInput] = useState("");
    const [skills, setSkills] = useState([]);
    const [langInput, setLangInput] = useState("");
    const [languages, setLanguages] = useState([]);

    // Step 3
    const [expInput, setExpInput] = useState("");
    const [experiences, setExperiences] = useState([]);

    // Step 4
    const [eduInput, setEduInput] = useState("");
    const [educations, setEducations] = useState([]);

    /* ================= CANVAS DRAW ================= */
    useEffect(() => {
        if (step !== 5) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, 600, 900);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 600, 900);

        ctx.fillStyle = "#000";
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
        ctx.font = "22px Arial";
        ctx.fillText("Contact", 20, 230);

        ctx.font = "13px Courier New";
        ctx.fillText(email, 20, 260);
        ctx.fillText(phone, 20, 285);
        ctx.fillText(address, 20, 310);
        if (social) ctx.fillText(social, 20, 335);

        let y = 390;
        ctx.font = "22px Arial";
        ctx.fillText("Skills", 20, y);
        ctx.font = "13px Courier New";
        skills.forEach(s => {
            y += 22;
            ctx.fillText("• " + s, 20, y);
        });

        y += 40;
        ctx.font = "22px Arial";
        ctx.fillText("Languages", 20, y);
        ctx.font = "13px Courier New";
        languages.forEach(l => {
            y += 22;
            ctx.fillText("• " + l, 20, y);
        });

        ctx.fillStyle = "black";
        ctx.font = "42px serif";
        ctx.fillText(name, 260, 90);

        let ry = 160;
        ctx.font = "24px serif";
        ctx.fillText("Experience", 260, ry);
        ctx.font = "13px Courier New";
        experiences.forEach(exp => {
            ry += 24;
            ctx.fillText(exp, 260, ry, 300);
        });

        ry += 50;
        ctx.font = "24px serif";
        ctx.fillText("Education", 260, ry);
        ctx.font = "13px Courier New";
        educations.forEach(edu => {
            ry += 24;
            ctx.fillText(edu, 260, ry);
        });
    }, [step]);

    /* ================= PDF ================= */
    const downloadPDF = () => {
        const imgData = canvasRef.current.toDataURL("image/png");
        const pdf = new jsPDF("p", "px", [600, 900]);
        pdf.addImage(imgData, "PNG", 0, 0, 600, 900);
        pdf.save("resume.pdf");
    };

    /* ================= UI ================= */
    return (
        <div className="min-h-[70vh] bg-white flex justify-center items-start py-0 px-4 overflow-y-scroll">
            <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-2 space-y-4">

                <h1 className="text-2xl font-bold text-center">
                    Resume<span className="text-gray-400">++</span>
                </h1>

                {step === 1 && (
                    <>
                        <input className={inputClass} placeholder="Full Name" onChange={e => setName(e.target.value)} />
                        <input className={inputClass} placeholder="Email" onChange={e => setEmail(e.target.value)} />
                        <input className={inputClass} placeholder="Phone" onChange={e => setPhone(e.target.value)} />
                        <input className={inputClass} placeholder="Address" onChange={e => setAddress(e.target.value)} />
                        <input className={inputClass} placeholder="Social link (optional)" onChange={e => setSocial(e.target.value)} />

                        <input type="file" accept="image/*" className="text-sm" onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = () => setPhoto(reader.result);
                            reader.readAsDataURL(file);
                        }} />

                        <button className={buttonPrimary} onClick={() => setStep(2)}>Next</button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <input className={inputClass} value={skillInput} onChange={e => setSkillInput(e.target.value)} placeholder="Add skill" />
                        <button className={buttonSecondary} onClick={() => {
                            setSkills([...skills, skillInput]);
                            setSkillInput("");
                        }}>Add Skill</button>

                        <input className={inputClass} value={langInput} onChange={e => setLangInput(e.target.value)} placeholder="Add language" />
                        <button className={buttonSecondary} onClick={() => {
                            setLanguages([...languages, langInput]);
                            setLangInput("");
                        }}>Add Language</button>

                        <button className={buttonPrimary} onClick={() => setStep(3)}>Next</button>
                    </>
                )}

                {step === 3 && (
                    <>
                        <textarea className={inputClass} rows={4} placeholder="Experience" value={expInput} onChange={e => setExpInput(e.target.value)} />
                        <button className={buttonSecondary} onClick={() => {
                            setExperiences([...experiences, expInput]);
                            setExpInput("");
                        }}>Add Experience</button>

                        <button className={buttonPrimary} onClick={() => setStep(4)}>Next</button>
                    </>
                )}

                {step === 4 && (
                    <>
                        <input className={inputClass} placeholder="Education" value={eduInput} onChange={e => setEduInput(e.target.value)} />
                        <button className={buttonSecondary} onClick={() => {
                            setEducations([...educations, eduInput]);
                            setEduInput("");
                        }}>Add Education</button>

                        <button className={buttonPrimary} onClick={() => setStep(5)}>Generate Resume</button>
                    </>
                )}

                {step === 5 && (
                    <>
                        <canvas ref={canvasRef} width={600} height={900} className="w-full border rounded-lg" />
                        <button className={buttonPrimary} onClick={downloadPDF}>
                            Download Resume (PDF)
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResumeBuilder;
