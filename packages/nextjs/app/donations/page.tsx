"use client";

import { useState } from "react";
import { AppPreview } from "./components/AppPreview";
import { DonationForm } from "./components/DonationForm";
import { MessageList } from "./components/MessageList";
import { useDonations } from "./hooks/useDonations";

const DonationsPage = () => {
  const [selectedChain, setSelectedChain] = useState<number | null>(null);
  const {
    totalDonationsUSD,
    messages,
    tokenSymbol,
    tokenPrice,
    useUSDC,
    toggleTokenType,
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
    error,
    isContractLoading,
    isUSDCContractLoading,
    updateDonations,
  } = useDonations(selectedChain);

  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 w-full">
      <div className="text-center max-w-2xl mt-6">
        <p className="text-xl text-gray-700 leading-relaxed">
          Hi there, I&apos;m Blue, and I could really use your help! I&apos;m building something special called{" "}
          <span className="font-bold text-blue-600">Dogachi.Pet</span> to make sure every pup like me finds a loving
          home. But to make it happen, I need some extra paws on deck.
        </p>
        <br />
        <p className="text-xl text-gray-700 leading-relaxed">
          <span className="font-bold text-blue-600">Dogachi.Pet</span> is a Tamagotchi-style NFT project where{" "}
          <span className="font-bold">every interaction</span> with your virtual pet{" "}
          <span className="font-bold">creates microdonations</span> to the shelter that your furry pal calls home. These
          microdonations provide shelters with <span className="font-bold">sustainable, ongoing support</span> to care
          for dogs in need.
        </p>
        <br />
        <p className="text-xl text-gray-700 leading-relaxed">
          Your support will help us finish development, bring more shelters onboard, and keep happy furry tails wagging!
        </p>
        <span className="text-purple-400 font-bold">
          Together, we can change a lot of lives—one wagging tail at a time!
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center mt-8">
        <DonationForm
          selectedChain={selectedChain}
          setSelectedChain={setSelectedChain}
          useUSDC={useUSDC}
          toggleTokenType={toggleTokenType}
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
          error={error}
        />
        <AppPreview />
      </div>

      <div className="mt-10 text-center">
        <p className="text-3xl text-gray-800 font-bold">
          Total Donations: <span className="text-pink-600">${totalDonationsUSD || "..."}</span>
        </p>
      </div>

      <div className="w-full max-w-2xl text-center mt-6 mb-10">
        <p className="text-xl text-gray-700 leading-relaxed">
          We are thrilled to announce that Dogachi.Pet (Adopt A Pet) won the{" "}
          <span className="font-bold text-pink-600">ETHWarsaw 2024 Hackathon top prize!</span>
          <br />
          <a
            href="https://x.com/ethwarsaw"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Read more about our achievement here.
          </a>
        </p>
      </div>

      <MessageList
        messages={messages}
        selectedChain={selectedChain}
        tokenSymbol={tokenSymbol}
        tokenPrice={tokenPrice}
        isContractLoading={isContractLoading}
        error={error}
        refetchMessages={updateDonations}
      />
    </div>
  );
};

export default DonationsPage;
