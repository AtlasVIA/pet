import React from "react";

export const AppPreview: React.FC = () => {
  return (
    <div className="flex flex-col items-center relative">
      <p className=" text-indigo-800 text-center font-semibold max-w-xs">
        Interact and support real animal shelters!
      </p>
      <div className="w-full max-w-xs bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800 relative transform hover:scale-105 transition-all duration-300">
        <div className="absolute inset-0 bg-opacity-10 bg-white" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}}></div>
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-28 w-full flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 transform rotate-45 scale-150" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}}></div>
          </div>
          <h3 className="text-white text-3xl font-bold relative z-10 animate-pulse">Dogachi.Pet</h3>
        </div>
        <div className="p-6 relative">
          <div className="bg-white rounded-xl p-4 mb-4 shadow-md transform hover:scale-102 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full mx-auto mb-3 animate-bounce"></div>
            <div className="h-2 bg-gray-300 rounded w-3/4 mx-auto"></div>
          </div>
          <div className="flex justify-around mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-md transform hover:scale-110 transition-all duration-300">
              <span className="text-white text-2xl">🍖</span>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-md transform hover:scale-110 transition-all duration-300">
              <span className="text-white text-2xl">🎾</span>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center shadow-md transform hover:scale-110 transition-all duration-300">
              <span className="text-white text-2xl">❤️</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-28 rounded-xl flex items-center justify-center shadow-inner">
            <span className="text-6xl animate-pulse">🐾</span>
          </div>
        </div>
        <div className="absolute bottom-1 left-0 right-0 h-1 bg-black rounded-full mx-16"></div>
      </div>

      <div className="mt-12 text-center lg:text-left">
        <p className="text-indigo-600 italic font-semibold">
          "Woof! Your support means more happy tails and wet noses!"
        </p>🐶💖
      </div>
    </div>
  );
};
