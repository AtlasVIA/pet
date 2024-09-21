import { PublicClient } from "viem";

export const waitForTransaction = async (hash: `0x${string}`, publicClient: PublicClient) => {
  if (!publicClient) {
    throw new Error("Public client not available");
  }
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  return receipt;
};
