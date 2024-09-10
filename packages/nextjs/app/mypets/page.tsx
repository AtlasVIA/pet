"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { parseEther, formatEther } from "viem";
import { FaSmile, FaFrown, FaExclamationTriangle, FaSkull } from 'react-icons/fa';

const MyPets = () => {
  const { address: connectedAddress } = useAccount();
  const [nftIds, setNftIds] = useState<number[]>([]);

  // Fetch NFTs owned by the user
  const { data: nftData, isLoading, isError } = useScaffoldReadContract({
    contractName: "AdoptAPet",
    functionName: "walletOfOwner",
    args: [connectedAddress],
  });

  useEffect(() => {
    if (nftData && Array.isArray(nftData)) {
      setNftIds(nftData.map((id: bigint) => Number(id)));
    }
  }, [nftData]);

  return (
    <div className="flex-grow bg-gradient-to-br from-purple-300 via-pink-200 to-yellow-200 p-10 rounded-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl w-full px-8 py-12">
      <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
        {isLoading && <p className="text-lg text-gray-600">Loading your Pets...</p>}
        {isError && <p className="text-lg text-red-500">Failed to load Pets</p>}
        {!isLoading && !isError && nftIds.length === 0 && (
          <p className="text-lg text-gray-600">You do not currently have any Pets on this chain. Switch chains to see your Pets on other chains.</p>
        )}

        {nftIds.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {nftIds.map((nftId) => (
              <PetCard key={nftId} nftId={nftId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PetCard = ({ nftId }: { nftId: number }) => {
  const [nftData, setNftData] = useState<any>(null);
  const [selectedChain ] = useState<number | null>(null);
  const { address: connectedAddress } = useAccount();

  // Chains available for bridging
  const allChainOptions = [
    { id: 44787, name: 'Celo Testnet' },
    { id: 5003, name: 'Mantle Testnet' },
    { id: 11155420, name: "OP Sepolia" },
    { id: 48899, name: "Zircuit Testnet"},
    { id: 2039, name: "Aleph Zero Testnet"}
  ];
  const chainOptions = allChainOptions.filter(option => option.id !== selectedChain);

  const { writeContractAsync: bridgePet } = useScaffoldWriteContract("AdoptAPet");

  // Fetch individual pet data for each NFT
  const { data: fetchedNftData, refetch } = useScaffoldReadContract({
    contractName: "AdoptAPet",
    functionName: "getPet",
    args: [BigInt(nftId)],
  });

  console.log(fetchedNftData);
  useEffect(() => {
    if (fetchedNftData) {
      setNftData(fetchedNftData);
    }
  }, [fetchedNftData]);

  const handleBridge = async () => {
    const selectElement = document.getElementById(`chainSelect-${nftId}`) as HTMLSelectElement;
    const chosenChain = selectElement.value;

    if (!chosenChain) {
      alert("Please select a chain.");
      return;
    }

    try {
      await bridgePet({
        functionName: "bridge",
        args: [BigInt(chosenChain), connectedAddress, BigInt(nftId)],
      });
      refetch(); // Refresh NFT data after bridging
    } catch (error) {
      console.error("Bridge failed", error);
    }
  };

  useEffect(() => {
    if (fetchedNftData) {
      setNftData(fetchedNftData);
    }
  }, [fetchedNftData]);

  // Contract write functions for interactions (walk, feed, treat)
  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("AdoptAPet");

  const getStatus = (lastInteraction: string) => {
    if (!lastInteraction) return 'dead';

    const daysAgo = Math.floor((Date.now() - Number(lastInteraction) * 1000) / (1000 * 60 * 60 * 24));
    if (daysAgo <= 2) return 'happy';
    if (daysAgo <= 4) return 'upset';
    if (daysAgo <= 6) return 'angry';
    return 'dead';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'happy':
        return <FaSmile className="text-green-500" size={32} />;
      case 'upset':
        return <FaFrown className="text-yellow-500" size={32} />;
      case 'angry':
        return <FaExclamationTriangle className="text-orange-500" size={32} />;
      case 'dead':
        return <FaSkull className="text-red-500" size={32} />;
      default:
        return null;
    }
  };

  const interactWithPet = async (action: "walk" | "feed" | "treat") => {
    await writeYourContractAsync({ functionName: action, args: [BigInt(nftId)], value: parseEther("0.001") });
    refetch();
  };

  if (!nftData) {
    return <div>Loading pet data...</div>;
  }

  return (
    <div className="card w-80 bg-white bg-opacity-90 backdrop-blur-lg shadow-2xl rounded-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl h-full flex flex-col justify-between">
      <div className="card-body p-4 flex flex-col items-center">
        <div className="w-28 h-28 rounded-full bg-gray-200 border-4 border-pink-500 overflow-hidden">
          <img
            src={nftData?.image}
            alt={nftData?.name}
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="card-title text-xl font-bold text-pink-600 mt-3 text-center truncate w-full">
          {nftData?.name}
        </h2>

        <p className="text-lg text-gray-600 mt-1 text-center">
          Donations: {formatEther(nftData?.totalDonations) || 0} ETH
        </p>
        <div className="stats mt-4 w-full flex flex-col space-y-4 text-sm">
          <div className="stat flex justify-between items-center">
            <div className="stat-title text-left">Walk Status</div>
            <div className="stat-value flex items-center space-x-2">
              {getStatusIcon(getStatus(nftData?.lastWalk))}
              <span className="text-gray-600 capitalize">{getStatus(nftData?.lastWalk)}</span>
            </div>
          </div>

          <div className="stat flex justify-between items-center">
            <div className="stat-title text-left">Feed Status</div>
            <div className="stat-value flex items-center space-x-2">
              {getStatusIcon(getStatus(nftData?.lastFeed))}
              <span className="text-gray-600 capitalize">{getStatus(nftData?.lastFeed)}</span>
            </div>
          </div>

          <div className="stat flex justify-between items-center">
            <div className="stat-title text-left">Treat Status</div>
            <div className="stat-value flex items-center space-x-2">
              {getStatusIcon(getStatus(nftData?.lastTreat))}
              <span className="text-gray-600 capitalize">{getStatus(nftData?.lastTreat)}</span>
            </div>
          </div>
        </div>

        <div className="stats mt-4 w-full grid grid-cols-3 gap-2 text-sm">
          <div className="stat text-center">
            <div className="stat-title">Walks</div>
            <div className="stat-value text-green-500">
              {parseInt(nftData?.totalWalks)}
            </div>
          </div>
          <div className="stat text-center">
            <div className="stat-title">Feeds</div>
            <div className="stat-value text-green-500">
              {parseInt(nftData?.totalFeeds)}
            </div>
          </div>
          <div className="stat text-center">
            <div className="stat-title">Treats</div>
            <div className="stat-value text-green-500">
              {parseInt(nftData?.totalTreats)}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons Container */}
      <div className="flex space-x-2 mb-4 px-4 justify-center w-full">
        <button
          className="btn btn-primary flex-1 px-4 py-2 bg-indigo-500 text-white font-bold rounded-full shadow-lg hover:bg-indigo-600 transition-all duration-300"
          onClick={() => interactWithPet("walk")}
        >
          🚶 Walk
        </button>
        <button
          className="btn btn-primary flex-1 px-4 py-2 bg-green-500 text-white font-bold rounded-full shadow-lg hover:bg-green-600 transition-all duration-300"
          onClick={() => interactWithPet("feed")}
        >
          🍽 Feed
        </button>
        <button
          className="btn btn-primary flex-1 px-4 py-2 bg-yellow-500 text-white font-bold rounded-full shadow-lg hover:bg-yellow-600 transition-all duration-300"
          onClick={() => interactWithPet("treat")}
        >
          🍬 Treat
        </button>
      </div>

      {/* Bridge Section */}
      <div className="w-full mt-6 bg-gray-100 p-4 rounded-lg shadow-md border border-gray-300">
        <label htmlFor={`chainSelect-${nftId}`} className="block text-base font-semibold text-gray-800 mb-2">
          🌍 Select Destination Chain
        </label>
        <div className="relative">
          <select
            id={`chainSelect-${nftId}`}
            className="form-select block w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-300 ease-in-out"
            defaultValue=""
          >
            <option value="" disabled>Select a chain</option>
            {chainOptions.map((chain) => (
              <option key={chain.id} value={chain.id}>
                {chain.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 01.894.553l3 6a1 1 0 01-.051.9l-3 5a1 1 0 01-1.686 0l-3-5a1 1 0 01-.051-.9l3-6A1 1 0 0110 3z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <button
          onClick={handleBridge}
          className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-all duration-300 ease-in-out"
        >
          🚀 Bridge Pet
        </button>
      </div>


    </div>
  );
};

export default MyPets;
