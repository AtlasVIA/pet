import { parseUnits } from "viem";

export const chains = [
  {
    name: "Arbitrum Testnet",
    id: 421614,
    gasFee: parseUnits("0.1", 6),
    nativeCurrency: { symbol: "ETH" },
  },
  {
    name: "Avalanche Testnet",
    id: 43113,
    gasFee: parseUnits("0", 6),
    nativeCurrency: { symbol: "AVAX" },
  },
  {
    name: "Base Testnet",
    id: 84532,
    gasFee: parseUnits("0", 6),
    nativeCurrency: { symbol: "ETH" },
  },
  {
    name: "Celo Testnet",
    id: 44787,
    gasFee: parseUnits("0", 6),
    nativeCurrency: { symbol: "CELO" },
  },
  {
    name: "Mantle Testnet",
    id: 5003,
    gasFee: parseUnits("0", 6),
    nativeCurrency: { symbol: "MNT" },
  },
  {
    name: "Meter Testnet",
    id: 83,
    gasFee: parseUnits("0", 6),
    nativeCurrency: { symbol: "MTR" },
  },
  {
    name: "Ethereum Testnet",
    id: 11155111,
    gasFee: parseUnits("10", 6),
    nativeCurrency: { symbol: "ETH" },
  },
  {
    name: "Optimism Testnet",
    id: 11155420,
    gasFee: parseUnits("0.05", 6),
    nativeCurrency: { symbol: "ETH" },
  },
  {
    name: "Polygon Testnet",
    id: 80002,
    gasFee: parseUnits("0", 6),
    nativeCurrency: { symbol: "MATIC" },
  },
  {
    name: "XLayer Testnet",
    id: 195,
    gasFee: parseUnits("0", 6),
    nativeCurrency: { symbol: "XLD" },
  },
  //{ name: "Sonic Testnet", id: 64165, gasFee: parseUnits("0", 6), nativeCurrency: { symbol: "SONIC" } },
];

export type Chain = 421614 | 43113 | 84532 | 11155111 | 11155420 | 80002 | 83 | 195 | 64165;

export const contractAddresses: Record<Chain, { usdc: `0x${string}`; protocctp: `0x${string}` }> = {
  421614: {
    usdc: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
    protocctp: "0x1B7b4FA05c3E7Ba31A4c936f3df77F8e5B27D341",
  },
  43113: {
    usdc: "0x5425890298aed601595a70ab815c96711a31bc65",
    protocctp: "0x8F525381cbAf7129De3d04F83EC417560e30dE47",
  },
  84532: {
    usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    protocctp: "0xCff460493EC46876Deb609E1AE68838f6B357E24",
  },
  11155111: {
    usdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    protocctp: "0x283bcE7f63E0A32256E86F2146C337a5D7eC737c",
  },
  11155420: {
    usdc: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
    protocctp: "0x7C066750B5Eb23F5f3A6Ba2AaDFa3d5a75cc85a4",
  },
  80002: {
    usdc: "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582",
    protocctp: "0x5E027F3a6C38683949C1433E4017178B4e8A4f47",
  },
  83: { usdc: "0xDf0F025AA89787A48cfE638CBC053BBF7d93b343", protocctp: "0x074d058d96D576a2fD8b70852be2E80254062578" },
  195: { usdc: "0x3B142eC3E18890b06bBD893ed4C7dB548E0B6D04", protocctp: "0x21C314f8A45fFE89E0f075DFcDcb59059c028101" },
  64165: {
    usdc: "0x67C375093cc98D6E56f2fAF0C3D3f75d3a088499",
    protocctp: "0xfd16b76631A020F1D446285fc1cd6866Ad1Bf868",
  },
};
