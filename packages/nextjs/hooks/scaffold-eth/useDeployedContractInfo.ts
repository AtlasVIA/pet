import { useEffect, useState } from "react";
import { useTargetNetwork } from "./useTargetNetwork";
import { useIsMounted } from "usehooks-ts";
import { usePublicClient } from "wagmi";
import { Chain } from "~~/utils/scaffold-eth/chains";
import { Contract, ContractCodeStatus, ContractName, contracts } from "~~/utils/scaffold-eth/contract";
import { getProtocctpAddress, getUsdcAddress } from "~~/utils/scaffold-eth/contractAddresses";
import { usdcAbi } from "~~/utils/scaffold-eth/usdcAbi";

/**
 * Gets the matching contract info for the provided contract name from the contracts present in deployedContracts.ts
 * and externalContracts.ts corresponding to targetNetworks configured in scaffold.config.ts
 * Also includes USDC and PROTOCCTP contracts from the newly added chains
 */
export const useDeployedContractInfo = <TContractName extends ContractName | "USDC" | "PROTOCCTP">(
  contractName: TContractName,
  chainId?: number | undefined,
) => {
  const isMounted = useIsMounted();
  const { targetNetwork } = useTargetNetwork();
  const [status, setStatus] = useState<ContractCodeStatus>(ContractCodeStatus.LOADING);
  const [deployedContract, setDeployedContract] = useState<Contract<TContractName> | undefined>(undefined);

  const effectiveChainId = chainId || targetNetwork.id;
  const publicClient = usePublicClient({ chainId: effectiveChainId });

  useEffect(() => {
    const checkContractDeployment = async () => {
      if (!isMounted() || !publicClient) return;

      try {
        let contractData: Contract<TContractName> | undefined;

        if (contractName === "USDC") {
          const address = getUsdcAddress(effectiveChainId as Chain);
          if (address) {
            contractData = { address, abi: usdcAbi } as Contract<TContractName>;
          }
        } else if (contractName === "PROTOCCTP") {
          const address = getProtocctpAddress(effectiveChainId as Chain);
          if (address) {
            contractData = { address, abi: [] } as Contract<TContractName>; // Note: We don't have the ABI for PROTOCCTP
          }
        } else {
          contractData = contracts?.[effectiveChainId]?.[contractName as ContractName] as Contract<TContractName>;
        }

        if (!contractData) {
          setStatus(ContractCodeStatus.NOT_FOUND);
          return;
        }

        const code = await publicClient.getBytecode({
          address: contractData.address,
        });

        if (code === "0x") {
          setStatus(ContractCodeStatus.NOT_FOUND);
        } else {
          setStatus(ContractCodeStatus.DEPLOYED);
          setDeployedContract(contractData);
        }
      } catch (e) {
        console.error(`Error checking contract deployment for ${contractName}:`, e);
        setStatus(ContractCodeStatus.NOT_FOUND);
      }
    };

    checkContractDeployment();
  }, [isMounted, contractName, effectiveChainId, publicClient]);

  return {
    data: status === ContractCodeStatus.DEPLOYED ? deployedContract : undefined,
    isLoading: status === ContractCodeStatus.LOADING,
    error:
      status === ContractCodeStatus.NOT_FOUND
        ? new Error(`Contract ${contractName} not found on chain ${effectiveChainId}`)
        : undefined,
  };
};
