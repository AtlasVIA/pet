import { useEffect, useMemo } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import scaffoldConfig from "~~/scaffold.config";
import { useGlobalState } from "~~/services/store/store";
import { ChainWithAttributes } from "~~/utils/scaffold-eth";
import { NETWORKS_EXTRA_DATA } from "~~/utils/scaffold-eth";

/**
 * Retrieves the connected wallet's network from scaffold.config or defaults to the 0th network in the list if the wallet is not connected.
 * If a chainId is provided, it will attempt to switch to that network if not already on it.
 */
export function useTargetNetwork(desiredChainId?: number): {
  targetNetwork: ChainWithAttributes;
  switchNetwork?: (chainId: number) => Promise<void>;
} {
  const { chain } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const targetNetwork = useGlobalState(({ targetNetwork }) => targetNetwork);
  const setTargetNetwork = useGlobalState(({ setTargetNetwork }) => setTargetNetwork);

  useEffect(() => {
    const newSelectedNetwork = scaffoldConfig.targetNetworks.find(targetNetwork => targetNetwork.id === chain?.id);
    if (newSelectedNetwork && newSelectedNetwork.id !== targetNetwork.id) {
      setTargetNetwork(newSelectedNetwork);
    }
  }, [chain?.id, setTargetNetwork, targetNetwork.id]);

  useEffect(() => {
    if (desiredChainId && chainId !== desiredChainId && switchChain) {
      switchChain({ chainId: desiredChainId });
    }
  }, [desiredChainId, chainId, switchChain]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const switchNetwork = async (newChainId: number) => {
    if (switchChain) {
      await switchChain({ chainId: newChainId });
    }
  };

  return useMemo(
    () => ({
      targetNetwork: {
        ...targetNetwork,
        ...NETWORKS_EXTRA_DATA[targetNetwork.id],
      },
      switchNetwork,
    }),
    [targetNetwork, switchNetwork],
  );
}
