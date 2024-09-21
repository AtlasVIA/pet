import { useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import scaffoldConfig from "~~/scaffold.config";
import { useGlobalState } from "~~/services/store/store";
import { ChainWithAttributes } from "~~/utils/scaffold-eth";
import { NETWORKS_EXTRA_DATA } from "~~/utils/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

/**
 * Retrieves the connected wallet's network from scaffold.config or defaults to the 0th network in the list if the wallet is not connected.
 * Also provides a function to switch networks.
 */
export function useTargetNetwork(): {
  targetNetwork: ChainWithAttributes;
  switchNetwork: (chainId: number) => Promise<boolean>;
} {
  const { chain } = useAccount();
  const targetNetwork = useGlobalState(({ targetNetwork }) => targetNetwork);
  const setTargetNetwork = useGlobalState(({ setTargetNetwork }) => setTargetNetwork);

  useEffect(() => {
    const newSelectedNetwork = scaffoldConfig.targetNetworks.find(targetNetwork => targetNetwork.id === chain?.id);
    if (newSelectedNetwork && newSelectedNetwork.id !== targetNetwork.id) {
      setTargetNetwork(newSelectedNetwork);
    }
  }, [chain?.id, setTargetNetwork, targetNetwork.id]);

  const switchNetwork = async (chainId: number): Promise<boolean> => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
        return true;
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            const network = scaffoldConfig.targetNetworks.find(n => n.id === chainId);
            if (!network) {
              throw new Error(`Network configuration not found for chainId: ${chainId}`);
            }
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${chainId.toString(16)}`,
                  chainName: network.name,
                  nativeCurrency: network.nativeCurrency,
                  rpcUrls: [network.rpcUrls.default.http[0]],
                  blockExplorerUrls: [network.blockExplorers?.default.url],
                },
              ],
            });
            return true;
          } catch (addError) {
            console.error("Failed to add network", addError);
            notification.error("Failed to add network. Please try again.");
            return false;
          }
        } else {
          console.error("Failed to switch network", switchError);
          notification.error("Failed to switch network. Please try again.");
          return false;
        }
      }
    } else {
      notification.error("Network switching not supported. Please change network manually in your wallet.");
      return false;
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
    [targetNetwork],
  );
}
