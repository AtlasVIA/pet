import { useEffect, useState } from "react";
import { chainOptions } from "../utils/chainOptions";
import axios from "axios";

export const useTokenPrice = (selectedChain: number | null) => {
  const [tokenSymbol, setTokenSymbol] = useState("ETH");
  const [tokenPrice, setTokenPrice] = useState(0);

  useEffect(() => {
    const fetchTokenPrice = async () => {
      if (!selectedChain) return;

      const chainInfo = chainOptions.find(c => c.id === selectedChain);
      if (!chainInfo) return;

      setTokenSymbol(chainInfo.symbol);

      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${chainInfo.priceId}&vs_currencies=usd`,
        );
        const price = response.data[chainInfo.priceId]?.usd || 0;
        setTokenPrice(price);
      } catch (error) {
        console.error("Failed to fetch token price", error);
        setTokenPrice(0);
      }
    };

    fetchTokenPrice();
  }, [selectedChain]);

  return { tokenSymbol, tokenPrice };
};
