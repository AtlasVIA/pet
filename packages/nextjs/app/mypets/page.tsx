"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const MyPets = () => {
  const { address: connectedAddress } = useAccount();
  const [nfts, setNfts] = useState<number[]>([]);

  const {
    data: nftData,
    isLoading,
    isError,
  } = useScaffoldReadContract({
    contractName: "AdoptAPet",
    functionName: "walletOfOwner",
    args: [connectedAddress],
  });

  useEffect(() => {
    if (nftData && Array.isArray(nftData)) {
      setNfts(nftData.map((id: bigint) => Number(id)));
    }
  }, [nftData]);

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5">
        <h1 className="text-center">
          <span className="block text-4xl font-bold">My Pets</span>
        </h1>
      </div>

      <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
        <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
          {isLoading && <p>Loading your Pets...</p>}
          {isError && <p>Failed to load Pets</p>}
          {!isLoading && !isError && nfts.length === 0 && <p>You do not currently have any Pets</p>}

          {nfts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {nfts.map(nftId => (
                <div key={nftId} className="card w-96 bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title">NFT #{nftId}</h2>
                    <p> ID: {nftId}</p>
                    <a href={`/interact/?nftId=${nftId}`} className="btn btn-primary">
                      Play with me!
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPets;
