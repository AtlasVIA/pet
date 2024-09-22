import { useState, useMemo, useCallback, useEffect } from "react";
import { useDonationContract } from "./useDonationContract";
import { useNetworkSwitching } from "./useNetworkSwitching";
import { useTokenPrice } from "./useTokenPrice";
import { useChainId, useWalletClient } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";
import { Chain, getUsdcAddress } from "~~/utils/scaffold-eth/contractAddresses";

export const useDonations = (selectedChain: number | null) => {
  const { data: walletClient } = useWalletClient();
  const currentChainId = useChainId();

  const [donationAmountUSD, setDonationAmountUSD] = useState("10");
  const [message, setMessage] = useState("");
  const [useUSDC, setUseUSDC] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { tokenSymbol, tokenPrice } = useTokenPrice(selectedChain);
  const {
    donateNative,
    donateUSDC,
    nativeBalance,
    usdcBalance,
    nativeSymbol,
    isContractLoading,
    isUSDCContractLoading,
  } = useDonationContract(walletClient, selectedChain);
  const { isNetworkSwitching, handleNetworkSwitch } = useNetworkSwitching();

  const isUSDCSupported = useMemo(() => 
    selectedChain ? !!getUsdcAddress(selectedChain as Chain) : false
  , [selectedChain]);

  const donationAmountToken = useMemo(() => {
    if (useUSDC) return donationAmountUSD;
    return tokenPrice > 0 ? (parseFloat(donationAmountUSD) / tokenPrice).toFixed(18) : "0";
  }, [donationAmountUSD, tokenPrice, useUSDC]);

  const setDonationAmount = useCallback((amount: string) => {
    setDonationAmountUSD(amount);
  }, []);

  const setDonationMessage = useCallback((msg: string) => {
    setMessage(msg);
  }, []);

  const toggleTokenType = useCallback(() => {
    if (isUSDCSupported) {
      setUseUSDC(prev => !prev);
    } else {
      notification.warning("USDC is not supported on this chain.");
    }
  }, [isUSDCSupported]);

  const handleError = useCallback((error: unknown) => {
    console.error("Donation failed", error);
    const errorMessage = error instanceof Error ? error.message : "Donation failed. Please try again.";
    setError(errorMessage);
    notification.error(errorMessage);
  }, []);

  const handleDonate = useCallback(async () => {
    if (!donationAmountToken || isNaN(Number(donationAmountToken))) {
      notification.error("Please enter a valid donation amount.");
      return;
    }

    if (!selectedChain) {
      notification.error("Please select a blockchain.");
      return;
    }

    try {
      const switched = await handleNetworkSwitch(selectedChain);
      if (!switched) return;

      setError(null);
      if (useUSDC) {
        if (isUSDCContractLoading) {
          throw new Error("USDC contract is still loading. Please wait and try again.");
        }
        await donateUSDC(donationAmountToken, message);
      } else {
        await donateNative(donationAmountToken, message);
      }
      notification.success("Donation successful!");
    } catch (error) {
      handleError(error);
    }
  }, [donationAmountToken, selectedChain, handleNetworkSwitch, useUSDC, isUSDCContractLoading, donateUSDC, donateNative, message, handleError]);

  return {
    donationAmountUSD,
    setDonationAmountUSD: setDonationAmount,
    donationAmountToken,
    message,
    setMessage: setDonationMessage,
    tokenSymbol: useUSDC ? "USDC" : nativeSymbol,
    tokenPrice,
    isNetworkSwitching,
    useUSDC,
    toggleTokenType,
    nativeBalance,
    usdcBalance,
    handleDonate,
    selectedChain,
    currentChainId,
    isUSDCSupported,
    error,
    isContractLoading,
    isUSDCContractLoading,
  };
};
