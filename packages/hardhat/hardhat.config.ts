import dotenv from "dotenv";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "@typechain/hardhat";

import "./tasks/configure";
import "./tasks/add-pet";
import "./tasks/add-shelter";
import "./tasks/bridge-pet";
import "./tasks/feed-pet";
import "./tasks/listen-pet";
import "./tasks/talk-pet";
import "./tasks/treat-pet";
import "./tasks/update-pet";
import "./tasks/walk-pet";
import "./tasks/get-shelters";
import "./tasks/add-shelter-manager";
import "./tasks/remove-shelter-manager";
import "./tasks/get-available-pets";
import "./tasks/get-nft-meta";
import "./tasks/adopt-pet";
import "./tasks/rescue-pet";

dotenv.config({ path: __dirname + "/.env" });

const accounts = [process.env.DEPLOYER_PRIVATE_KEY || ""];

const config: any = {
  gasReporter: {
    enabled: true,
    token: "ETH",
    coinmarketcap: process.env.CMC_API_KEY || "",
  },
  networks: {
    "celo-testnet": {
      chainId: 44787,
      url: "https://alfajores-forno.celo-testnet.org",
      live: false,
      accounts: accounts,
    },
    "mantle-testnet": {
      chainId: 5003,
      url: "https://rpc.sepolia.mantle.xyz",
      live: false,
      accounts: accounts,
    },
    "polygon-testnet": {
      chainId: 80002,
      url: "https://rpc-amoy.polygon.technology/",
      live: false,
      accounts: accounts,
    },
    "optimism-testnet": {
      chainId: 11155420,
      url: "https://sepolia.optimism.io",
      live: false,
      accounts: accounts,
    },
    "aleph-zero-testnet": {
      chainId: 2039,
      url: "https://rpc.alephzero-testnet.gelato.digital",
      live: false,
      accounts: accounts,
    },
    "zircuit-testnet": {
      chainId: 48899,
      url: "https://zircuit1.p2pify.com",
      live: false,
      accounts: accounts,
    },
    hardhat: {
      live: false,
      deploy: ["deploy/hardhat/"],
    },
  },
  namedAccounts: {
    deployer: 0,
    accountant: 1,
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          viaIR: true,
        },
      },
    ],
  },
};

export default config;