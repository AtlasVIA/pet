import { useState } from "react";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { notification } from "~~/utils/scaffold-eth";

export const useNetworkSwitching = () => {
  const { targetNetwork, switchNetwork } = useTargetNetwork();
  const [isNetworkSwitching, setIsNetworkSwitching] = useState(false);

  const handleNetworkSwitch = async (selectedChain: number) => {
    if (selectedChain !== targetNetwork.id) {
      setIsNetworkSwitching(true);
      const switched = await switchNetwork(selectedChain);
      setIsNetworkSwitching(false);
      if (!switched) {
        notification.error("Failed to switch network. Please try again.");
        return false;
      }
    }
    return true;
  };

  return { isNetworkSwitching, handleNetworkSwitch };
};
