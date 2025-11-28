import React, { useEffect, useRef, useState } from "react";

export default function FatBear() {
    const bearRef = useRef(null);
    const leftEyeRef = useRef(null);
    const rightEyeRef = useRef(null);

    const [isDead, setIsDead] = useState(false);

    useEffect(() => {
        function handleMouseMove(e) {
            if (isDead) return;

            const moveEye = (eye) => {
                const rect = eye.getBoundingClientRect();
                const eyeX = rect.left + rect.width / 2;
                const eyeY = rect.top + rect.height / 2;

                const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
                const maxMove = 4;

                const x = Math.cos(angle) * maxMove;
                const y = Math.sin(angle) * maxMove;

                eye.style.transform = `translate(${x}px, ${y}px)`;
            };

            moveEye(leftEyeRef.current);
            moveEye(rightEyeRef.current);
        }

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [isDead]);

    const killBear = () => {
        setIsDead(true);
        leftEyeRef.current.style.transform = "none";
        rightEyeRef.current.style.transform = "none";
    };

    return (
        <div className="flex justify-center mt-20 relative">
            <h1 className="absolute text-xl left-6 font-mono bottom-[430px]  w-full">
                {isDead ? "WHY WHY you killed me 😞" : "Hi I am ekuu 🐻"}
            </h1>
            <div
                ref={bearRef}
                onClick={killBear}
                className={`transition-all duration-700 cursor-pointer select-none 
                ${isDead ? "rotate-90 opacity-70" : ""}`}
            >

                {/* Text */}
              

                {/* --- BEAR --- */}
                <div className="relative flex flex-col items-center">

                    {/* Ears */}
                    <div className="flex gap-20 -mb-6">
                        <div className="w-16 h-16 bg-orange-300 rounded-full shadow-inner flex items-center justify-center">
                            <div className="w-10 h-10 bg-orange-200 rounded-full"></div>
                        </div>
                        <div className="w-16 h-16 bg-orange-300 rounded-full shadow-inner flex items-center justify-center">
                            <div className="w-10 h-10 bg-orange-200 rounded-full"></div>
                        </div>
                    </div>

                    {/* Head */}
                    <div className="bg-orange-300 w-44 h-40 rounded-full shadow-lg flex flex-col items-center justify-center">

                        {/* Eyes */}
                        <div className="flex gap-10 mt-2">
                            <div className="relative w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                {isDead ? (
                                    <div className="text-black text-2xl font-bold">X</div>
                                ) : (
                                    <div ref={leftEyeRef} className="w-4 h-4 bg-black rounded-full"></div>
                                )}
                            </div>

                            <div className="relative w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                {isDead ? (
                                    <div className="text-black text-2xl font-bold">X</div>
                                ) : (
                                    <div ref={rightEyeRef} className="w-4 h-4 bg-black rounded-full"></div>
                                )}
                            </div>
                        </div>

                        {/* Nose + Mouth */}
                        <div className="flex flex-col items-center mt-2">
                            <div className="w-8 h-6 bg-black rounded-full"></div>
                            <div className="w-12 h-6 border-b-4 border-black rounded-full mt-1"></div>
                        </div>
                    </div>

                    {/* Body / Belly */}
                    <div className="bg-orange-300 w-52 h-60 rounded-full mt-[-10px] shadow-xl flex justify-center pt-10">
                        <div className="bg-orange-200 w-36 h-44 rounded-full shadow-inner"></div>
                    </div>

                    {/* Arms */}
                    <div className="flex justify-between w-56 -mt-32 px-2">
                        <div className="w-16 h-20 bg-orange-300 rounded-3xl shadow-md rotate-[20deg]"></div>
                        <div className="w-16 h-20 bg-orange-300 rounded-3xl shadow-md rotate-[-20deg]"></div>
                    </div>

                    {/* Feet */}
                    <div className="flex justify-center gap-14 -mt-4">
                        <div className="w-20 h-12 bg-orange-300 rounded-t-3xl shadow-md"></div>
                        <div className="w-20 h-12 bg-orange-300 rounded-t-3xl shadow-md"></div>
                    </div>

                </div>
            </div>
        </div>
    );
}
