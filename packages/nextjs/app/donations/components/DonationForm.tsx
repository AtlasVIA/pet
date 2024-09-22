import React, { useCallback, useEffect, useMemo, useState } from "react";
import { chains } from "../../../utils/scaffold-eth/chains";
import ChainSelect from "./ChainSelect";
import { DonationAmountSelector } from "./DonationAmountSelector";
import { LoadingSpinner } from "./LoadingSpinner";
import TokenSelect from "./TokenSelect";

interface DonationFormProps {
  selectedChain: number | null;
  setSelectedChain: (chain: number | null) => void;
  nativeBalance: string;
  usdcBalance: string;
  nativeSymbol: string;
  donationAmountUSD: string;
  setDonationAmountUSD: (amount: string) => void;
  donationAmountToken: string;
  message: string;
  setMessage: (message: string) => void;
  isContractLoading: boolean;
  isUSDCContractLoading: boolean;
  handleDonate: () => void;
  isUSDCSupported: boolean;
  tokenPrice: number;
  useUSDC: boolean;
  toggleTokenType: () => void;
  isProcessing: boolean;
  error: { message: string; details?: string } | null;
  isCorrectNetwork: boolean;
}

export const DonationForm: React.FC<DonationFormProps> = ({
  selectedChain,
  setSelectedChain,
  nativeBalance,
  usdcBalance,
  nativeSymbol,
  donationAmountUSD,
  setDonationAmountUSD,
  donationAmountToken,
  message,
  setMessage,
  isContractLoading,
  isUSDCContractLoading,
  handleDonate,
  isUSDCSupported,
  tokenPrice,
  useUSDC,
  toggleTokenType,
  isProcessing,
  error,
  isCorrectNetwork,
}) => {
  // State to handle amount-specific errors
  const [amountError, setAmountError] = useState<string | null>(null);

  // Memoized chain options for the ChainSelect component
  const chainOptions = useMemo(
    () =>
      chains.map(chain => ({
        id: chain.id,
        name: chain.name,
      })),
    [],
  );

  // Helper function to get chain info
  const getChainInfo = useCallback((chainId: number | null) => {
    return chains.find(chain => chain.id === chainId);
  }, []);

  // Handlers for form interactions
  const handleChainChange = useCallback(
    (chainId: number | null) => {
      setSelectedChain(chainId);
    },
    [setSelectedChain],
  );

  const handleTokenChange = useCallback(
    (tokenId: string) => {
      if ((tokenId === "usdc" && !useUSDC) || (tokenId === "native" && useUSDC)) {
        toggleTokenType();
      }
    },
    [useUSDC, toggleTokenType],
  );

  const handleMessageChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value);
    },
    [setMessage],
  );

  // Memoized token options for the TokenSelect component
  const tokenOptions = useMemo(() => {
    if (!selectedChain) return [];
    const chainInfo = getChainInfo(selectedChain);
    return [
      {
        id: "native",
        name: chainInfo?.nativeCurrency?.symbol || nativeSymbol,
        logo: `https://scan.vialabs.io/images/logos/chains/${selectedChain}.png`,
        balance: nativeBalance,
      },
      ...(isUSDCSupported
        ? [
            {
              id: "usdc",
              name: "USDC",
              logo: "https://anytoany.io/images/usdc-logo.png",
              balance: usdcBalance,
            },
          ]
        : []),
    ];
  }, [selectedChain, nativeSymbol, isUSDCSupported, nativeBalance, usdcBalance, getChainInfo]);

  // Determine the current balance based on the selected token
  const currentBalance = useUSDC ? usdcBalance : nativeBalance;
  
  // Check if the donation amount exceeds the current balance
  const isInsufficientBalance = parseFloat(donationAmountToken) > parseFloat(currentBalance);
  
  // Check if any loading state is active
  const isLoading = isProcessing || isContractLoading || (useUSDC && isUSDCContractLoading);
  
  // Validate the donation amount
  const isValidAmount = parseFloat(donationAmountUSD) > 0;

  // Determine the text to display on the donation button
  const buttonText = useMemo(() => {
    if (isProcessing) return "Processing...";
    if (!isCorrectNetwork) return "Switch Network";
    if (isInsufficientBalance) return "Insufficient Balance";
    if (!isValidAmount) return "Enter Valid Amount";
    return `Donate Now with ${useUSDC ? "USDC" : getChainInfo(selectedChain)?.nativeCurrency?.symbol || nativeSymbol}`;
  }, [isProcessing, isCorrectNetwork, isInsufficientBalance, isValidAmount, useUSDC, getChainInfo, selectedChain, nativeSymbol]);

  // Add logging to check button state
  useEffect(() => {
    console.log("Button state:", {
      isLoading,
      isCorrectNetwork,
      isInsufficientBalance,
      amountError,
      isValidAmount,
      donationAmountUSD,
      currentBalance,
      tokenPrice,
    });
  }, [isLoading, isCorrectNetwork, isInsufficientBalance, amountError, isValidAmount, donationAmountUSD, currentBalance, tokenPrice]);

  return (
    <div className="donation-form w-full bg-white bg-opacity-50 rounded-xl p-4 sm:p-6 shadow-lg">
      <div className="space-y-4 sm:space-y-6">
        <ChainSelect
          label="Select Chain"
          options={chainOptions}
          value={selectedChain}
          onChange={handleChainChange}
          isLoading={isProcessing}
          disabled={isProcessing}
          className="w-full"
        />

        <TokenSelect
          label="Select Token"
          options={tokenOptions}
          value={useUSDC ? "usdc" : "native"}
          onChange={handleTokenChange}
          isLoading={isUSDCContractLoading}
          disabled={!selectedChain || isProcessing}
          className="w-full"
          selectedChain={selectedChain}
        />

        <DonationAmountSelector
          donationAmountUSD={donationAmountUSD}
          setDonationAmountUSD={setDonationAmountUSD}
          selectedToken={useUSDC ? "usdc" : "native"}
          tokenPrice={tokenPrice}
          tokenSymbol={nativeSymbol}
          setAmountError={setAmountError}
        />
      </div>

      <textarea
        placeholder="Your Message (optional)"
        value={message}
        onChange={handleMessageChange}
        className="w-full mt-4 sm:mt-6 px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none shadow-inner"
        rows={4}
        disabled={isProcessing}
      />

      {/* Display any errors from the donation process */}
      {error && (
        <div className="mt-4 text-red-600 bg-red-100 border border-red-400 rounded-md p-3">
          <p className="font-bold">{error.message}</p>
          {error.details && <p className="text-sm mt-1">{error.details}</p>}
        </div>
      )}

      {/* Display any errors related to the donation amount */}
      {amountError && (
        <div className="mt-4 text-red-600 bg-red-100 border border-red-400 rounded-md p-3">
          <p className="font-bold">{amountError}</p>
        </div>
      )}

      {/* Display a warning if the user is not on the correct network */}
      {!isCorrectNetwork && (
        <div className="mt-4 text-yellow-600 bg-yellow-100 border border-yellow-400 rounded-md p-3">
          Please switch to the correct network to make a donation.
        </div>
      )}

      {/* Donation button */}
      <button
        onClick={handleDonate}
        disabled={isLoading || !isCorrectNetwork || isInsufficientBalance || !!amountError || !isValidAmount}
        className="w-full mt-4 sm:mt-6 py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-lg rounded-lg shadow-md hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
      >
        {isLoading && <LoadingSpinner />}
        <span className={isLoading ? "invisible" : ""}>{buttonText}</span>
      </button>
    </div>
  );
};
