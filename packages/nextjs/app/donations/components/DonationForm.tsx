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

  return (
    <div className="flex flex-col items-center bg-white bg-opacity-90 backdrop-blur-lg p-8 rounded-xl shadow-2xl w-full max-w-md">
      <ChainSelector selectedChain={selectedChain} setSelectedChain={setSelectedChain} />

      <div className="flex items-center justify-between w-full mb-4">
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
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            {useUSDC ? "USDC" : "Native"}
          </span>
        </label>
      </div>
      {!isUSDCSupported && (
        <div className="text-xs text-red-500 mb-2 flex items-center">
          <span>USDC is not supported on this chain</span>
          <span
            className="ml-1 cursor-help"
            title="USDC may not be available on all chains. Check the chain's documentation for supported tokens."
          >
            ⓘ
          </span>
        </div>
      )}

      <DonationAmountSelector donationAmountUSD={donationAmountUSD} setDonationAmountUSD={setDonationAmountUSD} />

      <div className="text-sm text-gray-600 mb-2">
        Donation Amount: {donationAmountToken || "0"} {tokenSymbol} (~${donationAmountUSD || "0"})
      </div>
      <div className="text-sm text-gray-600 mb-2">
        {useUSDC
          ? `USDC Balance: ${usdcBalance || "..."} USDC`
          : `Native Balance: ${nativeBalance || "..."} ${tokenSymbol}`}
      </div>
      {isInsufficientBalance && (
        <div className="text-xs text-red-500 mb-2">Insufficient balance for this donation amount</div>
      )}
      <textarea
        placeholder="Your Message (optional)"
        value={message}
        onChange={e => setMessage(e.target.value)}
        className="textarea textarea-bordered w-full mb-6 px-4 py-3 rounded-xl"
      />
      {error && <div className="text-xs text-red-500 mb-2">{error}</div>}
      <button
        onClick={handleDonate}
        disabled={
          isNetworkSwitching ||
          currentChainId !== selectedChain ||
          isInsufficientBalance ||
          isContractLoading ||
          (useUSDC && isUSDCContractLoading)
        }
        className="btn btn-primary w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-full shadow-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isNetworkSwitching
          ? "Switch Network"
          : currentChainId !== selectedChain
          ? "Switch Network"
          : isInsufficientBalance
          ? "Insufficient Balance"
          : `Donate Now with ${tokenSymbol}`}
      </button>
    </div>
  );
};
