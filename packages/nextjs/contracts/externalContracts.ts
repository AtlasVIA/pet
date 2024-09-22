import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const ERC20_ABI = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
];

const externalContracts = {
  421614: {
    USDC: {
      address: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
      abi: ERC20_ABI,
    },
  },
  43113: {
    USDC: {
      address: "0x5425890298aed601595a70ab815c96711a31bc65",
      abi: ERC20_ABI,
    },
  },
  84532: {
    USDC: {
      address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      abi: ERC20_ABI,
    },
  },
  11155111: {
    USDC: {
      address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      abi: ERC20_ABI,
    },
  },
  11155420: {
    USDC: {
      address: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
      abi: ERC20_ABI,
    },
  },
  80002: {
    USDC: {
      address: "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582",
      abi: ERC20_ABI,
    },
  },
  83: {
    USDC: {
      address: "0xDf0F025AA89787A48cfE638CBC053BBF7d93b343",
      abi: ERC20_ABI,
    },
  },
  195: {
    USDC: {
      address: "0x3B142eC3E18890b06bBD893ed4C7dB548E0B6D04",
      abi: ERC20_ABI,
    },
  },
  64165: {
    USDC: {
      address: "0x67C375093cc98D6E56f2fAF0C3D3f75d3a088499",
      abi: ERC20_ABI,
    },
  },
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
