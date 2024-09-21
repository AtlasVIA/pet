import React, { useState, useEffect } from "react";

interface DonationAmountSelectorProps {
  donationAmountUSD: string;
  setDonationAmountUSD: (amount: string) => void;
  setDonationAmountToken: (amount: string) => void;
  selectedToken: string;
  tokenPrice: number;
  tokenSymbol: string;
}

export const DonationAmountSelector: React.FC<DonationAmountSelectorProps> = ({
  donationAmountUSD,
  setDonationAmountUSD,
  setDonationAmountToken,
  selectedToken,
  tokenPrice,
  tokenSymbol,
}) => {
  const [showOtherAmount, setShowOtherAmount] = useState(false);
  const [inputAmount, setInputAmount] = useState(donationAmountUSD);
  const donationOptionsUSD = ["10", "50", "100", "500", "1000"];

  useEffect(() => {
    setInputAmount(donationAmountUSD);
  }, [donationAmountUSD]);

  const handleAmountChange = (amount: string) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 0) {
      setInputAmount("");
      setDonationAmountUSD("0");
      setDonationAmountToken("0");
      return;
    }

    setInputAmount(amount);
    setDonationAmountUSD(amount);

    if (selectedToken === "usdc") {
      setDonationAmountToken(amount);
    } else if (tokenPrice > 0) {
      const tokenAmount = (numAmount / tokenPrice).toFixed(18);
      setDonationAmountToken(tokenAmount);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-lg font-semibold text-indigo-800 mb-4">💖 Select Your Donation Amount</label>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {donationOptionsUSD.map(amount => (
          <button
            key={amount}
            onClick={() => {
              handleAmountChange(amount);
              setShowOtherAmount(false);
            }}
            className={`px-4 py-2 rounded-lg font-bold transition-all duration-200 ${
              donationAmountUSD === amount && !showOtherAmount
                ? "bg-indigo-600 text-white shadow-md transform scale-105"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:shadow-sm"
            }`}
          >
            ${amount}
          </button>
        ))}
        <button
          onClick={() => {
            handleAmountChange("");
            setShowOtherAmount(true);
          }}
          className={`px-4 py-2 rounded-lg font-bold transition-all duration-200 ${
            showOtherAmount
              ? "bg-indigo-600 text-white shadow-md transform scale-105"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:shadow-sm"
          }`}
        >
          Other
        </button>
      </div>
      {showOtherAmount && (
        <div className="relative mt-4">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
            {selectedToken === "usdc" ? "$" : ""}
          </span>
          <input
            type="text"
            placeholder={`Enter custom amount${selectedToken === "usdc" ? " in USD" : ` in ${tokenSymbol}`}`}
            value={inputAmount}
            onChange={e => handleAmountChange(e.target.value)}
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          />
          {selectedToken !== "usdc" && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600">
              {tokenSymbol}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
