import { useMemo } from "react";
import { useTokenPrice } from "./useTokenPrice";
import { useChainId } from "wagmi";
import { Chain } from "~~/utils/scaffold-eth/chains";
import { getUsdcAddress } from "~~/utils/scaffold-eth/contractAddresses";

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

  // Use the useTokenPrice hook to get token price and symbol
  const { tokenPrice, tokenSymbol } = useTokenPrice(effectiveChainId);

  // Check if USDC is supported on the effective chain
  const isUSDCSupported = useMemo(
    () => (effectiveChainId ? !!getUsdcAddress(effectiveChainId as Chain) : false),
    [effectiveChainId],
  );

  // Get the USDC address for the effective chain
  const usdcAddress = useMemo(() => getUsdcAddress(effectiveChainId as Chain), [effectiveChainId]);

  return {
    effectiveChainId,
    isUSDCSupported,
    nativeSymbol: tokenSymbol,
    usdcAddress,
    currentChainId,
    tokenPrice,
  };
};
