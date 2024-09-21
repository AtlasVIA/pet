import { useCallback, useEffect, useState } from "react";
import { useDonationContract } from "./useDonationContract";
import { useNetworkSwitching } from "./useNetworkSwitching";
import { useTokenPrice } from "./useTokenPrice";
import { parseUnits } from "viem";
import { useAccount, useChainId, usePublicClient, useWalletClient } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";
import { Chain, getUsdcAddress } from "~~/utils/scaffold-eth/contractAddresses";

interface Message {
  sender: string;
  message: string;
  amount: bigint;
  timestamp: bigint;
}

export const useDonations = (selectedChain: number | null) => {
  const { address: connectedAddress } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const currentChainId = useChainId();

  const [donationAmountUSD, setDonationAmountUSD] = useState("10");
  const [donationAmountToken, setDonationAmountToken] = useState("");
  const [message, setMessage] = useState("");
  const [totalDonationsUSD, setTotalDonationsUSD] = useState("0");
  const [messages, setMessages] = useState<Message[]>([]);
  const [useUSDC, setUseUSDC] = useState(false);
  const [isUSDCSupported, setIsUSDCSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { tokenSymbol, tokenPrice } = useTokenPrice(selectedChain);
  const {
    donationsContract,
    fetchTotalDonations,
    fetchRecentMessages,
    donateNative,
    donateUSDC,
    nativeBalance,
    usdcBalance,
    nativeSymbol,
    isContractLoading,
    isUSDCContractLoading,
  } = useDonationContract(walletClient);
  const { isNetworkSwitching, handleNetworkSwitch } = useNetworkSwitching();

  useEffect(() => {
    if (selectedChain) {
      const usdcAddress = getUsdcAddress(selectedChain as Chain);
      setIsUSDCSupported(!!usdcAddress);
      setUseUSDC(false); // Reset to native token when changing chains
    }
  }, [selectedChain]);

  const updateDonations = useCallback(async () => {
    if (isContractLoading) {
      return;
    }

    try {
      const total = await fetchTotalDonations();
      setTotalDonationsUSD(total);
    } catch (error) {
      console.error("Error fetching total donations:", error);
      setError("Failed to fetch donation data. Please try again later.");
    }

    try {
      const recent = await fetchRecentMessages();
      setMessages(recent);
    } catch (error) {
      console.error("Error fetching recent messages:", error);
      setError("Failed to fetch donation data. Please try again later.");
    }
  }, [fetchTotalDonations, fetchRecentMessages, isContractLoading]);

  useEffect(() => {
    updateDonations();
  }, [updateDonations]);

  useEffect(() => {
    if (tokenPrice !== undefined && tokenPrice > 0 && donationAmountUSD) {
      const tokenAmount = (parseFloat(donationAmountUSD) / tokenPrice).toFixed(useUSDC ? 6 : 18);
      setDonationAmountToken(tokenAmount);
    } else {
      setDonationAmountToken("");
    }
  }, [donationAmountUSD, tokenPrice, useUSDC]);

  const handleDonate = async () => {
    if (!donationAmountToken || isNaN(Number(donationAmountToken))) {
      notification.error("Please enter a valid donation amount.");
      return;
    }

    if (!selectedChain) {
      notification.error("Please select a blockchain.");
      return;
    }

    const switched = await handleNetworkSwitch(selectedChain);
    if (!switched) return;

    try {
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
      setDonationAmountUSD("");
      setMessage("");
      await updateDonations();
    } catch (error) {
      console.error("Donation failed", error);
      setError(error instanceof Error ? error.message : "Donation failed. Please try again.");
      notification.error(error instanceof Error ? error.message : "Donation failed. Please try again.");
    }
  };

  const toggleTokenType = () => {
    if (isUSDCSupported) {
      setUseUSDC(!useUSDC);
    } else {
      notification.warning("USDC is not supported on this chain.");
    }
  };

  return {
    donationAmountUSD,
    setDonationAmountUSD,
    donationAmountToken,
    message,
    setMessage,
    totalDonationsUSD,
    messages,
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
    updateDonations,
  };
};
