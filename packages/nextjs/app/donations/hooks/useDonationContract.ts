import { useCallback, useMemo } from "react";
import { formatEther, formatUnits, parseUnits } from "viem";
import { useAccount, useBalance, useChainId } from "wagmi";
import { useDeployedContractInfo, useScaffoldContract } from "~~/hooks/scaffold-eth";
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

  const effectiveChainId = useMemo(() => selectedChain || chainId, [selectedChain, chainId]);

  const { data: nativeBalance } = useBalance({
    address,
    watch: true,
    chainId: effectiveChainId,
  });

  const usdcAddress = useMemo(() => getUsdcAddress(effectiveChainId), [effectiveChainId]);

  const { data: usdcBalance } = useBalance({
    address,
    token: usdcAddress,
    watch: true,
    chainId: effectiveChainId,
  });

  const handleContractError = useCallback((error: unknown, errorMessage: string) => {
    console.error(errorMessage, error);
    throw new Error(`${errorMessage} Please try again.`);
  }, []);

  const donateNative = useCallback(async (amount: string, message: string) => {
    if (!donationsContract || !address) {
      throw new Error("Donation contract or user address not available. Please check your connection.");
    }

    try {
      return await donationsContract.write.donate([message], {
        value: parseUnits(amount, 18),
      });
    } catch (error) {
      handleContractError(error, "Failed to process native token donation.");
    }
  }, [donationsContract, address, handleContractError]);

  const donateUSDC = useCallback(async (amount: string, message: string) => {
    if (!donationsContract || !address || !usdcAddress || !usdcContractData?.abi) {
      throw new Error("Required contracts or addresses not available. Please check your connection.");
    }

    try {
      const approveTx = await walletClient.writeContract({
        address: usdcAddress,
        abi: usdcContractData.abi,
        functionName: "approve",
        args: [donationsContract.address, parseUnits(amount, 6)],
      });
      await approveTx.wait();

      return await donationsContract.write.donateUSDC([parseUnits(amount, 6), message]);
    } catch (error) {
      handleContractError(error, "Failed to process USDC donation.");
    }
  }, [donationsContract, address, usdcAddress, usdcContractData, walletClient, handleContractError]);

  const nativeSymbol = useMemo(() => {
    const chainInfo = chains.find(chain => chain.id === effectiveChainId);
    return chainInfo?.nativeCurrency?.symbol || targetNetwork.nativeCurrency.symbol;
  }, [effectiveChainId, targetNetwork.nativeCurrency.symbol]);

  const formattedNativeBalance = useMemo(() => 
    nativeBalance ? formatEther(nativeBalance.value) : "0"
  , [nativeBalance]);

  const formattedUsdcBalance = useMemo(() => 
    usdcBalance ? formatUnits(usdcBalance.value, 6) : "0"
  , [usdcBalance]);

  return {
    donationsContract,
    donateNative,
    donateUSDC,
    nativeBalance: formattedNativeBalance,
    usdcBalance: formattedUsdcBalance,
    nativeSymbol,
    isContractLoading,
    isUSDCContractLoading,
  };
};
