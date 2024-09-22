import React from 'react';

interface DonationPageHeroProps {
  scrollToDonationForm: () => void;
}

const DonationPageHero: React.FC<DonationPageHeroProps> = ({ scrollToDonationForm }) => {
  return (
    <div className="text-center mb-24 animate-fade-in-down">
      <div className="mb-8">
        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 inline-block transition-all duration-300 ease-in-out hover:scale-105 animate-text-shimmer">
          Woof! I'm Blue!
        </h1>
      </div>
      <p className="text-xl sm:text-2xl lg:text-3xl text-gray-800 leading-relaxed max-w-3xl mx-auto mb-12 font-light">
        And I'm on a <span className="font-semibold text-indigo-600 animate-pulse">pawsome</span> mission to help my furry friends find their forever homes!
      </p>
      <button
        onClick={scrollToDonationForm}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-10 rounded-full transition-all duration-300 ease-in-out hover:from-indigo-600 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl animate-bounce"
        aria-label="Scroll to donation form"
      >
        Help Me Help My Friends! 🐾
      </button>
    </div>
  );
};

export default DonationPageHero;