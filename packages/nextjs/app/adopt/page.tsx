"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDeployedContractInfo, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { FaPaw } from 'react-icons/fa';

const Adopt = () => {
  const [nfts, setNfts] = useState<number[]>([]);
  const [nftMetadata, setNftMetadata] = useState<any[]>([]);
  const router = useRouter(); // For navigation

  const { data: deployedContractData } = useDeployedContractInfo("AdoptAPet");

  const {
    data: nftData,
    isLoading,
    isError,
  } = useScaffoldReadContract({
    contractName: "AdoptAPet",
    functionName: "walletOfOwner",
    args: [deployedContractData?.address],
  });

  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("AdoptAPet");

  // Use the hook to fetch metadata for each pet
  const { data: petData, refetch: refetchPetData } = useScaffoldReadContract({
    contractName: "AdoptAPet",
    functionName: "getPet",
  });

  useEffect(() => {
    if (nftData && Array.isArray(nftData)) {
      setNfts(nftData.map((id: bigint) => Number(id)));
    }
  }, [nftData]);

  // Fetch metadata for each pet when NFTs are available
  useEffect(() => {
    if (nfts.length > 0) {
      const fetchMetadata = async () => {
        const metadata = await Promise.all(
          nfts.map(async (nftId) => {
            const pet = await refetchPetData({ args: [BigInt(nftId)] });
            return { nftId, ...pet };
          })
        );
        setNftMetadata(metadata);
      };
      fetchMetadata();
    }
  }, [nfts, refetchPetData]);

  const callAdopt = async (nftId: bigint) => {
    try {
      const txHash = await writeYourContractAsync({ functionName: "adoptPet", args: [nftId] });
      alert(`You have adopted a pet! Transaction hash: ${txHash}`);
      // Redirect to interact page after successful transaction
      router.push(`/interact?nftId=${nftId}`);
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
        <p className="mt-4 text-lg text-gray-700">
          Choose your pet and give them a loving home today!
        </p>
      </div>

      <div className="w-full bg-white shadow-lg p-8 rounded-lg mt-8">
        {isLoading && <p className="text-lg text-gray-600 text-center">Loading available pets...</p>}
        {isError && <p className="text-lg text-red-500 text-center">Failed to load pets</p>}
        {!isLoading && !isError && nfts.length === 0 && (
          <p className="text-lg text-gray-600 text-center">There are no pets available for adoption at the moment!</p>
        )}

        {nftMetadata.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {nftMetadata.map((pet) => (
              <div key={pet.nftId} className="card w-80 bg-base-100 shadow-2xl rounded-lg hover:scale-105 transition-transform">
                <div className="card-body p-4 flex flex-col items-center">
                  <img
                    src={pet.imageUrl} // Use the image URL from metadata
                    alt={pet.name}
                    className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-pink-400"
                  />
                  <h2 className="text-2xl font-bold text-purple-600">{pet.name}</h2>
                  <p className="text-gray-600 italic mb-4">Personality: {pet.personality}</p>
                  <button
                    onClick={() => callAdopt(BigInt(pet.nftId))}
                    className="btn bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-2 px-4 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
                  >
                    Adopt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Adopt;
