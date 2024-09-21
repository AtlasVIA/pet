import { useScaffoldContract } from "~~/hooks/scaffold-eth/useScaffoldContract";

export const useUSDCContract = (walletClient: any) => {
  const { data: usdcContract } = useScaffoldContract({
    contractName: "USDC",
    walletClient,
  });

  return { usdcContract };
};
