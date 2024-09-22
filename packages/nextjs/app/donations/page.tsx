"use client";

import { useState } from "react";
import { AppPreview } from "./components/AppPreview";
import BlueMission from "./components/BlueMission";
import { DonationForm } from "./components/DonationForm";
import DonationPageHero from "./components/DonationPageHero";
import Roadmap from "./components/Roadmap";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { useChainInfo } from "./hooks/useChainInfo";
import { useDonationContract } from "./hooks/useDonationContract";
import useScrolling from "./hooks/useScrolling";

const DonationsPage = () => {
  const [selectedChain, setSelectedChain] = useState<number | null>(null);
  const [donationAmountUSD, setDonationAmountUSD] = useState("10");
  const [message, setMessage] = useState("");
  const [useUSDC, setUseUSDC] = useState(false);

  const { nativeSymbol, isUSDCSupported, tokenPrice } = useChainInfo(selectedChain);

  const {
    donateNative,
    donateUSDC,
    nativeBalance,
    usdcBalance,
    isContractLoading,
    isUSDCContractLoading,
    isProcessing,
    error,
    isCorrectNetwork,
  } = useDonationContract(selectedChain);

  const { showScrollTop, scrollToDonationForm, scrollToTop } = useScrolling();

  const toggleTokenType = () => setUseUSDC(!useUSDC);

  const handleDonate = async () => {
    try {
      if (useUSDC) {
        await donateUSDC(donationAmountUSD, message);
      } else {
        if (tokenPrice === 0) {
          throw new Error("Token price is not available. Please try again later.");
        }
        await donateNative(donationAmountUSD, message, tokenPrice);
      }
      // Handle successful donation (e.g., show success message, reset form)
      setMessage("");
      setDonationAmountUSD("10");
    } catch (err) {
      // Error handling is now managed by useDonationContract
      console.error("Donation failed:", err);
    }
  };

  const donationAmountToken = useUSDC
    ? donationAmountUSD
    : tokenPrice > 0
    ? (parseFloat(donationAmountUSD) / tokenPrice).toFixed(6)
    : "0";

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-100 bg-opacity-90 relative">
      <div
        className="absolute inset-0 bg-opacity-10 bg-white pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      ></div>
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 mx-auto relative z-10">
        <DonationPageHero scrollToDonationForm={scrollToDonationForm} />

        <BlueMission />

        <div className="flex justify-center mb-24">
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-gradient-x"></div>
        </div>

        <div
          id="donation-form"
          className="bg-white bg-opacity-90 rounded-3xl shadow-lg p-6 sm:p-12 transition-all duration-500 ease-in-out hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-2"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-indigo-800 mb-8">Lend a Paw! 🐾</h2>
              <DonationForm
                selectedChain={selectedChain}
                setSelectedChain={setSelectedChain}
                nativeBalance={nativeBalance}
                usdcBalance={usdcBalance}
                nativeSymbol={nativeSymbol}
                donationAmountUSD={donationAmountUSD}
                setDonationAmountUSD={setDonationAmountUSD}
                donationAmountToken={donationAmountToken}
                message={message}
                setMessage={setMessage}
                isContractLoading={isContractLoading}
                isUSDCContractLoading={isUSDCContractLoading}
                handleDonate={handleDonate}
                isUSDCSupported={isUSDCSupported}
                tokenPrice={tokenPrice}
                useUSDC={useUSDC}
                toggleTokenType={toggleTokenType}
                isProcessing={isProcessing}
                error={error}
                isCorrectNetwork={isCorrectNetwork}
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

      <ScrollToTopButton showScrollTop={showScrollTop} scrollToTop={scrollToTop} />
    </div>
  );
};

export default DonationsPage;
