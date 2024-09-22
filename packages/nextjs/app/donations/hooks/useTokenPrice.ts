import { useEffect, useState } from "react";
import { chainOptions } from "../utils/chainOptions";
import axios from "axios";

// Static token prices (comment out when API is available)
const staticTokenPrices: { [key: string]: number } = {
  ethereum: 1800,
  "binance-smart-chain": 300,
  polygon: 0.8,
  avalanche: 15,
  fantom: 0.3,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CachedPrice {
  price: number;
  timestamp: number;
}

const getCachedPrice = (chainId: number): CachedPrice | null => {
  const cachedData = localStorage.getItem(`tokenPrice_${chainId}`);
  return cachedData ? JSON.parse(cachedData) : null;
};

const setCachedPrice = (chainId: number, price: number) => {
  const cacheData: CachedPrice = {
    price,
    timestamp: Date.now(),
  };
  localStorage.setItem(`tokenPrice_${chainId}`, JSON.stringify(cacheData));
};

export const useTokenPrice = (selectedChain: number | null) => {
  const [tokenSymbol, setTokenSymbol] = useState("ETH");
  const [tokenPrice, setTokenPrice] = useState(0);

  useEffect(() => {
    const fetchTokenPrice = async () => {
      if (!selectedChain) return;

      const chainInfo = chainOptions.find(c => c.id === selectedChain);
      if (!chainInfo) return;

      setTokenSymbol(chainInfo.symbol);

      // Check cache first
      const cachedPrice = getCachedPrice(selectedChain);
      if (cachedPrice && Date.now() - cachedPrice.timestamp < CACHE_DURATION) {
        setTokenPrice(cachedPrice.price);
        return;
      }

      // Use static price if available (comment out when API is available)
      if (staticTokenPrices[chainInfo.priceId]) {
        const price = staticTokenPrices[chainInfo.priceId];
        setTokenPrice(price);
        setCachedPrice(selectedChain, price);
        return;
      }

      // Fetch price from API (uncomment when API is available)
      /*
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${chainInfo.priceId}&vs_currencies=usd`,
        );
        const price = response.data[chainInfo.priceId]?.usd || 0;
        setTokenPrice(price);
        setCachedPrice(selectedChain, price);
      } catch (error) {
        console.error("Failed to fetch token price", error);
        setTokenPrice(0);
      }
      */
    };

    fetchTokenPrice();
  }, [selectedChain]);

  return { tokenSymbol, tokenPrice };
};
