"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDeployedContractInfo, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { parseEther } from "viem";

const Adopt = () => {
  const [nftIds, setNftIds] = useState<number[]>([]);
  const router = useRouter();

  const { data: deployedContractData } = useDeployedContractInfo("AdoptAPet");

  const { data: nftData, isLoading, isError } = useScaffoldReadContract({
    contractName: "AdoptAPet",
    functionName: "walletOfOwner",
    args: [deployedContractData?.address],
  });

  useEffect(() => {
    if (nftData && Array.isArray(nftData)) {
      setNftIds(nftData.map((id: bigint) => Number(id)));
    }
  }, [nftData]);

  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("AdoptAPet");

  const handleAdopt = async (nftId: bigint) => {
    try {
      await writeYourContractAsync({ functionName: "adoptPet", args: [BigInt(nftId)], value: parseEther("0.0001") });
      router.push(`/mypets`);
    } catch (error) {
      console.error("Adoption failed", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-300 via-pink-200 to-yellow-200 p-10">
      <div className="mb-8 text-center">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 drop-shadow-lg">
          Adopt a Furry Friend
        </h1>
        <p className="mt-4 text-lg text-gray-700">Choose your pet and give them a loving home today!</p>
      </div>

      <div className="w-full bg-white shadow-lg p-8 rounded-lg mt-8">
        {isLoading && <p className="text-lg text-gray-600 text-center">Loading available pets...</p>}
        {isError && <p className="text-lg text-red-500 text-center">Failed to load pets</p>}
        {!isLoading && !isError && nftIds.length === 0 && (
          <p className="text-lg text-gray-600 text-center">There are no pets available for adoption at the moment!</p>
        )}

        {nftIds.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {nftIds.map((nftId) => (
              <PetCard key={nftId} nftId={nftId} onAdopt={handleAdopt} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PetCard = ({ nftId, onAdopt }: { nftId: number; onAdopt: (id: bigint) => void }) => {
  const { data: petData, isLoading: isPetLoading } = useScaffoldReadContract({
    contractName: "AdoptAPet",
    functionName: "getPet",
    args: [BigInt(nftId)],
  });

  if (isPetLoading) {
    return <div className="text-center">Loading pet data...</div>;
  }

  return (
    <div className="card w-80 bg-white bg-opacity-90 backdrop-blur-lg shadow-2xl rounded-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl h-full flex flex-col justify-between">
      <div className="card-body p-4 flex flex-col items-center">
        <img
          src={petData?.image}
          alt={petData?.name}
          className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-pink-400"
        />
        <h2 className="text-2xl font-bold text-purple-600">{petData?.name}</h2>
        <button
          onClick={() => onAdopt(BigInt(nftId))}
          className="btn bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-2 px-4 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
        >
          Adopt
        </button>
      </div>
    </div>
  );
};

export default Adopt;
