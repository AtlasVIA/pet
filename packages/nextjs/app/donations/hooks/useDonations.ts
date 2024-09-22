import { useCallback, useMemo, useState } from "react";
import { useChainInfo } from "./useChainInfo";
import { useNetworkSwitching } from "./useNetworkSwitching";
import { useTokenBalances } from "./useTokenBalances";
import { useTokenPrice } from "./useTokenPrice";
import { parseUnits } from "viem";
import { useDeployedContractInfo, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export const useDonations = (selectedChain: number | null) => {
  const { effectiveChainId, isUSDCSupported, currentChainId, usdcAddress } = useChainInfo(selectedChain);
  const { nativeBalance, usdcBalance } = useTokenBalances(selectedChain);

  const [donationAmountUSD, setDonationAmountUSD] = useState("10");
  const [message, setMessage] = useState("");
  const [useUSDC, setUseUSDC] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { tokenSymbol, tokenPrice } = useTokenPrice(selectedChain);
  const { isNetworkSwitching, handleNetworkSwitch } = useNetworkSwitching();

  const { data: usdcContractData, isLoading: isUSDCContractLoading } = useDeployedContractInfo("USDC");

  const donationAmountToken = useMemo(() => {
    if (useUSDC) return donationAmountUSD;
    return tokenPrice > 0 ? (parseFloat(donationAmountUSD) / tokenPrice).toFixed(18) : "0";
  }, [donationAmountUSD, tokenPrice, useUSDC]);

  const { writeAsync: writeDonateNative } = useScaffoldWriteContract({
    contractName: "Donations",
    functionName: "donate",
    value: donationAmountToken ? parseUnits(donationAmountToken, 18) : undefined,
  });

  const { writeAsync: writeDonateUSDC } = useScaffoldWriteContract({
    contractName: "Donations",
    functionName: "donateUSDC",
  });

  const { writeAsync: writeApproveUSDC } = useScaffoldWriteContract({
    contractName: "USDC",
    functionName: "approve",
  });

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

  const donateNative = useCallback(
    async (amount: string, message: string) => {
      try {
        const tx = await writeDonateNative({ args: [message] });
        await tx.wait();
        return tx;
      } catch (error) {
        console.error("Error in donateNative:", error);
        throw new Error("Failed to process native token donation. Please try again.");
      }
    },
    [writeDonateNative],
  );

  const donateUSDC = useCallback(
    async (amount: string, message: string) => {
      if (!usdcAddress) {
        throw new Error("USDC address not available. Please check your connection.");
      }

      try {
        if (typeof writeApproveUSDC === 'function') {
          console.log("Approving USDC...");
          const approveTx = await writeApproveUSDC({
            args: [usdcAddress, parseUnits(amount, 6)],
          });
          await approveTx.wait();
          console.log("USDC approved successfully");
        } else {
          console.warn("USDC approval function not available. Proceeding without approval.");
        }

        console.log("Donating USDC...");
        const donateTx = await writeDonateUSDC({
          args: [parseUnits(amount, 6), message],
        });
        await donateTx.wait();
        console.log("USDC donated successfully");
        return donateTx;
      } catch (error) {
        console.error("Error in donateUSDC:", error);
        throw new Error("Failed to process USDC donation. Please try again.");
      }
    },
    [usdcAddress, writeApproveUSDC, writeDonateUSDC],
  );

  const handleDonate = useCallback(async () => {
    if (!donationAmountUSD || isNaN(Number(donationAmountUSD))) {
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
        await donateUSDC(donationAmountUSD, message);
      } else {
        await donateNative(donationAmountToken, message);
      }
      notification.success("Donation successful!");
    } catch (error) {
      handleError(error);
    }
  }, [
    donationAmountUSD,
    donationAmountToken,
    selectedChain,
    handleNetworkSwitch,
    useUSDC,
    isUSDCContractLoading,
    donateUSDC,
    donateNative,
    message,
    handleError,
  ]);

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
    isUSDCContractLoading,
    effectiveChainId,
  };
};
