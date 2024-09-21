import { useCallback } from "react";
import { formatEther, formatUnits, parseUnits } from "viem";
import { useAccount, useBalance, useChainId } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useScaffoldContract } from "~~/hooks/scaffold-eth/useScaffoldContract";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

export const useDonationContract = (walletClient: any) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { data: donationsContract, isLoading: isContractLoading } = useScaffoldContract({
    contractName: "Donations",
    walletClient,
  });
  const { data: usdcContractData, isLoading: isUSDCContractLoading } = useDeployedContractInfo("USDC");

  const { targetNetwork } = useTargetNetwork();

  const { data: nativeBalance } = useBalance({
    address,
    watch: true,
    chainId,
  });

  const { data: usdcBalance } = useBalance({
    address,
    token: usdcContractData?.address,
    watch: true,
    chainId,
  });

  const fetchTotalDonations = useCallback(async () => {
    if (isContractLoading) {
      throw new Error("Contract is still loading. Please wait.");
    }
    if (!donationsContract) {
      throw new Error("Donations contract not available for the current chain.");
    }

    try {
      const total = await donationsContract.read.totalDonations();
      return formatEther(total);
    } catch (error) {
      console.error("Error fetching total donations:", error);
      throw new Error("Failed to fetch total donations. The contract might not be properly deployed on this chain.");
    }
  }, [donationsContract, isContractLoading]);

  const fetchRecentMessages = useCallback(async () => {
    if (isContractLoading) {
      throw new Error("Contract is still loading. Please wait.");
    }
    if (!donationsContract) {
      throw new Error("Donations contract not available for the current chain.");
    }

    try {
      const recent = await donationsContract.read.getMessages([5]);
      return recent;
    } catch (error) {
      console.error("Error fetching recent messages:", error);
      throw new Error("Failed to fetch recent messages. The contract might not be properly deployed on this chain.");
    }
  }, [donationsContract, isContractLoading]);

  const donateNative = useCallback(
    async (amount: string, message: string) => {
      if (isContractLoading) {
        throw new Error("Contract is still loading. Please wait.");
      }
      if (!donationsContract || !address) {
        throw new Error(
          "Donations contract or user address not available. Please check your connection and try again.",
        );
      }

      try {
        const tx = await donationsContract.write.donate([message], {
          value: parseUnits(amount, 18),
        });
        return tx;
      } catch (error) {
        console.error("Error donating native token:", error);
        throw new Error("Failed to process native token donation. Please try again or contact support.");
      }
    },
    [donationsContract, address, isContractLoading],
  );

  const donateUSDC = useCallback(
    async (amount: string, message: string) => {
      if (isContractLoading || isUSDCContractLoading) {
        throw new Error("Contracts are still loading. Please wait.");
      }
      if (!donationsContract || !address || !usdcContractData) {
        throw new Error(
          "Donations contract, user address, or USDC contract not available. Please check your connection and try again.",
        );
      }

      try {
        // First, approve the USDC transfer
        const approveTx = await walletClient.writeContract({
          address: usdcContractData.address,
          abi: usdcContractData.abi,
          functionName: "approve",
          args: [donationsContract.address, parseUnits(amount, 6)],
        });
        await approveTx.wait();

        // Then, call the donateUSDC function
        const tx = await donationsContract.write.donateUSDC([parseUnits(amount, 6), message]);
        return tx;
      } catch (error) {
        console.error("Error donating USDC:", error);
        throw new Error(
          "Failed to process USDC donation. Please ensure you have sufficient USDC balance and try again.",
        );
      }
    },
    [donationsContract, address, usdcContractData, walletClient, isContractLoading, isUSDCContractLoading],
  );

  return {
    donationsContract,
    fetchTotalDonations,
    fetchRecentMessages,
    donateNative,
    donateUSDC,
    nativeBalance: nativeBalance ? formatEther(nativeBalance.value) : "0",
    usdcBalance: usdcBalance ? formatUnits(usdcBalance.value, 6) : "0",
    nativeSymbol: targetNetwork.nativeCurrency.symbol,
    isContractLoading,
    isUSDCContractLoading,
  };
};
