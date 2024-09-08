"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { parseEther } from "viem";
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
          <p className="text-lg text-gray-600">You do not currently have any Pets</p>
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

  // Fetch individual pet data for each NFT
  const { data: fetchedNftData } = useScaffoldReadContract({
    contractName: "AdoptAPet",
    functionName: "getPet",
    args: [BigInt(nftId)],
  });

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
    await writeYourContractAsync({ functionName: action, args: [BigInt(nftId)], value: parseEther("0.0001") });
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

    </div>
  );
};

export default MyPets;
