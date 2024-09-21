import React, { useCallback, useEffect, useMemo, useState } from "react";
import { chains } from "../../../utils/scaffold-eth/chains";
import ChainSelect from "./ChainSelect";
import { DonationAmountSelector } from "./DonationAmountSelector";
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
}) => {
  const [selectedToken, setSelectedToken] = useState("native");
  const [tokenSelectKey, setTokenSelectKey] = useState(0);

  const currentBalance = selectedToken === "usdc" ? usdcBalance : nativeBalance;
  const isInsufficientBalance = parseFloat(donationAmountToken) > parseFloat(currentBalance);
  const isLoading = isNetworkSwitching || isContractLoading || (selectedToken === "usdc" && isUSDCContractLoading);

  const chainOptions = chains.map(chain => ({
    id: chain.id,
    name: chain.name,
  }));

  const getChainInfo = useCallback((chainId: number | null) => {
    return chains.find(chain => chain.id === chainId);
  }, []);

  const handleChainChange = useCallback(
    (chainId: number | null) => {
      console.log(`Chain changed to: ${chainId}`);
      setSelectedChain(chainId);
      setSelectedToken("native");
      setDonationAmountUSD("0");
      setMessage("");
      setTokenSelectKey(prevKey => prevKey + 1);
    },
    [setSelectedChain, setDonationAmountUSD, setMessage],
  );

  const handleTokenChange = useCallback(
    (tokenId: string) => {
      console.log(`Token changed to: ${tokenId}`);
      setSelectedToken(tokenId);
      setDonationAmountUSD("0");
    },
    [setDonationAmountUSD],
  );

  const tokenOptions = useMemo(() => {
    if (!selectedChain) return [];
    const chainInfo = getChainInfo(selectedChain);
    console.log(`Getting token options for chain: ${selectedChain}`);
    console.log(`Native balance: ${nativeBalance}, USDC balance: ${usdcBalance}`);
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

  useEffect(() => {
    console.log("TokenOptions updated:", tokenOptions);
  }, [tokenOptions]);

  useEffect(() => {
    if (selectedChain) {
      console.log(`Chain changed to: ${selectedChain}`);
    }
  }, [selectedChain]);

  useEffect(() => {
    console.log(`TokenSymbol updated: ${tokenSymbol}`);
  }, [tokenSymbol]);

  return (
    <div className="w-full bg-white bg-opacity-50 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="mb-8 space-y-6">
        <div className="transition-all duration-300 transform hover:scale-102">
          <ChainSelect
            label="Select Chain"
            options={chainOptions}
            value={selectedChain}
            onChange={handleChainChange}
            isLoading={isNetworkSwitching}
            disabled={false}
            className="w-full"
          />
        </div>

        <div className="transition-all duration-300 transform hover:scale-102">
          <TokenSelect
            key={tokenSelectKey}
            label="Select Token"
            options={tokenOptions}
            value={selectedToken}
            onChange={handleTokenChange}
            isLoading={isUSDCContractLoading}
            disabled={!selectedChain}
            className="w-full"
            selectedChain={selectedChain}
          />
        </div>

        <div className="transition-all duration-300 transform hover:scale-102">
          <DonationAmountSelector donationAmountUSD={donationAmountUSD} setDonationAmountUSD={setDonationAmountUSD} />
        </div>
      </div>

      <div className="text-lg text-indigo-800 mb-6 text-center bg-indigo-100 rounded-lg p-4 shadow-inner">
        Donation Amount:{" "}
        <span className="font-bold text-2xl">
          {donationAmountToken || "0"} {selectedToken === "usdc" ? "USDC" : (getChainInfo(selectedChain)?.nativeCurrency?.symbol || tokenSymbol)}
        </span>
        <br />
        <span className="text-sm text-indigo-600">(~${donationAmountUSD || "0"} USD)</span>
      </div>

      <textarea
        placeholder="Your Message (optional)"
        value={message}
        onChange={e => setMessage(e.target.value)}
        className="w-full mb-8 px-4 py-3 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-none shadow-inner"
        rows={4}
      />

      <button
        onClick={handleDonate}
        disabled={isLoading || currentChainId !== selectedChain || isInsufficientBalance}
        className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-lg rounded-lg shadow-md hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden"
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <svg
              className="animate-spin h-8 w-8 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
        )}
        <span className={isLoading ? "invisible" : ""}>
          {isNetworkSwitching
            ? "Switching Network..."
            : currentChainId !== selectedChain
            ? "Switch Network"
            : isInsufficientBalance
            ? "Insufficient Balance"
            : `Donate Now with ${selectedToken === "usdc" ? "USDC" : (getChainInfo(selectedChain)?.nativeCurrency?.symbol || tokenSymbol)}`}
        </span>
      </button>
    </div>
  );
};
