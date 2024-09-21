import React from "react";

export const AppPreview: React.FC = () => {
  return (
    <div className="mt-8 md:mt-0 md:ml-8 flex justify-center items-center">
      <div className="w-64 h-128 bg-gray-100 rounded-3xl shadow-xl overflow-hidden border-8 border-gray-800 relative">
        <div className="bg-indigo-600 h-24 w-full flex items-center justify-center">
          <h3 className="text-white text-2xl font-bold">Dogachi.Pet</h3>
        </div>
        <div className="p-4">
          <div className="bg-white rounded-lg p-3 mb-3 shadow">
            <div className="w-16 h-16 bg-yellow-300 rounded-full mx-auto mb-2"></div>
            <div className="h-2 bg-gray-300 rounded w-3/4 mx-auto"></div>
          </div>
          <div className="flex justify-around mb-3">
            <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">🍖</span>
            </div>
            <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">🎾</span>
            </div>
            <div className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">❤️</span>
            </div>
          </div>
          <div className="bg-gray-200 h-24 rounded-lg flex items-center justify-center">
            <span className="text-4xl">🐾</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black rounded-full mx-16"></div>
      </div>
    </div>
  );
};
