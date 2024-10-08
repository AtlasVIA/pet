import { chains as customChains } from "./utils/scaffold-eth/chains";
import { defineChain } from "viem";
import * as chains from "viem/chains";

export const alephZeroTestnet = defineChain({
  ...chains.celoAlfajores,
  name: "Aleph Zero",
  rpcUrl: "https://rpc.alephzero-testnet.gelato.digital",
  explorerUrl: "https://test.azero.dev/#/explorer",
  nativeCurrency: {
    name: "Aleph Zero",
    symbol: "AZERO",
    decimals: 18,
  },
  chainId: 2039,

  // ...
});

export const zircuitTestnet = defineChain({
  ...chains.celoAlfajores,
  name: "Zircuit",
  rpcUrl: "https://zircuit1.p2pify.com",
  explorerUrl: "https://zircuit1.p2pify.com",
  nativeCurrency: {
    name: "Zircuit",
    symbol: "ZIRC",
    decimals: 18,
  },
  chainId: 48899,

  // ...
});

export type ScaffoldConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
};

const scaffoldConfig = {
  // The networks on which your DApp is live
  targetNetworks: [
    chains.celoAlfajores,
    chains.optimismSepolia,
    chains.mantleSepoliaTestnet,
    alephZeroTestnet,
    zircuitTestnet,
    ...customChains.map(chain =>
      defineChain({
        id: chain.id,
        name: chain.name,
        network: chain.name.toLowerCase().replace(" ", "-"),
        nativeCurrency: {
          name: chain.name.split(" ")[0],
          symbol: chain.name.split(" ")[0].toUpperCase(),
          decimals: 18,
        },
        rpcUrls: {
          default: { http: [`https://rpc.${chain.name.toLowerCase().replace(" ", "-")}.io`] },
        },
        blockExplorers: {
          default: { name: chain.name, url: `https://explorer.${chain.name.toLowerCase().replace(" ", "-")}.io` },
        },
      }),
    ),
  ],

  // The interval at which your front-end polls the RPC servers for new data
  // it has no effect if you only target the local network (default is 4000)
  pollingInterval: 30000,

  // This is ours Alchemy's default API key.
  // You can get your own at https://dashboard.alchemyapi.io
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF",

  // This is ours WalletConnect's default project ID.
  // You can get your own at https://cloud.walletconnect.com
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",

  // Only show the Burner Wallet when running on hardhat network
  onlyLocalBurnerWallet: true,
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
