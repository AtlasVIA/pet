import { useCallback, useMemo, useState } from "react";
import { useChainInfo } from "./useChainInfo";
import { formatEther, formatUnits, parseEther, parseUnits } from "viem";
import { useAccount, useBalance } from "wagmi";
import { useDeployedContractInfo, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

export const useDonationContract = (selectedChain: number | null) => {
  const { address } = useAccount();
  const { effectiveChainId, usdcAddress, nativeSymbol } = useChainInfo(selectedChain);
  const { targetNetwork, switchNetwork } = useTargetNetwork();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<{ message: string; details?: string } | null>(null);

  const { data: usdcContractData, isLoading: isUSDCContractLoading } = useDeployedContractInfo("USDC");

  const { writeContractAsync: writeDonationsContractAsync } = useScaffoldWriteContract("Donations");

  const { data: nativeBalance } = useBalance({
    address,
    watch: true,
    chainId: effectiveChainId,
  });

  const { data: usdcBalance } = useBalance({
    address,
    token: usdcAddress,
    watch: true,
    chainId: effectiveChainId,
  });

  const handleError = useCallback((errorMessage: string, errorDetails?: string) => {
    setError({ message: errorMessage, details: errorDetails });
    setIsProcessing(false);
  }, []);

  const formattedNativeBalance = useMemo(
    () => (nativeBalance ? formatEther(nativeBalance.value) : "0"),
    [nativeBalance],
  );

  const formattedUsdcBalance = useMemo(() => (usdcBalance ? formatUnits(usdcBalance.value, 6) : "0"), [usdcBalance]);

  const isCorrectNetwork = targetNetwork.id === effectiveChainId;

  const handleDonation = useCallback(
    async (amount: string, message: string, isNative: boolean) => {
      setIsProcessing(true);
      setError(null);

      try {
        if (!isCorrectNetwork) {
          if (effectiveChainId) {
            await switchNetwork(effectiveChainId);
          } else {
            throw new Error("Effective chain ID is undefined");
          }
        }

        let donationHash;
        if (isNative) {
          donationHash = await writeDonationsContractAsync({
            functionName: "donate",
            args: [message],
            value: parseEther("0.1"),
          });
        } else {
          donationHash = await writeDonationsContractAsync({
            functionName: "donateUSDC",
            args: [parseUnits(amount, 6), message],
          });
        }

        console.log(`${isNative ? "Native" : "USDC"} donation transaction hash:`, donationHash);
        // You might want to add a function to wait for the transaction confirmation here

        setIsProcessing(false);
        return donationHash;
      } catch (error) {
        console.error("Donation failed:", error);
        let errorMessage = "An unexpected error occurred";
        let errorDetails = "Please try again. If the problem persists, contact support.";

        if (error instanceof Error) {
          if (error.message.includes("user rejected")) {
            errorMessage = "Transaction rejected";
            errorDetails = "You have canceled the transaction. Please try again if this was unintended.";
          } else if (error.message.includes("insufficient funds")) {
            errorMessage = "Insufficient funds";
            errorDetails = `You don't have enough ${
              isNative ? nativeSymbol : "USDC"
            } to complete this donation. Please check your balance and try again with a smaller amount.`;
          } else {
            errorMessage = "Transaction failed";
            errorDetails = `Error: ${error.message}. Please check your wallet settings. If this issue persists, please contact support.`;
          }
        }
        handleError(errorMessage, errorDetails);
      }
    },
    [isCorrectNetwork, effectiveChainId, switchNetwork, writeDonationsContractAsync, handleError, nativeSymbol],
  );

  return {
    donateNative: useCallback(
      (amount: string, message: string) => handleDonation(amount, message, true),
      [handleDonation],
    ),
    donateUSDC: useCallback(
      (amount: string, message: string) => handleDonation(amount, message, false),
      [handleDonation],
    ),
    nativeBalance: formattedNativeBalance,
    usdcBalance: formattedUsdcBalance,
    nativeSymbol,
    isUSDCContractLoading,
    isProcessing,
    error,
    isCorrectNetwork,
  };
};
