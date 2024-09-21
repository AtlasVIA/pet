import { Chain, contractAddresses } from "./chains";

export const getContractAddresses = (chainId: Chain) => {
  return contractAddresses[chainId] || null;
};

export const getUsdcAddress = (chainId: Chain) => {
  const addresses = getContractAddresses(chainId);
  return addresses ? addresses.usdc : null;
};

export const getProtocctpAddress = (chainId: Chain) => {
  const addresses = getContractAddresses(chainId);
  return addresses ? addresses.protocctp : null;
};
