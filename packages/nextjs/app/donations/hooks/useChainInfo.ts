import { useMemo } from "react";
import { useChainId } from "wagmi";
import { chains } from "~~/utils/scaffold-eth/chains";
import { Chain, getUsdcAddress } from "~~/utils/scaffold-eth/contractAddresses";

/**
 * A custom hook that provides chain-related information for the donation system.
 * This hook centralizes chain logic to reduce redundancy across other hooks.
 *
 * @param selectedChain - The currently selected chain ID, or null if no chain is selected
 * @returns An object containing various chain-related information and utilities
 */
export const useChainInfo = (selectedChain: number | null) => {
  const currentChainId = useChainId();

  // Determine the effective chain ID, using the selected chain if available, otherwise the current chain
  const effectiveChainId = useMemo(() => selectedChain || currentChainId, [selectedChain, currentChainId]);

  // Check if USDC is supported on the effective chain
  const isUSDCSupported = useMemo(
    () => (effectiveChainId ? !!getUsdcAddress(effectiveChainId as Chain) : false),
    [effectiveChainId],
  );

  // Get the native token symbol for the effective chain
  const nativeSymbol = useMemo(() => {
    const chainInfo = chains.find(chain => chain.id === effectiveChainId);
    return chainInfo?.nativeCurrency?.symbol || "ETH";
  }, [effectiveChainId]);

  // Get the USDC address for the effective chain
  const usdcAddress = useMemo(() => getUsdcAddress(effectiveChainId as Chain), [effectiveChainId]);

  return {
    effectiveChainId,
    isUSDCSupported,
    nativeSymbol,
    usdcAddress,
    currentChainId,
  };
};
