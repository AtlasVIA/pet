import { useCallback } from "react";
import { decodeEventLog } from "viem";
import { usePublicClient } from "wagmi";

const MAX_RETRIES = 30; // Maximum number of retries
const RETRY_INTERVAL = 5000; // 5 seconds between retries
const TOTAL_TIMEOUT = 300000; // 5 minutes total timeout

// Helper function to safely stringify objects with BigInt values
const safeStringify = (obj: any): string => {
  return JSON.stringify(obj, (_, value) => (typeof value === "bigint" ? value.toString() : value));
};

export const useWaitForTransaction = () => {
  const publicClient = usePublicClient();

  const waitForTransaction = useCallback(
    async (hash: `0x${string}`, isSendTransaction: boolean): Promise<string | undefined> => {
      return new Promise((resolve, reject) => {
        let retries = 0;
        const startTime = Date.now();

        const checkReceipt = async () => {
          try {
            if (!publicClient) {
              console.log("Public client is not available");
              return;
            }

            console.log(`Attempt ${retries + 1}: Fetching transaction receipt for hash:`, hash);
            let receipt;
            try {
              receipt = await publicClient.getTransactionReceipt({ hash });
            } catch (error) {
              if (retries < MAX_RETRIES && Date.now() - startTime < TOTAL_TIMEOUT) {
                retries++;
                setTimeout(checkReceipt, RETRY_INTERVAL);
              } else {
                console.log("Max retries reached or timeout exceeded");
                reject(error);
              }
              return;
            }

            console.log("Transaction receipt status:", receipt.status);
            console.log(receipt.logs);
            console.log("Transaction receipt:", safeStringify(receipt));

            if (receipt && receipt.status === "success") {
              resolve(undefined);
            } else if (receipt && receipt.status === "reverted") {
              console.log("Transaction reverted");
              reject(new Error("Transaction failed"));
            } else {
              if (retries < MAX_RETRIES && Date.now() - startTime < TOTAL_TIMEOUT) {
                retries++;
                console.log(`Transaction not yet confirmed, retrying in ${RETRY_INTERVAL / 1000} seconds...`);
                setTimeout(checkReceipt, RETRY_INTERVAL);
              } else {
                console.log("Max retries reached or timeout exceeded");
                reject(new Error("Transaction confirmation timeout"));
              }
            }
          } catch (error) {
            console.error("Error in checkReceipt:", error);
          }
        };
        checkReceipt();
      });
    },
    [publicClient],
  );

  return { waitForTransaction };
};