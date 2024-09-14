"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { formatEther, parseEther } from "viem";
import { useAccount, useBalance } from "wagmi";
import { readContract } from "wagmi/actions";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const HomePage = () => {
  const { address: connectedAddress } = useAccount();

  const [donationAmountUSD, setDonationAmountUSD] = useState("10");
  const [donationAmountToken, setDonationAmountToken] = useState("");
  const [message, setMessage] = useState("");
  const [totalDonationsUSD, setTotalDonationsUSD] = useState("0");
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedChain, setSelectedChain] = useState<number | null>(null);
  const [showOtherAmount, setShowOtherAmount] = useState(false);
  const [tokenSymbol, setTokenSymbol] = useState("ETH");
  const [tokenPrice, setTokenPrice] = useState(0);
  const [balance, setBalance] = useState("0");
  const [currentChainId, setCurrentChainId] = useState<number | null>(null);

  const chainOptions = [
    {
      id: 44787,
      name: "Celo Testnet",
      symbol: "CELO",
      priceId: "celo",
      rpcUrl: "https://alfajores-forno.celo-testnet.org",
      blockExplorerUrl: "https://alfajores-blockscout.celo-testnet.org",
      contractAddress: "0xYourCeloTestnetContractAddress", // Replace with actual address
    },
    {
      id: 5001,
      name: "Mantle Testnet",
      symbol: "MNT",
      priceId: "mantle",
      rpcUrl: "https://rpc.testnet.mantle.xyz",
      blockExplorerUrl: "https://explorer.testnet.mantle.xyz",
      contractAddress: "0xYourMantleTestnetContractAddress", // Replace with actual address
    },
    {
      id: 11155111,
      name: "Sepolia",
      symbol: "ETH",
      priceId: "ethereum",
      rpcUrl: "https://rpc.sepolia.org",
      blockExplorerUrl: "https://sepolia.etherscan.io",
      contractAddress: "0xYourSepoliaContractAddress", // Replace with actual address
    },
    // Add other chains with appropriate details and contract addresses
  ];

  // Get current chain ID
  useEffect(() => {
    const getChainId = async () => {
      if (typeof window !== "undefined" && window.ethereum && window.ethereum.request) {
        try {
          const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
          const chainId = parseInt(chainIdHex, 16);
          setCurrentChainId(chainId);
          if (!selectedChain) {
            setSelectedChain(chainId);
          }
        } catch (error) {
          console.error("Failed to get chain ID", error);
        }
      }
    };

    getChainId();

    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("chainChanged", (chainIdHex: string) => {
        const chainId = parseInt(chainIdHex, 16);
        setCurrentChainId(chainId);
      });
    }
  }, [selectedChain]);

  // Fetch token price for the selected chain
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

  // Update donation amount in token when USD amount changes
  useEffect(() => {
    if (tokenPrice > 0 && donationAmountUSD) {
      const tokenAmount = (parseFloat(donationAmountUSD) / tokenPrice).toFixed(6);
      setDonationAmountToken(tokenAmount);
    } else {
      setDonationAmountToken("");
    }
  }, [donationAmountUSD, tokenPrice]);

  // Fetch user's balance
  const { data: balanceData } = useBalance({
    address: connectedAddress,
    chainId: selectedChain || undefined,
  });

  useEffect(() => {
    if (balanceData) {
      setBalance(formatEther(balanceData.value));
    } else {
      setBalance("0");
    }
  }, [balanceData]);

  // Fetch total donations and messages
  useEffect(() => {
    const fetchTotalDonationsAndMessages = async () => {
      let totalUSD = 0;
      const allMessages: any[] = [];

      await Promise.all(
        chainOptions.map(async chainInfo => {
          try {
            const totalDonationsData = await readContract({
              address: chainInfo.contractAddress as `0x${string}`,
              abi: DonationsABI.abi,
              functionName: "totalDonations",
              chainId: chainInfo.id,
            });

            // Fetch token price
            const response = await axios.get(
              `https://api.coingecko.com/api/v3/simple/price?ids=${chainInfo.priceId}&vs_currencies=usd`,
            );
            const price = response.data[chainInfo.priceId]?.usd || 0;

            const totalDonationsToken = totalDonationsData ? parseFloat(formatEther(totalDonationsData)) : 0;
            totalUSD += totalDonationsToken * price;

            if (messagesData && Array.isArray(messagesData)) {
              allMessages.push(
                ...messagesData.map((msg: any) => ({
                  message: msg.message,
                  sender: msg.sender,
                  timestamp: Number(msg.timestamp),
                  amount: formatEther(msg.amount),
                  amountUSD: (parseFloat(formatEther(msg.amount)) * price).toFixed(2),
                  chainName: chainInfo.name,
                  tokenSymbol: chainInfo.symbol,
                })),
              );
            }
          } catch (error) {
            console.error(`Failed to fetch data from chain ${chainInfo.name}`, error);
          }
        }),
      );

      setTotalDonationsUSD(totalUSD.toFixed(2));
      allMessages.sort((a, b) => b.timestamp - a.timestamp);
      setMessages(allMessages.slice(0, 20));
    };

    fetchTotalDonationsAndMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { writeAsync: donate } = useScaffoldWriteContract({
    contractName: "Donations",
    functionName: "donate",
    chainId: selectedChain || undefined,
  });

  const switchToChain = async (chainId: number) => {
    if (typeof window !== "undefined" && window.ethereum && window.ethereum.request) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x" + chainId.toString(16) }],
        });
        setCurrentChainId(chainId);
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          const chainInfo = chainOptions.find(c => c.id === chainId);
          if (chainInfo) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0x" + chainId.toString(16),
                    chainName: chainInfo.name,
                    nativeCurrency: {
                      name: chainInfo.symbol,
                      symbol: chainInfo.symbol,
                      decimals: 18,
                    },
                    rpcUrls: [chainInfo.rpcUrl],
                    blockExplorerUrls: [chainInfo.blockExplorerUrl],
                  },
                ],
              });
              await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x" + chainId.toString(16) }],
              });
              setCurrentChainId(chainId);
            } catch (addError) {
              console.error("Failed to add network", addError);
            }
          }
        } else {
          console.error("Failed to switch network", switchError);
        }
      }
    } else {
      console.error("window.ethereum is not available");
    }
  };

  const handleDonate = async () => {
    if (!donationAmountToken || isNaN(Number(donationAmountToken))) {
      alert("Please enter a valid donation amount.");
      return;
    }

    if (!selectedChain) {
      alert("Please select a blockchain.");
      return;
    }

    if (currentChainId !== selectedChain) {
      try {
        await switchToChain(selectedChain);
      } catch (error) {
        console.error("Failed to switch network", error);
        alert("Please switch your wallet to the correct network.");
        return;
      }
    }

    try {
      await donate({
        args: [message],
        value: parseEther(donationAmountToken),
      });
      setDonationAmountUSD(showOtherAmount ? "" : donationAmountUSD);
      setMessage("");
    } catch (error) {
      console.error("Donation failed", error);
    }
  };

  const donationOptionsUSD = ["10", "50", "100", "500", "1000"];

  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 w-full">
      {/* Project Description and Award Announcement */}
      <div className="text-center max-w-2xl mt-6">
        <p className="text-xl text-gray-700 leading-relaxed">
          Hi there, I'm Blue, and I could really use your help! I'm building something special called{" "}
          <span className="font-bold text-blue-600">Dogachi.Pet</span> to make sure every pup like me finds a loving
          home. But to make it happen, I need some extra paws on deck.
        </p>
        <br />
        <p className="text-xl text-gray-700 leading-relaxed">
          <span className="font-bold text-blue-600">Dogachi.Pet</span> is a Tamagotchi-style NFT project where{" "}
          <span className="font-bold">every interaction</span> with your virtual pet{" "}
          <span className="font-bold">creates microdonations</span> to the shelter that your furry pal calls home. These
          microdonations provide shelters with <span className="font-bold">sustainable, ongoing support</span> to care
          for dogs in need.
        </p>
        <br />
        <p className="text-xl text-gray-700 leading-relaxed">
          Your support will help us finish development, bring more shelters onboard, and keep happy furry tails wagging!
        </p>
        <span className="text-purple-400 font-bold">
          Together, we can change a lot of lives—one wagging tail at a time!
        </span>
      </div>

      {/* Wrap the donation box and add the image to the right */}
      <div className="flex flex-col md:flex-row items-center mt-8">
        {/* Donation Options */}
        <div className="flex flex-col items-center bg-white bg-opacity-90 backdrop-blur-lg p-8 rounded-xl shadow-2xl w-full max-w-md">
          {/* Chain Selection */}
          <div className="w-full mb-8">
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              🌐 Select Your Preferred Blockchain
            </label>
            <select
              className="form-select block w-full px-5 py-3 rounded-full bg-white border-2 border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition duration-300 ease-in-out"
              value={selectedChain || ""}
              onChange={e => setSelectedChain(Number(e.target.value))}
            >
              <option value="" disabled>
                Choose a blockchain
              </option>
              {chainOptions.map(chain => (
                <option key={chain.id} value={chain.id}>
                  {chain.name}
                </option>
              ))}
            </select>
          </div>

          <label className="block text-lg font-semibold text-gray-800 mb-6">💖 Select Your Donation Amount</label>
          <div className="grid grid-cols-3 gap-4 mb-6 w-full">
            {donationOptionsUSD.map(amount => (
              <button
                key={amount}
                onClick={() => {
                  setDonationAmountUSD(amount);
                  setShowOtherAmount(false);
                }}
                className={`px-5 py-3 rounded-full font-bold ${
                  donationAmountUSD === amount && !showOtherAmount
                    ? "bg-pink-500 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                ${amount}
              </button>
            ))}
            <button
              onClick={() => {
                setDonationAmountUSD("");
                setDonationAmountToken("");
                setShowOtherAmount(true);
              }}
              className={`px-5 py-3 rounded-full font-bold ${
                showOtherAmount ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Other
            </button>
          </div>
          {showOtherAmount && (
            <input
              type="text"
              placeholder="Enter Amount in USD"
              value={donationAmountUSD}
              onChange={e => setDonationAmountUSD(e.target.value)}
              className="input input-bordered w-full mb-4 px-4 py-3 rounded-full"
            />
          )}
          <div className="text-sm text-gray-600 mb-2">
            Donation Amount: {donationAmountToken || "0"} {tokenSymbol} (~${donationAmountUSD || "0"})
          </div>
          <div className="text-sm text-gray-600 mb-6">
            Your Balance: {balance} {tokenSymbol}
          </div>
          <textarea
            placeholder="Your Message (optional)"
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="textarea textarea-bordered w-full mb-6 px-4 py-3 rounded-xl"
          />
          <button
            onClick={handleDonate}
            className="btn btn-primary w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-full shadow-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
          >
            Donate Now
          </button>
        </div>

        {/* Add the image to the right */}
        <div className="mt-8 md:mt-0 md:ml-8">
          <Image src="/aap-ux.png" alt="App Preview" width={270} height={740} className="rounded-xl shadow-lg" />
        </div>
      </div>

      {/* Total Donations */}
      <div className="mt-10 text-center">
        <p className="text-3xl text-gray-800 font-bold">
          Total Donations: <span className="text-pink-600">${totalDonationsUSD}</span>
        </p>
      </div>

      <div className="w-full max-w-2xl text-center">
        <p className="text-xl text-gray-700 leading-relaxed">
          We are thrilled to announce that Dogachi.Pet (Adopt A Pet) won the{" "}
          <span className="font-bold text-pink-600">ETHWarsaw 2024 Hackathon top prize!</span>
          <br />
          <a
            href="https://x.com/ethwarsaw"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Read more about our achievement here.
          </a>
        </p>
      </div>

      {/* Latest Messages */}
      <div className="mt-12 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">Messages from Our Supporters</h2>
        <div className="space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className="p-6 bg-white bg-opacity-90 backdrop-blur-lg rounded-xl shadow-md">
              <p className="text-gray-800 text-lg italic">"{msg.message}"</p>
              <div className="text-sm text-gray-600 mt-4">
                <span className="font-semibold">From:</span> {msg.sender} |{" "}
                <span className="font-semibold">Donated:</span> {msg.amount} {msg.tokenSymbol} (~${msg.amountUSD}) |{" "}
                <span className="font-semibold">Chain:</span> {msg.chainName}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
