import React, { useState } from "react";

interface DonationAmountSelectorProps {
  donationAmountUSD: string;
  setDonationAmountUSD: (amount: string) => void;
}

export const DonationAmountSelector: React.FC<DonationAmountSelectorProps> = ({
  donationAmountUSD,
  setDonationAmountUSD,
}) => {
  const [showOtherAmount, setShowOtherAmount] = useState(false);
  const donationOptionsUSD = ["10", "50", "100", "500", "1000"];

  return (
    <>
      <label className="block text-lg font-semibold text-gray-800 mb-6">💖 Select Your Donation Amount</label>
      <div className="grid grid-cols-3 gap-4 mb-6 w-full">
        {donationOptionsUSD.map(amount => (
          <button
            key={amount}
            onClick={() => {
              setDonationAmountUSD(amount);
              setShowOtherAmount(false);
            }}
            className={`px-5 py-3 rounded-full font-bold ${
              donationAmountUSD === amount && !showOtherAmount
                ? "bg-pink-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            ${amount}
          </button>
        ))}
        <button
          onClick={() => {
            setDonationAmountUSD("");
            setShowOtherAmount(true);
          }}
          className={`px-5 py-3 rounded-full font-bold ${
            showOtherAmount ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Other
        </button>
      </div>
      {showOtherAmount && (
        <input
          type="text"
          placeholder="Enter Amount in USD"
          value={donationAmountUSD}
          onChange={e => setDonationAmountUSD(e.target.value)}
          className="input input-bordered w-full mb-4 px-4 py-3 rounded-full"
        />
      )}
    </>
  );
};
