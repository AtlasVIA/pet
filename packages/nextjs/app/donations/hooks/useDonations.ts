import { useState, useMemo, useCallback } from "react";
import { parseUnits } from "viem";
import { useChainInfo } from "./useChainInfo";
import { useNetworkSwitching } from "./useNetworkSwitching";
import { useTokenPrice } from "./useTokenPrice";
import { useTokenBalances } from "./useTokenBalances";
import { useWalletClient } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";
import { useScaffoldContract, useDeployedContractInfo } from "~~/hooks/scaffold-eth";

export const useDonations = (selectedChain: number | null) => {
  const { data: walletClient } = useWalletClient();
  const { effectiveChainId, isUSDCSupported, currentChainId, usdcAddress } = useChainInfo(selectedChain);
  const { nativeBalance, usdcBalance } = useTokenBalances(selectedChain);

  const [donationAmountUSD, setDonationAmountUSD] = useState("10");
  const [message, setMessage] = useState("");
  const [useUSDC, setUseUSDC] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { tokenSymbol, tokenPrice } = useTokenPrice(selectedChain);
  const { isNetworkSwitching, handleNetworkSwitch } = useNetworkSwitching();

  const { data: donationsContract, isLoading: isContractLoading } = useScaffoldContract({
    contractName: "Donations",
    walletClient,
  });
  const { data: usdcContractData, isLoading: isUSDCContractLoading } = useDeployedContractInfo("USDC");

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

  const donateNative = useCallback(async (amount: string, message: string) => {
    if (!donationsContract) {
      throw new Error("Donation contract not available. Please check your connection.");
    }

    try {
      return await donationsContract.write.donate([message], {
        value: parseUnits(amount, 18),
      });
    } catch (error) {
      throw new Error("Failed to process native token donation. Please try again.");
    }
  }, [donationsContract]);

  const donateUSDC = useCallback(async (amount: string, message: string) => {
    if (!donationsContract || !usdcAddress || !usdcContractData?.abi) {
      throw new Error("Required contracts or addresses not available. Please check your connection.");
    }

    try {
      const approveTx = await walletClient?.writeContract({
        address: usdcAddress,
        abi: usdcContractData.abi,
        functionName: "approve",
        args: [donationsContract.address, parseUnits(amount, 6)],
      });
      await approveTx?.wait();

      return await donationsContract.write.donateUSDC([parseUnits(amount, 6), message]);
    } catch (error) {
      throw new Error("Failed to process USDC donation. Please try again.");
    }
  }, [donationsContract, usdcAddress, usdcContractData, walletClient]);

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
    tokenSymbol: useUSDC ? "USDC" : tokenSymbol,
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
    effectiveChainId,
  };
};
