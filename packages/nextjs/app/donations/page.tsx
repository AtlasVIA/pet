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
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 bg-opacity-75">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 mx-auto">
        <header className="text-center mb-16 animate-fade-in-down">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-indigo-900 mb-6">Support Dogachi.Pet</h1>
          <p className="text-xl sm:text-2xl text-gray-800 leading-relaxed max-w-3xl mx-auto mb-8">
            Join us in creating a brighter future for shelter dogs through innovative technology and sustainable support.
          </p>
          <button
            onClick={scrollToDonationForm}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-full hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg animate-pulse"
          >
            Donate Now
          </button>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16 animate-fade-in-up transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-3xl font-semibold text-indigo-800 mb-8">Our Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-gray-800 text-lg">
                Hi there, I'm Blue, and I'm building <span className="font-bold text-indigo-700">Dogachi.Pet</span>, a Tamagotchi-style NFT project where every interaction with your virtual pet creates microdonations to real animal shelters.
              </p>
              <p className="text-gray-800 text-lg">
                Your support will help us finish development, bring more shelters onboard, and keep happy furry tails wagging!
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-indigo-700 font-semibold text-xl">
                Together, we can change a lot of lives—one wagging tail at a time!
              </p>
              <div className="mt-6">
                <h3 className="text-2xl font-semibold text-indigo-800 mb-4">Recent Achievements</h3>
                <p className="text-lg text-gray-800 mb-4">
                  We are thrilled to announce that Dogachi.Pet (Adopt A Pet) won the{" "}
                  <span className="font-bold text-indigo-700">ETHWarsaw 2024 Hackathon top prize!</span>
                </p>
                <a
                  href="https://x.com/ethwarsaw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Read More About Our Achievement
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div id="donation-form" className="lg:col-span-2 animate-fade-in-up">
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
          <div className="bg-white rounded-2xl shadow-xl p-6 animate-fade-in-up flex flex-col justify-between transition-all duration-300 hover:shadow-2xl">
            <div>
              <h2 className="text-2xl font-semibold text-indigo-800 mb-6">App Preview</h2>
              <AppPreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationsPage;
