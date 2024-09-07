"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { parseEther } from "viem";
import { FaSmile, FaFrown, FaExclamationTriangle, FaSkull } from 'react-icons/fa';

const InteractPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [nftData, setNftData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const nftId = searchParams?.get("nftId");

  const parsedNftId: bigint = nftId ? BigInt(parseInt(nftId as string)) : BigInt(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetching the pet data from the contract
  const { data: fetchedNftData, refetch } = useScaffoldReadContract({
    contractName: "AdoptAPet",
    functionName: "getPet",
    args: [parsedNftId]
  });

  useEffect(() => {
    if (fetchedNftData) {
      setNftData(fetchedNftData);
      console.log(fetchedNftData);
    }
  }, [fetchedNftData]);

  const getStatus = (lastInteraction: string) => {
    if (!lastInteraction) return 'dead';
  
    const daysAgo = Math.floor((Date.now() - Number(lastInteraction) * 1000) / (1000 * 60 * 60 * 24));
    
    if (daysAgo <= 2) return 'happy';
    if (daysAgo <= 4) return 'upset';
    if (daysAgo <= 6) return 'angry';
    return 'dead';
  };

  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("AdoptAPet")

  const callWalk = async () => {
    console.log(parsedNftId)
    const txHash = await writeYourContractAsync({ functionName: "walk", args: [parsedNftId], value: parseEther("0.0001") });
    await refetch();
  }

  const callFeed = async () => {
    const txHash = await writeYourContractAsync({ functionName: "feed", args: [parsedNftId], value: parseEther("0.0001") });
    await refetch();
  }

  const callTreat = async () => {
    const txHash = await writeYourContractAsync({ functionName: "treat", args: [parsedNftId], value: parseEther("0.0001") });
    await refetch();
  }

  if (!isMounted) {
    return null;
  }

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
  
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 bg-gradient-to-br from-purple-300 via-pink-300 to-yellow-300 p-6 rounded-3xl shadow-2xl">
      <h1 className="text-3xl font-extrabold text-white drop-shadow-lg animate-bounce text-center">
        🐾 Interact with Pet #{nftId} 🐾
      </h1>
  
      {nftData ? (
        <div className="card w-80 bg-white bg-opacity-90 backdrop-blur-lg shadow-2xl rounded-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
          <div className="card-body p-4 flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-gray-200 border-4 border-pink-500 overflow-hidden">
              <img
                src={nftData.imageUrl}
                alt={nftData.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="card-title text-xl font-bold text-pink-600 mt-3 text-center truncate w-full">
              {nftData.name}
            </h2>
            <p className="text-sm text-gray-700 text-center">
              {nftData.personality}
            </p>
  
            <div className="stats mt-4 w-full grid grid-cols-2 gap-4 text-sm">
              <div className="stat text-center">
                <div className="stat-title">Walk Status</div>
                <div className="stat-value flex items-center justify-center">
                  {getStatusIcon(getStatus(nftData.lastWalk))}
                </div>
                <div className="stat-desc text-gray-500">
                  {getStatus(nftData.lastWalk)}
                </div>
              </div>
              <div className="stat text-center">
                <div className="stat-title">Feed Status</div>
                <div className="stat-value flex items-center justify-center">
                  {getStatusIcon(getStatus(nftData.lastFeed))}
                </div>
                <div className="stat-desc text-gray-500">
                  {getStatus(nftData.lastFeed)}
                </div>
              </div>
              <div className="stat text-center">
                <div className="stat-title">Treat Status</div>
                <div className="stat-value flex items-center justify-center">
                  {getStatusIcon(getStatus(nftData.lastTreat))}
                </div>
                <div className="stat-desc text-gray-500">
                  {getStatus(nftData.lastTreat)}
                </div>
              </div>
            </div>
  
            <div className="stats mt-4 w-full grid grid-cols-3 gap-2 text-sm">
              <div className="stat text-center">
                <div className="stat-title">Walks</div>
                <div className="stat-value text-green-500">
                  {parseInt(nftData.totalWalks)}
                </div>
              </div>
              <div className="stat text-center">
                <div className="stat-title">Feeds</div>
                <div className="stat-value text-green-500">
                  {parseInt(nftData.totalFeeds)}
                </div>
              </div>
              <div className="stat text-center">
                <div className="stat-title">Treats</div>
                <div className="stat-value text-green-500">
                  {parseInt(nftData.totalTreats)}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-base text-white animate-pulse">Loading pet data...</p>
      )}
  
      <div className="flex space-x-4 mt-4">
        <button
          className="btn btn-primary btn-md px-5 py-2 bg-indigo-500 text-white font-bold rounded-full shadow-lg hover:bg-indigo-600 transition-all duration-300"
          onClick={() => callWalk()}
          disabled={isLoading}
        >
          🚶 Walk
        </button>
        <button
          className="btn btn-primary btn-md px-5 py-2 bg-green-500 text-white font-bold rounded-full shadow-lg hover:bg-green-600 transition-all duration-300"
          onClick={() => callFeed()}
          disabled={isLoading}
        >
          🍽 Feed
        </button>
        <button
          className="btn btn-primary btn-md px-5 py-2 bg-yellow-500 text-white font-bold rounded-full shadow-lg hover:bg-yellow-600 transition-all duration-300"
          onClick={() => callTreat()}
          disabled={isLoading}
        >
          🍬 Treat
        </button>
      </div>
    </div>
  );
  
  
  
};

export default InteractPage;
