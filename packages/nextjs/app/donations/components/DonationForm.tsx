import React, { useCallback, useEffect, useMemo, useState } from "react";
import { chains } from "../../../utils/scaffold-eth/chains";
import ChainSelect from "./ChainSelect";
import { DonationAmountSelector } from "./DonationAmountSelector";
import DonationSuccessPanel from "./DonationSuccessPanel";
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
  donateNative: (amountUSD: string, message: string, tokenPrice: number) => Promise<boolean>;
  donateUSDC: (amountUSD: string, message: string) => Promise<boolean>;
  isUSDCSupported: boolean;
  tokenPrice: number;
  useUSDC: boolean;
  toggleTokenType: () => void;
  isProcessing: boolean;
  error: { message: string; details?: string } | null;
  isCorrectNetwork: boolean;
  chainSwitched: boolean;
  resetChainSwitched: () => void;
  storedDonationParams: { amountUSD: string; message: string; isNative: boolean; tokenPrice: number } | null;
  executeDonation: (params: {
    amountUSD: string;
    message: string;
    isNative: boolean;
    tokenPrice: number;
  }) => Promise<boolean>;
  connectedChainId: number | null;
  isWalletConnected: boolean;
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
  donateNative,
  donateUSDC,
  isUSDCSupported,
  tokenPrice,
  useUSDC,
  toggleTokenType,
  isProcessing,
  error,
  isCorrectNetwork,
  chainSwitched,
  resetChainSwitched,
  storedDonationParams,
  executeDonation,
  connectedChainId,
  isWalletConnected,
}) => {
  const [amountError, setAmountError] = useState<string | null>(null);
  const [isReexecuting, setIsReexecuting] = useState(false);
  const [showSuccessPanel, setShowSuccessPanel] = useState(false);
  const [isDonationLoading, setIsDonationLoading] = useState(false);
  const [donationError, setDonationError] = useState<string | null>(null);
  const [successfulDonationAmount, setSuccessfulDonationAmount] = useState<string | null>(null);

  const chainOptions = useMemo(
    () =>
      chains.map(chain => ({
        id: chain.id,
        name: chain.name,
      })),
    [],
  );

  const getChainInfo = useCallback((chainId: number | null) => {
    return chains.find(chain => chain.id === chainId);
  }, []);

  const handleChainChange = useCallback(
    (chainId: number | null) => {
      setSelectedChain(chainId);
    },
    [setSelectedChain],
  );

  useEffect(() => {
    if (connectedChainId) {
      const connectedChainInfo = getChainInfo(connectedChainId);
      if (connectedChainInfo) {
        console.log(`Updating selected chain to connected chain: ${connectedChainId}`);
        setSelectedChain(connectedChainId);
      } else {
        console.log(
          `Connected chain ${connectedChainId} not supported, setting to first chain in list: ${chainOptions[0].id}`,
        );
        setSelectedChain(chainOptions[0].id);
      }
    } else {
      console.log("No connected chain detected");
    }
  }, [connectedChainId, setSelectedChain, getChainInfo, chainOptions]);

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

  const currentBalance = useUSDC ? usdcBalance : nativeBalance;
  const isInsufficientBalance = parseFloat(donationAmountToken) > parseFloat(currentBalance);
  const isLoading = isProcessing || isContractLoading || (useUSDC && isUSDCContractLoading);
  const isValidAmount = parseFloat(donationAmountUSD) > 0;

  const buttonText = useMemo(() => {
    if (isProcessing) return "Processing...";
    if (chainSwitched) return "Click to Complete Donation";
    if (isInsufficientBalance) return "Insufficient Balance";
    if (!isValidAmount) return "Enter Valid Amount";
    return `Donate Now with ${useUSDC ? "USDC" : getChainInfo(selectedChain)?.nativeCurrency?.symbol || nativeSymbol}`;
  }, [
    isProcessing,
    chainSwitched,
    isInsufficientBalance,
    isValidAmount,
    useUSDC,
    getChainInfo,
    selectedChain,
    nativeSymbol,
  ]);

  const handleDonate = useCallback(async () => {
    setIsDonationLoading(true);
    setDonationError(null);
    try {
      let success = false;
      if (chainSwitched && storedDonationParams) {
        success = await executeDonation(storedDonationParams);
        resetChainSwitched();
      } else if (useUSDC) {
        success = await donateUSDC(donationAmountUSD, message);
      } else {
        success = await donateNative(donationAmountUSD, message, tokenPrice);
      }
      if (success) {
        setSuccessfulDonationAmount(donationAmountUSD);
        setShowSuccessPanel(true);
      } else {
        setDonationError("Donation failed. Please try again.");
      }
    } catch (error) {
      console.error("Donation failed:", error);
      setDonationError("An unexpected error occurred. Please try again.");
    } finally {
      setIsDonationLoading(false);
    }
  }, [
    chainSwitched,
    storedDonationParams,
    executeDonation,
    resetChainSwitched,
    useUSDC,
    donateUSDC,
    donateNative,
    donationAmountUSD,
    message,
    tokenPrice,
  ]);

  const handleCloseSuccessPanel = useCallback(() => {
    setShowSuccessPanel(false);
    setMessage("");
    setSuccessfulDonationAmount(null);
  }, [setMessage]);

  const chainName = useMemo(() => {
    const chainInfo = getChainInfo(selectedChain);
    return chainInfo ? chainInfo.name : "Unknown Chain";
  }, [selectedChain, getChainInfo]);

  useEffect(() => {
    console.log("Form state:", {
      isLoading,
      isCorrectNetwork,
      isInsufficientBalance,
      amountError,
      isValidAmount,
      donationAmountUSD,
      currentBalance,
      tokenPrice,
      selectedChain,
      chainSwitched,
      isReexecuting,
      storedDonationParams,
      connectedChainId,
    });
  }, [
    isLoading,
    isCorrectNetwork,
    isInsufficientBalance,
    amountError,
    isValidAmount,
    donationAmountUSD,
    currentBalance,
    tokenPrice,
    selectedChain,
    chainSwitched,
    isReexecuting,
    storedDonationParams,
    connectedChainId,
  ]);

  return (
    <div
      className={`donation-form w-full bg-white bg-opacity-50 rounded-xl p-4 sm:p-6 shadow-lg ${
        !isWalletConnected ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="space-y-4 sm:space-y-6">
        <ChainSelect
          label="Select Chain"
          options={chainOptions}
          value={selectedChain}
          onChange={handleChainChange}
          isLoading={!isWalletConnected || isContractLoading}
          disabled={isProcessing || !isWalletConnected}
          className="w-full"
        />

        <TokenSelect
          label="Select Token"
          options={tokenOptions}
          value={useUSDC ? "usdc" : "native"}
          onChange={handleTokenChange}
          isLoading={!isWalletConnected || isUSDCContractLoading}
          disabled={!selectedChain || isProcessing || !isWalletConnected}
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
          disabled={!isWalletConnected}
        />
      </div>

      <textarea
        placeholder="Your Message (optional)"
        value={message}
        onChange={handleMessageChange}
        className="w-full mt-4 sm:mt-6 px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none shadow-inner"
        rows={4}
        disabled={isProcessing || !isWalletConnected}
      />

      {donationError && <div className="mt-4 text-red-500 text-sm">{donationError}</div>}

      <button
        onClick={handleDonate}
        disabled={
          isLoading ||
          isInsufficientBalance ||
          !!amountError ||
          (!chainSwitched && !isValidAmount) ||
          isReexecuting ||
          !isWalletConnected
        }
        className="w-full mt-4 sm:mt-6 py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-lg rounded-lg shadow-md hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
      >
        {isLoading && <LoadingSpinner />}
        <span className={isLoading ? "invisible" : ""}>{buttonText}</span>
      </button>

      <DonationSuccessPanel
        isVisible={showSuccessPanel}
        onClose={handleCloseSuccessPanel}
        donationAmount={successfulDonationAmount || ""}
        tokenType={useUSDC ? "USDC" : getChainInfo(selectedChain)?.nativeCurrency?.symbol || nativeSymbol}
        chainName={chainName}
        isLoading={isDonationLoading}
      />
    </div>
  );
};
