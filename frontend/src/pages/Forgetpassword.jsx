import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {useNavigate} from 'react-router-dom'
motion
const ForgetPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newpass, setNewPass] = useState("");
   
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");

    const BASE = import.meta.env.VITE_BASE_URL;

    const navigate = useNavigate()
    // ------------------------------------------
    // FRONTEND VALIDATION
    // ------------------------------------------

    const isValidEmail = (e) =>
        e.includes("@") && e.includes(".") && !e.includes(" ") && e.length > 5;

    const isValidOtp = (o) => /^\d{6}$/.test(o); // MUST BE 6 DIGITS

    const isStrongPassword = (p) => p.length >= 8;

    // ------------------------------------------
    // SEND OTP
    // ------------------------------------------
    const sendOtp = async () => {
        try {
            setLoading(true);
            setMsg("");
            setError("");

            if (!isValidEmail(email)) {
                setError("Invalid email format.");
                setLoading(false);
                return;
            }

            const res = await axios.post(`${BASE}/auth/user/getotp`, { email });

            setMsg(res.data.message);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || "Error sending OTP");
        }
        setLoading(false);
    };

    // ------------------------------------------
    // VERIFY OTP
    // ------------------------------------------
    const verifyOtp = async () => {
        try {
            setLoading(true);
            setMsg("");
            setError("");

            if (!isValidOtp(otp)) {
                setError("OTP must be exactly 6 digits.");
                setLoading(false);
                return;
            }

            const res = await axios.post(`${BASE}/auth/user/verifyotp`, {
                email,
                otp,
            });

            setMsg(res.data.message);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || "OTP verification failed");
        }
        setLoading(false);
    };

    // ------------------------------------------
    // RESET PASSWORD
    // ------------------------------------------
    const resetPassword = async () => {
        try {
            setLoading(true);
            setMsg("");
            setError("");

            if (!isStrongPassword(newpass)) {
                setError("Password must be at least 8 characters long.");
                setLoading(false);
                return;
            }

            const res = await axios.post(`${BASE}/auth/user/resetpass`, {
                email,
                otp,
                newpass,
            }).then((e)=>{
if(e.status == 200){
    navigate('/auth/login')
}
            })

            setMsg(res.data.message);

            setStep(1);
            setOtp("");
            setNewPass("");
            setEmail("");
        } catch (err) {
            setError(err.response?.data?.message || "Error resetting password");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-white text-white px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl border border-neutral-700"
            >
                <h1 className="text-3xl text-black font-bold mb-6 text-center">
                    Reset Password
                </h1>

                {/* ERROR MESSAGE */}
                {error && (
                    <p className="mb-4 text-center text-red-600 text-sm p-2 bg-red-100 rounded">
                        {error}
                    </p>
                )}

                {/* SUCCESS MESSAGE */}
                {msg && !error && (
                    <p className="mb-4 text-center text-green-700 text-sm p-2 bg-green-100 rounded">
                        {msg}
                    </p>
                )}

                {/* -------------------- STEP 1: SEND OTP -------------------- */}
                {step === 1 && (
                    <>
                        <label className="text-black">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email..."
                            className="w-full text-black mt-1 p-3 rounded bg-white border border-neutral-700 outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <button
                            onClick={sendOtp}
                            disabled={!isValidEmail(email) || loading}
                            className={`w-full mt-5 p-3 rounded font-semibold ${!isValidEmail(email) || loading
                                    ? "bg-neutral-500 cursor-not-allowed"
                                    : "bg-black text-white hover:bg-gray-900"
                                }`}
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </>
                )}

                {/* -------------------- STEP 2: VERIFY OTP -------------------- */}
                {step === 2 && (
                    <>
                        <label className="text-black">Enter OTP</label>
                        <input
                            type="number"
                            placeholder="6-digit OTP"
                            className="w-full mt-1 p-3 rounded bg-white border border-neutral-700 text-black outline-none"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />

                        <button
                            onClick={verifyOtp}
                            disabled={!isValidOtp(otp) || loading}
                            className={`w-full mt-5 p-3 rounded font-semibold ${!isValidOtp(otp) || loading
                                    ? "bg-neutral-500 cursor-not-allowed"
                                    : "bg-black text-white hover:bg-black"
                                }`}
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>

                        <button
                            onClick={() => setStep(1)}
                            className="w-full text-xl mt-3 p-2  underline text-black"
                        >
                            Change Email
                        </button>
                    </>
                )}

                {/* -------------------- STEP 3: RESET PASSWORD -------------------- */}
                {step === 3 && (
                    <>
                        <label className="text-black">New Password</label>
                        <input
                            type="password"
                            placeholder="At least 8 characters"
                            className="w-full mt-1 p-3 rounded bg-white border border-neutral-700 text-black outline-none"
                            value={newpass}
                            onChange={(e) => setNewPass(e.target.value)}
                        />

                        {newpass && !isStrongPassword(newpass) && (
                            <p className="text-red-600 mt-2 text-sm">
                                Password must be at least 8 characters long.
                            </p>
                        )}

                        <button
                            onClick={resetPassword}
                            disabled={!isStrongPassword(newpass) || loading}
                            className={`w-full mt-5 p-3 rounded font-semibold ${!isStrongPassword(newpass) || loading
                                    ? "bg-neutral-500 cursor-not-allowed"
                                    : "bg-black text-white hover:bg-black"
                                }`}
                        >
                            {loading ? "Updating..." : "Reset Password"}
                        </button>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default ForgetPassword;
