"use client";

import { useEffect, useState } from "react";
import { useDeployedContractInfo, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Adopt = () => {
  const [nfts, setNfts] = useState<number[]>([]);

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

  useEffect(() => {
    if (nftData && Array.isArray(nftData)) {
      setNfts(nftData.map((id: bigint) => Number(id)));
    }
  }, [nftData]);

  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("AdoptAPet");

  const callAdopt = async (nftId: bigint) => {
    console.log(nftId);
    const txHash = await writeYourContractAsync({ functionName: "adoptPet", args: [nftId] });
    alert(`You have adopted a pet! Transaction hash: ${txHash}`);
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5">
        <h1 className="text-center">
          <span className="block text-4xl font-bold">Adopt</span>
        </h1>
      </div>

      <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
        <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
          {isLoading && <p>Loading available Pets...</p>}
          {isError && <p>Failed to load Pets</p>}
          {!isLoading && !isError && nfts.length === 0 && <p>There are no available Pets to adopt!</p>}

          {nfts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {nfts.map(nftId => (
                <div key={nftId} className="card w-96 bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title">NFT #{nftId}</h2>
                    {/* meta here */}
                    <p> ID: {nftId}</p>
                    <button onClick={() => callAdopt(BigInt(nftId))}>Adopt</button>
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

export default Adopt;
