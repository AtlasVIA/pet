import { useCallback, useEffect, useState } from "react";
import { useDonationContract } from "./useDonationContract";
import { useNetworkSwitching } from "./useNetworkSwitching";
import { useTokenPrice } from "./useTokenPrice";
import { parseUnits } from "viem";
import { useAccount, useChainId, usePublicClient, useWalletClient } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";
import { Chain, getUsdcAddress } from "~~/utils/scaffold-eth/contractAddresses";

export const useDonations = (selectedChain: number | null) => {
  const { address: connectedAddress } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const currentChainId = useChainId();

  const [donationAmountUSD, setDonationAmountUSD] = useState("10");
  const [donationAmountToken, setDonationAmountToken] = useState("");
  const [message, setMessage] = useState("");
  const [useUSDC, setUseUSDC] = useState(false);
  const [isUSDCSupported, setIsUSDCSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { tokenSymbol, tokenPrice } = useTokenPrice(selectedChain);
  const {
    donationsContract,
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

  const fetchBalances = useCallback(async (chainId: number) => {
    console.log(`Fetching balances for chain: ${chainId}`);
    // The balances are now automatically updated through the useBalance hooks in useDonationContract
    // So we don't need to manually fetch them here
  }, []);

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
      await fetchBalances(selectedChain);
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
    fetchBalances,
  };
};
