import { useMemo } from "react";
import { useChainInfo } from "./useChainInfo";
import { formatEther, formatUnits } from "viem";
import { useAccount, useBalance } from "wagmi";

export const useTokenBalances = (selectedChain: number | null) => {
  const { address } = useAccount();
  const { effectiveChainId, usdcAddress } = useChainInfo(selectedChain);

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

  const formattedNativeBalance = useMemo(
    () => (nativeBalance ? formatEther(nativeBalance.value) : "0"),
    [nativeBalance],
  );

  const formattedUsdcBalance = useMemo(() => (usdcBalance ? formatUnits(usdcBalance.value, 6) : "0"), [usdcBalance]);

  return {
    nativeBalance: formattedNativeBalance,
    usdcBalance: formattedUsdcBalance,
  };
};
