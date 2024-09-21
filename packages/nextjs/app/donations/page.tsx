"use client";

import { useState, useEffect } from "react";
import { AppPreview } from "./components/AppPreview";
import { DonationForm } from "./components/DonationForm";
import { useDonations } from "./hooks/useDonations";
import Roadmap from "./components/Roadmap";
import { FaArrowUp } from "react-icons/fa";

const DonationsPage = () => {
  const [selectedChain, setSelectedChain] = useState<number | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const {
    tokenSymbol,
    nativeBalance,
    usdcBalance,
    currentChainId,
    donationAmountUSD,
    setDonationAmountUSD,
    donationAmountToken,
    setDonationAmountToken,
    message,
    setMessage,
    isNetworkSwitching,
    handleDonate,
    isUSDCSupported,
    isContractLoading,
    isUSDCContractLoading,
    tokenPrice,
  } = useDonations(selectedChain);

  const scrollToDonationForm = () => {
    const donationForm = document.getElementById('donation-form');
    if (donationForm) {
      setIsScrolling(true);
      const headerOffset = 100;
      const elementPosition = donationForm.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      setTimeout(() => setIsScrolling(false), 1000);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!isScrolling) {
        const donationForm = document.getElementById('donation-form');
        if (donationForm) {
          const rect = donationForm.getBoundingClientRect();
          if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            donationForm.classList.add('animate-fade-in-up');
          }
        }
      }
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolling]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-100 bg-opacity-90 relative">
      <div className="absolute inset-0 bg-opacity-10 bg-white pointer-events-none" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}}></div>
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 mx-auto relative z-10">
        <header className="text-center mb-24 animate-fade-in-down">
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
        </header>

        <div className="bg-white bg-opacity-80 rounded-3xl shadow-lg p-6 sm:p-12 mb-24 animate-fade-in-up transition-all duration-500 ease-in-out hover:shadow-2xl relative overflow-hidden hover:scale-[1.02] hover:-translate-y-2">
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x"></div>
          <h2 className="text-3xl sm:text-4xl font-bold text-indigo-800 mb-8 sm:mb-12 relative inline-block">
            Blue's Barking Mission
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
        
        <div className="flex justify-center mb-24">
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-gradient-x"></div>
        </div>
        
        <div id="donation-form" className="bg-white bg-opacity-90 rounded-3xl shadow-lg p-6 sm:p-12 transition-all duration-500 ease-in-out hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-indigo-800 mb-8">Lend a Paw! 🐾</h2>
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
                setDonationAmountToken={setDonationAmountToken}
                message={message}
                setMessage={setMessage}
                isNetworkSwitching={isNetworkSwitching}
                isContractLoading={isContractLoading}
                isUSDCContractLoading={isUSDCContractLoading}
                handleDonate={handleDonate}
                isUSDCSupported={isUSDCSupported}
                tokenPrice={tokenPrice}
              />
            </div>
            <div className="flex flex-col justify-between lg:border-l lg:border-indigo-200 lg:pl-12">
              <div>
                <AppPreview />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center my-24">
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-gradient-x"></div>
        </div>

        <div className="animate-fade-in-up">
          <Roadmap scrollToDonationForm={scrollToDonationForm} />
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 z-50"
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
};

export default DonationsPage;
