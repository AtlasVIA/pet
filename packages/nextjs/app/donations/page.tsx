"use client";

import { useState } from "react";
import { AppPreview } from "./components/AppPreview";
import { DonationForm } from "./components/DonationForm";
import { useDonations } from "./hooks/useDonations";

const DonationsPage = () => {
  const [selectedChain, setSelectedChain] = useState<number | null>(null);
  const {
    tokenSymbol,
    nativeBalance,
    usdcBalance,
    currentChainId,
    donationAmountUSD,
    setDonationAmountUSD,
    donationAmountToken,
    message,
    setMessage,
    isNetworkSwitching,
    handleDonate,
    isUSDCSupported,
    isContractLoading,
    isUSDCContractLoading,
  } = useDonations(selectedChain);

  const scrollToDonationForm = () => {
    const donationForm = document.getElementById('donation-form');
    if (donationForm) {
      donationForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-100 bg-opacity-90">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 mx-auto">
        <header className="text-center mb-20 animate-fade-in-down">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-8 animate-pulse">
            Woof! I'm Blue!
          </h1>
          <p className="text-2xl sm:text-3xl text-gray-800 leading-relaxed max-w-3xl mx-auto mb-10 font-light">
            And I'm on a <span className="font-semibold text-indigo-600">pawsome</span> mission to help my furry friends find their forever homes!
          </p>
          <button
            onClick={scrollToDonationForm}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-4 px-10 rounded-full hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:rotate-1 shadow-lg animate-bounce"
          >
            Help Me Help My Friends! 🐾
          </button>
        </header>

        <div className="bg-white bg-opacity-80 rounded-3xl shadow-2xl p-10 mb-20 animate-fade-in-up transition-all duration-300 hover:shadow-3xl relative overflow-hidden transform hover:-rotate-1">
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <h2 className="text-4xl font-bold text-indigo-800 mb-10 relative">
            Blue's Barking Mission
            <span className="absolute -bottom-2 left-0 w-24 h-1 bg-indigo-500"></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <p className="text-gray-800 text-xl leading-relaxed">
                Hey there, human friends! It's me, Blue! I'm one lucky pup who found my forever home, and now I want to help other dogs feel the same tail-wagging happiness I do every day!
              </p>
              <p className="text-gray-800 text-xl leading-relaxed">
                That's why I'm the top dog (literally!) at Dogachi.Pet. It's a super fun game where you can play with virtual pets like me. But here's the really <span className="font-semibold text-indigo-600">pawsome</span> part - every time you play, you're helping real shelter dogs!
              </p>
              <p className="text-gray-800 text-xl leading-relaxed">
                You see, when you take care of your Dogachi pet, it sends little donations to help real dogs in shelters. It's like giving them treats and belly rubs, but even better because it helps them find their own forever homes!
              </p>
            </div>
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 shadow-inner transform hover:scale-105 transition-all duration-300">
                <h3 className="text-3xl font-bold text-indigo-800 mb-6">What Your Help Means to Us Dogs</h3>
                <ul className="list-none text-gray-800 text-xl leading-relaxed pl-4 mb-6 space-y-4">
                  <li className="flex items-center"><span className="text-2xl mr-2">🍖</span> More yummy food and cozy beds for shelter pups</li>
                  <li className="flex items-center"><span className="text-2xl mr-2">🎾</span> Lots of playtime and walks for dogs waiting for homes</li>
                  <li className="flex items-center"><span className="text-2xl mr-2">📚</span> Help for humans to learn how to be the best pet parents</li>
                  <li className="flex items-center"><span className="text-2xl mr-2">🏠</span> More dogs finding their perfect forever families</li>
                </ul>
                <p className="text-xl text-indigo-600 italic font-semibold">
                  "Every pup deserves a loving home. Together, we can make more tails wag!"
                </p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-100 rounded-tl-full opacity-50 animate-pulse"></div>
        </div>
        
        <div id="donation-form" className="bg-white bg-opacity-90 rounded-3xl shadow-2xl p-10 animate-fade-in-up transition-all duration-300 hover:shadow-3xl transform hover:rotate-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="md:col-span-2">
              <h2 className="text-4xl font-bold text-indigo-800 mb-8">Lend a Paw! 🐾</h2>
              <DonationForm
                selectedChain={selectedChain}
                setSelectedChain={setSelectedChain}
                nativeBalance={nativeBalance}
                usdcBalance={usdcBalance}
                tokenSymbol={tokenSymbol}
                currentChainId={currentChainId}
                donationAmountUSD={donationAmountUSD}
                setDonationAmountUSD={setDonationAmountUSD}
                donationAmountToken={donationAmountToken}
                message={message}
                setMessage={setMessage}
                isNetworkSwitching={isNetworkSwitching}
                isContractLoading={isContractLoading}
                isUSDCContractLoading={isUSDCContractLoading}
                handleDonate={handleDonate}
                isUSDCSupported={isUSDCSupported}
              />
            </div>
            <div className="flex flex-col justify-between md:border-l md:border-indigo-200 md:pl-10">
              <div>
                <h2 className="text-3xl font-bold text-indigo-800 mb-8">Peek at the Puppy Fun!</h2>
                <AppPreview />
              </div>
              <div className="mt-10 text-center md:text-left">
                <p className="text-2xl text-indigo-600 italic font-semibold">
                  "Woof! Your support means more happy tails and wet noses!" 🐶💖
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationsPage;
