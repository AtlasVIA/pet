import React from 'react';

const BlueMission: React.FC = () => {
  return (
    <div className="bg-white bg-opacity-80 rounded-3xl shadow-lg p-6 sm:p-12 mb-24 animate-fade-in-up transition-all duration-500 ease-in-out hover:shadow-2xl relative overflow-hidden hover:scale-[1.02] hover:-translate-y-2">
      <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x"></div>
      <h2 className="text-3xl sm:text-4xl font-bold text-indigo-800 mb-8 sm:mb-12 relative inline-block">
        Blue's Mission
        <span className="absolute -bottom-2 left-0 w-full h-1 bg-indigo-500"></span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
        <div className="space-y-6 sm:space-y-8">
          <p className="text-gray-800 text-lg sm:text-xl leading-relaxed">
            Hey there, human friends! It's me, Blue! I'm one lucky pup who found my forever home, and now I want to help other dogs feel the same tail-wagging happiness I do every day!
          </p>
          <p className="text-gray-800 text-lg sm:text-xl leading-relaxed">
            That's why I'm the top dog (literally!) at Dogachi.Pet. It's a super fun game where you can play with virtual pets like me. But here's the really <span className="font-semibold text-indigo-600">pawsome</span> part - every time you play, you're helping real shelter dogs!
          </p>
          <p className="text-gray-800 text-lg sm:text-xl leading-relaxed">
            You see, when you take care of your Dogachi pet, it sends little donations to help real dogs in shelters. It's like giving them treats and belly rubs, but even better because it helps them find their own forever homes!
          </p>
        </div>
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 sm:p-8 shadow transition-all duration-500 ease-in-out hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1">
            <h3 className="text-2xl sm:text-3xl font-bold text-indigo-800 mb-6">What Your Help Means</h3>
            <ul className="list-none text-gray-800 text-lg sm:text-xl leading-relaxed mb-6 space-y-4">
              <li className="flex items-center"><span className="text-2xl mr-3">🍖</span> More yummy food and cozy beds for shelter pups</li>
              <li className="flex items-center"><span className="text-2xl mr-3">🎾</span> Lots of playtime and walks for dogs waiting for homes</li>
              <li className="flex items-center"><span className="text-2xl mr-3">📚</span> Help for humans to learn how to be the best pet parents</li>
              <li className="flex items-center"><span className="text-2xl mr-3">🏠</span> More dogs finding their perfect forever families</li>
            </ul>
            <p className="text-xl text-indigo-600 italic font-semibold">
              "Every pup deserves a loving home. Together, we can make more tails wag!"
            </p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-100 rounded-tl-full opacity-50 animate-pulse"></div>
    </div>
  );
};

export default BlueMission;