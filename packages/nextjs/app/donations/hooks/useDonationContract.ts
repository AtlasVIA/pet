import { useCallback, useEffect } from "react";
import { formatEther, formatUnits, parseUnits } from "viem";
import { useAccount, useBalance, useChainId } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useScaffoldContract } from "~~/hooks/scaffold-eth/useScaffoldContract";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { chains } from "~~/utils/scaffold-eth/chains";
import { getUsdcAddress } from "~~/utils/scaffold-eth/contractAddresses";

export const useDonationContract = (walletClient: any, selectedChain: number | null) => {
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
    chainId: selectedChain || chainId,
  });

  const usdcAddress = selectedChain ? getUsdcAddress(selectedChain) : undefined;

  const { data: usdcBalance } = useBalance({
    address,
    token: usdcAddress,
    watch: true,
    chainId: selectedChain || chainId,
  });

  useEffect(() => {
    console.log("useDonationContract: Chain changed", {
      selectedChain,
      chainId,
      nativeBalance: nativeBalance?.formatted,
      usdcBalance: usdcBalance?.formatted,
      usdcAddress,
    });
  }, [selectedChain, chainId, nativeBalance, usdcBalance, usdcAddress]);

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
      if (!donationsContract || !address || !usdcAddress) {
        throw new Error(
          "Donations contract, user address, or USDC contract not available. Please check your connection and try again.",
        );
      }

      try {
        // First, approve the USDC transfer
        const approveTx = await walletClient.writeContract({
          address: usdcAddress,
          abi: usdcContractData?.abi,
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
    [donationsContract, address, usdcAddress, usdcContractData, walletClient, isContractLoading, isUSDCContractLoading],
  );

  const getNativeSymbol = useCallback(() => {
    const chainInfo = chains.find(chain => chain.id === (selectedChain || chainId));
    return chainInfo?.nativeCurrency?.symbol || targetNetwork.nativeCurrency.symbol;
  }, [selectedChain, chainId, targetNetwork.nativeCurrency.symbol]);

  return {
    donationsContract,
    fetchTotalDonations,
    fetchRecentMessages,
    donateNative,
    donateUSDC,
    nativeBalance: nativeBalance ? formatEther(nativeBalance.value) : "0",
    usdcBalance: usdcBalance ? formatUnits(usdcBalance.value, 6) : "0",
    nativeSymbol: getNativeSymbol(),
    isContractLoading,
    isUSDCContractLoading,
  };
};
