import React, { useEffect } from "react";

export default function Toast({ message, type = "success", visible, onClose }) {
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                onClose();
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!visible) return null;

    const bgColor =
        type === "success"
            ? "bg-green-600"
            : type === "error"
                ? "bg-red-600"
                : "bg-gray-800";

    return (
        <div className={`fixed top-5 right-5 z-[9999]`}>
            <div
                className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg min-w-[200px] animate-slide-in`}
            >
                <p className="font-semibold">{type === "success" ? "Success" : "Error"}</p>
                <p className="text-sm">{message}</p>
            </div>

            {/* Animation */}
            <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
        </div>
    );
}
