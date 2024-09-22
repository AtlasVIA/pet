import React, { useCallback, useMemo } from "react";
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
  tokenPrice: number;
  useUSDC: boolean;
  toggleTokenType: () => void;
}

export const DonationForm: React.FC<DonationFormProps> = ({
  selectedChain,
  setSelectedChain,
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
  tokenPrice,
  useUSDC,
  toggleTokenType,
}) => {
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
        name: chainInfo?.nativeCurrency?.symbol || tokenSymbol,
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
  }, [selectedChain, tokenSymbol, isUSDCSupported, nativeBalance, usdcBalance, getChainInfo]);

  const currentBalance = useUSDC ? usdcBalance : nativeBalance;
  const isInsufficientBalance = parseFloat(donationAmountToken) > parseFloat(currentBalance);
  const isLoading = isNetworkSwitching || isContractLoading || (useUSDC && isUSDCContractLoading);

  const buttonText = useMemo(() => {
    if (isNetworkSwitching) return "Switching Network...";
    if (currentChainId !== selectedChain) return "Switch Network";
    if (isInsufficientBalance) return "Insufficient Balance";
    return `Donate Now with ${useUSDC ? "USDC" : getChainInfo(selectedChain)?.nativeCurrency?.symbol || tokenSymbol}`;
  }, [isNetworkSwitching, currentChainId, selectedChain, isInsufficientBalance, useUSDC, getChainInfo, tokenSymbol]);

  return (
    <div className="donation-form w-full bg-white bg-opacity-50 rounded-xl p-4 sm:p-6 shadow-lg">
      <div className="space-y-4 sm:space-y-6">
        <ChainSelect
          label="Select Chain"
          options={chainOptions}
          value={selectedChain}
          onChange={handleChainChange}
          isLoading={isNetworkSwitching}
          disabled={false}
          className="w-full"
        />

        <TokenSelect
          label="Select Token"
          options={tokenOptions}
          value={useUSDC ? "usdc" : "native"}
          onChange={handleTokenChange}
          isLoading={isUSDCContractLoading}
          disabled={!selectedChain}
          className="w-full"
          selectedChain={selectedChain}
        />

        <DonationAmountSelector
          donationAmountUSD={donationAmountUSD}
          setDonationAmountUSD={setDonationAmountUSD}
          selectedToken={useUSDC ? "usdc" : "native"}
          tokenPrice={tokenPrice}
          tokenSymbol={tokenSymbol}
        />
      </div>

      <textarea
        placeholder="Your Message (optional)"
        value={message}
        onChange={handleMessageChange}
        className="w-full mt-4 sm:mt-6 px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none shadow-inner"
        rows={4}
      />

      <button
        onClick={handleDonate}
        disabled={isLoading || currentChainId !== selectedChain || isInsufficientBalance}
        className="w-full mt-4 sm:mt-6 py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-lg rounded-lg shadow-md hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
      >
        {isLoading && <LoadingSpinner />}
        <span className={isLoading ? "invisible" : ""}>{buttonText}</span>
      </button>
    </div>
  );
};
