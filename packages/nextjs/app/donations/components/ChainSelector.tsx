import React from "react";
import { chainOptions } from "../utils/chainOptions";

interface ChainSelectorProps {
  selectedChain: number | null;
  setSelectedChain: (chain: number | null) => void;
}

export const ChainSelector: React.FC<ChainSelectorProps> = ({ selectedChain, setSelectedChain }) => {
  return (
    <div className="w-full mb-8">
      <label className="block text-lg font-semibold text-gray-800 mb-3">🌐 Select Your Preferred Blockchain</label>
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
  );
};
