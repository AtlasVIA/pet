import React, { useState } from "react";

export const AppPreview: React.FC = () => {
  const [petMood, setPetMood] = useState("neutral");
  const [donationProgress, setDonationProgress] = useState(75);

  const handleAction = (action: string) => {
    setPetMood(action);
    setTimeout(() => setPetMood("neutral"), 1000);
    setDonationProgress(prev => Math.min(prev + 5, 100));
  };

  const getPetEmoji = () => {
    switch (petMood) {
      case "feed":
        return "😋";
      case "play":
        return "😄";
      case "love":
        return "🥰";
      default:
        return "🐶";
    }
  };

  return (
    <div className="bg-white bg-opacity-80 rounded-3xl shadow-lg p-6 sm:p-12 mb-24 animate-fade-in-up transition-all duration-500 ease-in-out hover:shadow-2xl relative overflow-hidden hover:scale-[1.02] hover:-translate-y-2">
      <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
        <div className="space-y-6 sm:space-y-8">
          <div className="w-full max-w-xs mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800 relative transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-28 w-full flex items-center justify-center relative overflow-hidden">
              <h3 className="text-white text-3xl font-bold relative z-10 animate-pulse">Dogachi.Pet</h3>
            </div>
            <div className="p-6 relative">
              <div className="bg-white rounded-xl p-4 mb-4 shadow-md transform hover:scale-102 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full mx-auto mb-3 flex items-center justify-center animate-bounce">
                  <span className="text-4xl">{getPetEmoji()}</span>
                </div>
                <div className="h-2 bg-gray-300 rounded w-3/4 mx-auto"></div>
              </div>
              <div className="flex justify-around mb-4">
                <div
                  className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-md transform hover:scale-110 transition-all duration-300 cursor-pointer"
                  role="button"
                  aria-label="Feed pet - generates a small donation"
                  onClick={() => handleAction("feed")}
                  title="Feed your pet and generate a small donation"
                >
                  <span className="text-white text-2xl">🍖</span>
                </div>
                <div
                  className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-md transform hover:scale-110 transition-all duration-300 cursor-pointer"
                  role="button"
                  aria-label="Play with pet - generates a small donation"
                  onClick={() => handleAction("play")}
                  title="Play with your pet and generate a small donation"
                >
                  <span className="text-white text-2xl">🎾</span>
                </div>
                <div
                  className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center shadow-md transform hover:scale-110 transition-all duration-300 cursor-pointer"
                  role="button"
                  aria-label="Love pet - generates a small donation"
                  onClick={() => handleAction("love")}
                  title="Show love to your pet and generate a small donation"
                >
                  <span className="text-white text-2xl">❤️</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-28 rounded-xl flex items-center justify-center shadow-inner">
                <span className="text-6xl animate-pulse">🐾</span>
              </div>
              <div className="mt-4 bg-white rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-300 to-green-500 h-full transition-all duration-500 ease-in-out"
                  style={{ width: `${donationProgress}%` }}
                  role="progressbar"
                  aria-valuenow={donationProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
              <p className="text-xs text-center mt-2 text-gray-600">Donation Progress: {donationProgress}%</p>
            </div>
          </div>
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mt-6 rounded-r-lg shadow-md">
            <p className="text-yellow-700">
              <strong>Did you know?</strong> Your NFT represents a real dog in a real shelter. By caring for your
              virtual pet, you&apos;re directly contributing to the well-being of its real-life counterpart!
            </p>
          </div>
        </div>
        <div className="space-y-6 sm:space-y-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 sm:p-8 shadow-lg">
          <h3 className="text-2xl sm:text-3xl font-bold text-indigo-800 mb-6">How Dogachi.Pet Works</h3>
          <ul className="list-none text-gray-800 text-lg sm:text-xl leading-relaxed mb-6 space-y-4">
            <li className="flex items-center">
              <span className="text-2xl mr-3">🐕</span> Adopt a virtual pet that represents a real dog in a shelter
            </li>
            <li className="flex items-center">
              <span className="text-2xl mr-3">🎮</span> Interact with your pet through a Tamagotchi-style interface
            </li>
            <li className="flex items-center">
              <span className="text-2xl mr-3">💰</span> Each interaction generates a microdonation to the shelter
            </li>
            <li className="flex items-center">
              <span className="text-2xl mr-3">📈</span> Watch your impact grow as you care for your virtual pet
            </li>
            <li className="flex items-center">
              <span className="text-2xl mr-3">❤️</span> Consider adopting your virtual pet in real life!
            </li>
          </ul>
          <div className="bg-indigo-100 rounded-xl p-6 shadow-md">
            <p className="text-xl text-indigo-800 italic font-semibold">
              &ldquo;Experience the joy of pet ownership while making a real difference in the lives of shelter animals.
              Your virtual care translates into real-world support!&rdquo;
            </p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-100 rounded-tl-full opacity-50 animate-pulse"></div>
    </div>
  );
};
