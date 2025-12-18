import React from "react";
import { HomeIcon, CubeIcon, ChartBarIcon } from "@heroicons/react/24/outline";

const Card = () => {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="flex flex-col items-center justify-center h-48 bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-xl transition-shadow duration-300">
                    <div className="bg-blue-100 text-blue-600 p-3 rounded-full mb-3">
                        <HomeIcon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Total Websites</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">12</p>
                </div>

                {/* Card 2 */}
                <div className="flex flex-col items-center justify-center h-48 bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-xl transition-shadow duration-300">
                    <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full mb-3">
                        <CubeIcon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Published Sites</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">4</p>
                </div>

                {/* Card 3 */}
                <div className="flex flex-col items-center justify-center h-48 bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-xl transition-shadow duration-300">
                    <div className="bg-gray-800 text-white p-3 rounded-full mb-3">
                        <ChartBarIcon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Total Tokens</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">5</p>
                </div>
            </div>
        </div>
    );
};

export default Card;
