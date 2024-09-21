import React from "react";
import { chainOptions } from "../utils/chainOptions";

interface ChainSelectorProps {
  selectedChain: number | null;
  setSelectedChain: (chain: number | null) => void;
}

export const ChainSelector: React.FC<ChainSelectorProps> = ({ selectedChain, setSelectedChain }) => {
  return (
    <div className="w-full mb-6">
      <label className="block text-lg font-semibold text-indigo-800 mb-3">🌐 Select Your Preferred Blockchain</label>
      <div className="relative">
        <select
          className="block w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ease-in-out shadow-sm hover:border-indigo-300"
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
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
