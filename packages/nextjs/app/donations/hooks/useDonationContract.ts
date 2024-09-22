import { useCallback, useEffect, useMemo, useState } from "react";
import { useChainInfo } from "./useChainInfo";
import { formatEther, formatUnits, parseEther, parseUnits } from "viem";
import { useAccount, useBalance, useChainId } from "wagmi";
import { useDeployedContractInfo, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

export const useDonationContract = (selectedChain: number | null) => {
  const { address } = useAccount();
  const { effectiveChainId, usdcAddress, nativeSymbol } = useChainInfo(selectedChain);
  const { switchNetwork } = useTargetNetwork();
  const currentChainId = useChainId();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<{ message: string; details?: string } | null>(null);

  const { data: usdcContractData, isLoading: isUSDCContractLoading } = useDeployedContractInfo("USDC");
  const { data: donationsContractData, isLoading: isDonationsContractLoading } = useDeployedContractInfo("Donations");

  const { writeContractAsync: writeDonationsContractAsync } = useScaffoldWriteContract("Donations");
  const { writeContractAsync: writeUSDCDonationsContractAsync } = useScaffoldWriteContract("Donations");

  const { writeContractAsync: approveUSDC } = useScaffoldWriteContract("USDC");
  const { data: allowance } = useScaffoldReadContract("USDC");

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
    console.error(`Error: ${errorMessage}`, errorDetails);
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
        console.log(`Starting ${isNative ? "native" : "USDC"} donation process`);
        console.log(`Amount: ${amountUSD} USD, Message: ${message}`);

        // Input validation
        if (typeof amountUSD !== "string") {
          throw new Error(`Invalid amount type: ${typeof amountUSD}`);
        }

        amountUSD = amountUSD.trim();
        if (amountUSD === "") {
          throw new Error("Amount is empty");
        }

        // Ensure the amount is in the correct format (remove any thousand separators and use . as decimal separator)
        amountUSD = amountUSD.replace(/,/g, "");
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
          console.log(`Switching network to ${effectiveChainId}`);
          if (effectiveChainId) {
            await switchNetwork(effectiveChainId);
            // Wait for the chain to be updated
            await new Promise<void>(resolve => {
              const checkChain = () => {
                if (currentChainId === effectiveChainId) {
                  console.log("Network switch completed");
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

          console.log(`Donating native token: ${parsedAmount.toString()} wei`);
          donationHash = await writeDonationsContractAsync({
            functionName: "donate",
            args: [message],
            value: parsedAmount,
          });
        } else {
          // Check if USDC contract address is set
          if (!usdcContractData?.address) {
            throw new Error("USDC contract address is not set");
          }

          const usdcAmount = parseUnits(amountUSD, 6);
          console.log(`USDC amount to donate: ${usdcAmount.toString()}`);

          // Check if we have sufficient allowance
          console.log(`Current allowance: ${allowance?.toString()}`);
          if (!allowance || allowance < usdcAmount) {
            console.log("Insufficient allowance, approving USDC spending");
            const approvalTx = await approveUSDC({
              functionName: "approve",
              args: [donationsContractData?.address, usdcAmount],
            });
            console.log("USDC allowance approved, transaction hash:", approvalTx);
          } else {
            console.log("Sufficient allowance available");
          }

          // Donate USDC
          console.log("Initiating USDC donation");
          console.log(usdcAmount);
          donationHash = await writeUSDCDonationsContractAsync({
            functionName: "donateUSDC",
            args: [usdcAmount, message],
          });
          console.log("USDC donation transaction hash:", donationHash);
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
    [
      effectiveChainId,
      switchNetwork,
      writeDonationsContractAsync,
      writeUSDCDonationsContractAsync,
      approveUSDC,
      handleError,
      isCorrectNetwork,
      currentChainId,
      usdcContractData?.address,
      allowance,
    ],
  );

  useEffect(() => {
    console.log("Current chain ID:", currentChainId);
    console.log("Effective chain ID:", effectiveChainId);
    console.log("Is correct network:", isCorrectNetwork);
    console.log("USDC contract address:", usdcContractData?.address);
  }, [currentChainId, effectiveChainId, isCorrectNetwork, usdcContractData?.address]);

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
