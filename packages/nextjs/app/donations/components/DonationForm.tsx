import React from "react";
import { ChainSelector } from "./ChainSelector";
import { DonationAmountSelector } from "./DonationAmountSelector";

interface DonationFormProps {
  selectedChain: number | null;
  setSelectedChain: (chain: number | null) => void;
  useUSDC: boolean;
  toggleTokenType: () => void;
  nativeBalance: string;
  usdcBalance: string;
  tokenSymbol: string;
  currentChainId: number | undefined;
  donationAmountUSD: string;
  setDonationAmountUSD: (amount: string) => void;
  donationAmountToken: string;
  message: string;
  setMessage: (message: string) => void;
  isNetworkSwitching: boolean;
  isContractLoading: boolean;
  isUSDCContractLoading: boolean;
  handleDonate: () => void;
  isUSDCSupported: boolean;
  error: string | null;
}

export const DonationForm: React.FC<DonationFormProps> = ({
  selectedChain,
  setSelectedChain,
  useUSDC,
  toggleTokenType,
  nativeBalance,
  usdcBalance,
  tokenSymbol,
  currentChainId,
  donationAmountUSD,
  setDonationAmountUSD,
  donationAmountToken,
  message,
  setMessage,
  isNetworkSwitching,
  isContractLoading,
  isUSDCContractLoading,
  handleDonate,
  isUSDCSupported,
  error,
}) => {
  const currentBalance = useUSDC ? usdcBalance : nativeBalance;
  const isInsufficientBalance = parseFloat(donationAmountToken) > parseFloat(currentBalance);
  const isLoading = isNetworkSwitching || isContractLoading || (useUSDC && isUSDCContractLoading);

  return (
    <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-8 rounded-2xl shadow-2xl w-full max-w-lg mx-auto transition-all duration-300 hover:shadow-3xl">
      <h2 className="text-3xl font-bold text-center mb-8 text-indigo-800">Make a Donation</h2>
      
      <div className="mb-8">
        <ChainSelector selectedChain={selectedChain} setSelectedChain={setSelectedChain} />
      </div>

      <div className="flex items-center justify-between w-full mb-8">
        <span className="text-sm font-medium text-gray-700">Select Token:</span>
        <label
          className={`relative inline-flex items-center ${
            isUSDCSupported ? "cursor-pointer" : "cursor-not-allowed opacity-50"
          }`}
        >
          <input
            type="checkbox"
            className="sr-only peer"
            checked={useUSDC}
            onChange={toggleTokenType}
            disabled={!isUSDCSupported || isUSDCContractLoading}
          />
          <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            {useUSDC ? "USDC" : "Native"}
          </span>
        </label>
      </div>
      {!isUSDCSupported && (
        <div className="text-xs text-red-500 mb-6 flex items-center justify-center bg-red-100 p-2 rounded-md">
          <span>USDC is not supported on this chain</span>
          <span
            className="ml-1 cursor-help"
            title="USDC may not be available on all chains. Check the chain's documentation for supported tokens."
          >
            ⓘ
          </span>
        </div>
      )}

      <div className="mb-8">
        <DonationAmountSelector donationAmountUSD={donationAmountUSD} setDonationAmountUSD={setDonationAmountUSD} />
      </div>

      <div className="text-sm text-gray-600 mb-2 text-center">
        Donation Amount: <span className="font-semibold">{donationAmountToken || "0"} {tokenSymbol}</span>
        <br />
        <span className="text-xs">(~${donationAmountUSD || "0"} USD)</span>
      </div>
      <div className="text-sm text-gray-600 mb-6 text-center">
        {useUSDC
          ? `USDC Balance: ${usdcBalance || "..."} USDC`
          : `Native Balance: ${nativeBalance || "..."} ${tokenSymbol}`}
      </div>
      {isInsufficientBalance && (
        <div className="text-xs text-red-500 mb-6 text-center bg-red-100 p-2 rounded-md">
          Insufficient balance for this donation amount
        </div>
      )}
      <textarea
        placeholder="Your Message (optional)"
        value={message}
        onChange={e => setMessage(e.target.value)}
        className="w-full mb-8 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-none"
        rows={4}
      />
      {error && (
        <div className="text-xs text-red-500 mb-6 text-center bg-red-100 p-2 rounded-md">
          {error}
        </div>
      )}
      <button
        onClick={handleDonate}
        disabled={isLoading || currentChainId !== selectedChain || isInsufficientBalance}
        className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative"
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        )}
        <span className={isLoading ? 'invisible' : ''}>
          {isNetworkSwitching
            ? "Switching Network..."
            : currentChainId !== selectedChain
            ? "Switch Network"
            : isInsufficientBalance
            ? "Insufficient Balance"
            : `Donate Now with ${tokenSymbol}`}
        </span>
      </button>
    </div>
  );
};
