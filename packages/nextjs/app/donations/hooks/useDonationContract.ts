import { useCallback, useEffect, useMemo, useState } from "react";
import { useChainInfo } from "./useChainInfo";
import { formatEther, formatUnits, parseEther, parseUnits } from "viem";
import { useAccount, useBalance, useChainId } from "wagmi";
import { useDeployedContractInfo, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

export const useDonationContract = (selectedChain: number | null) => {
  const { address } = useAccount();
  const { effectiveChainId, usdcAddress, nativeSymbol } = useChainInfo(selectedChain);
  const { switchNetwork } = useTargetNetwork();
  const currentChainId = useChainId();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<{ message: string; details?: string } | null>(null);

  const { data: usdcContractData, isLoading: isUSDCContractLoading } = useDeployedContractInfo("USDC");

  const { writeContractAsync: writeDonationsContractAsync } = useScaffoldWriteContract("Donations");
  const { writeContractAsync: writeUSDCDonationsContractAsync } = useScaffoldWriteContract("Donations");

  const { writeContractAsync: approveUSDC } = useScaffoldWriteContract("USDC");

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

  const isCorrectNetwork = currentChainId === effectiveChainId;

  const handleDonation = useCallback(
    async (amountUSD: string, message: string, isNative: boolean, tokenPrice: number) => {
      setIsProcessing(true);
      setError(null);

      try {
        // Input validation
        if (typeof amountUSD !== 'string') {
          throw new Error(`Invalid amount type: ${typeof amountUSD}`);
        }

        amountUSD = amountUSD.trim();
        if (amountUSD === '') {
          throw new Error("Amount is empty");
        }

        // Ensure the amount is in the correct format (remove any thousand separators and use . as decimal separator)
        amountUSD = amountUSD.replace(/,/g, '');
        if (!/^\d*\.?\d*$/.test(amountUSD)) {
          throw new Error(`Invalid amount format: ${amountUSD}`);
        }

        const numericAmountUSD = Number(amountUSD);
        if (isNaN(numericAmountUSD)) {
          throw new Error(`Amount is not a valid number: ${amountUSD}`);
        }

        if (numericAmountUSD <= 0) {
          throw new Error(`Amount must be greater than 0: ${amountUSD}`);
        }

        // Check for valid token price
        if (isNative && (isNaN(tokenPrice) || tokenPrice <= 0)) {
          throw new Error(`Invalid token price: ${tokenPrice}`);
        }

        // Switch network if needed
        if (!isCorrectNetwork) {
          if (effectiveChainId) {
            await switchNetwork(effectiveChainId);
            // Wait for the chain to be updated
            await new Promise<void>((resolve) => {
              const checkChain = () => {
                if (currentChainId === effectiveChainId) {
                  resolve();
                } else {
                  setTimeout(checkChain, 100);
                }
              };
              checkChain();
            });
          } else {
            throw new Error("Effective chain ID is undefined");
          }
        }

        let donationHash;
        if (isNative) {
          // Convert USD to native token amount
          const nativeAmount = numericAmountUSD / tokenPrice;
          let parsedAmount;
          if (nativeAmount < 1e-18) {
            parsedAmount = BigInt(1); // Minimum amount (1 wei)
          } else {
            parsedAmount = parseEther(nativeAmount.toFixed(18));
          }

          donationHash = await writeDonationsContractAsync({
            functionName: "donate",
            args: [message],
            value: parsedAmount,
          });
        } else {
          const usdcAmount = parseUnits(amountUSD, 6);

          // Approve USDC spending
          await approveUSDC({
            functionName: "approve",
            args: [usdcContractData?.address, usdcAmount],
          });

          // Donate USDC
          donationHash = await writeUSDCDonationsContractAsync({
            functionName: "donateUSDC",
            args: [usdcAmount, message],
          });
        }

        console.log(`${isNative ? "Native" : "USDC"} donation transaction hash:`, donationHash);
        setIsProcessing(false);
        return donationHash;
      } catch (error) {
        console.error("Donation failed:", error);
        let errorMessage = "An unexpected error occurred";
        let errorDetails = "Please try again. If the problem persists, contact support.";

        if (error instanceof Error) {
          errorMessage = "Donation failed";
          errorDetails = `Error: ${error.message}. Please check your input and try again.`;
        }
        handleError(errorMessage, errorDetails);
      }
    },
    [effectiveChainId, switchNetwork, writeDonationsContractAsync, writeUSDCDonationsContractAsync, approveUSDC, handleError, isCorrectNetwork, currentChainId, usdcContractData?.address],
  );

  useEffect(() => {
    console.log("Current chain ID:", currentChainId);
    console.log("Effective chain ID:", effectiveChainId);
    console.log("Is correct network:", isCorrectNetwork);
  }, [currentChainId, effectiveChainId, isCorrectNetwork]);

  return {
    donateNative: useCallback(
      (amountUSD: string, message: string, tokenPrice: number) => handleDonation(amountUSD, message, true, tokenPrice),
      [handleDonation],
    ),
    donateUSDC: useCallback(
      (amountUSD: string, message: string) => handleDonation(amountUSD, message, false, 1),
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
