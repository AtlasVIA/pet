import React, { useCallback, useEffect, useMemo, useState } from "react";

interface DonationAmountSelectorProps {
  donationAmountUSD: string;
  setDonationAmountUSD: (amount: string) => void;
  selectedToken: string;
  tokenPrice: number;
  tokenSymbol: string;
}

export const DonationAmountSelector: React.FC<DonationAmountSelectorProps> = ({
  donationAmountUSD,
  setDonationAmountUSD,
  selectedToken,
  tokenPrice,
  tokenSymbol,
}) => {
  const [showOtherAmount, setShowOtherAmount] = useState(false);
  const [inputAmount, setInputAmount] = useState(donationAmountUSD);

  const donationOptionsUSD = useMemo(() => ["10", "50", "100", "500", "1000"], []);

  useEffect(() => {
    setInputAmount(donationAmountUSD);
  }, [donationAmountUSD]);

  const handleAmountChange = useCallback(
    (amount: string) => {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount < 0) {
        setInputAmount("");
        setDonationAmountUSD("0");
        return;
      }

      setInputAmount(amount);
      setDonationAmountUSD(amount);
    },
    [setDonationAmountUSD],
  );

  const handleOptionClick = useCallback(
    (amount: string) => {
      handleAmountChange(amount);
      setShowOtherAmount(false);
    },
    [handleAmountChange],
  );

  const handleOtherClick = useCallback(() => {
    handleAmountChange("");
    setShowOtherAmount(true);
  }, [handleAmountChange]);

  const tokenAmount = useMemo(() => {
    if (selectedToken === "usdc" || tokenPrice <= 0) return donationAmountUSD;
    return (parseFloat(donationAmountUSD) / tokenPrice).toFixed(6);
  }, [donationAmountUSD, selectedToken, tokenPrice]);

  return (
    <div className="w-full">
      <label htmlFor="donation-amount" className="block text-lg font-semibold text-indigo-800 mb-4">
        💖 Select Your Donation Amount
      </label>
      <div className="grid grid-cols-3 gap-3 mb-4" role="group" aria-label="Donation amount options">
        {donationOptionsUSD.map(amount => (
          <button
            key={amount}
            onClick={() => handleOptionClick(amount)}
            className={`px-4 py-2 rounded-lg font-bold transition-all duration-200 ${
              donationAmountUSD === amount && !showOtherAmount
                ? "bg-indigo-600 text-white shadow-md transform scale-105"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:shadow-sm"
            }`}
            aria-pressed={donationAmountUSD === amount && !showOtherAmount}
          >
            ${amount}
          </button>
        ))}
        <button
          onClick={handleOtherClick}
          className={`px-4 py-2 rounded-lg font-bold transition-all duration-200 ${
            showOtherAmount
              ? "bg-indigo-600 text-white shadow-md transform scale-105"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:shadow-sm"
          }`}
          aria-pressed={showOtherAmount}
        >
          Other
        </button>
      </div>
      {showOtherAmount && (
        <div className="relative mt-4">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">$</span>
          <input
            id="donation-amount"
            type="text"
            placeholder="Enter custom amount in USD"
            value={inputAmount}
            onChange={e => handleAmountChange(e.target.value)}
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            aria-label="Custom donation amount"
          />
        </div>
      )}
      {selectedToken !== "usdc" && (
        <div className="mt-2 text-sm text-gray-600">
          Estimated amount: {tokenAmount} {tokenSymbol}
        </div>
      )}
    </div>
  );
};
