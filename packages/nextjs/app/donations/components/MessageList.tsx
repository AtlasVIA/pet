import React from "react";
import { chainOptions } from "../utils/chainOptions";
import { formatEther } from "viem";

interface Message {
  message: string;
  sender: string;
  amount: bigint;
}

interface MessageListProps {
  messages: Message[];
  selectedChain: number | null;
  tokenSymbol: string;
  tokenPrice: number | undefined;
  isContractLoading: boolean;
  error: string | null;
  refetchMessages: () => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  selectedChain,
  tokenSymbol,
  tokenPrice,
  isContractLoading,
  error,
  refetchMessages,
}) => {
  const getChainName = (chainId: number | null) => {
    if (chainId === null) return "Unknown Chain";
    const chain = chainOptions.find(c => c.id === chainId);
    return chain ? chain.name : "Unknown Chain";
  };

  const formatDonationAmount = (amount: bigint, price: number | undefined) => {
    const ethAmount = parseFloat(formatEther(amount));
    const usdAmount = price && price > 0 ? (ethAmount * price).toFixed(2) : "N/A";
    return `${ethAmount.toFixed(6)} ${tokenSymbol} ${usdAmount !== "N/A" ? `(~$${usdAmount})` : ""}`;
  };

  const renderMessageContent = () => {
    if (isContractLoading) {
      return (
        <div className="p-6 bg-white bg-opacity-90 backdrop-blur-lg rounded-xl shadow-md animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-500">
          <p>Error loading messages: {error}</p>
          <button
            onClick={refetchMessages}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    if (messages.length === 0) {
      return <p className="text-center text-gray-600">No messages yet. Be the first to donate and leave a message!</p>;
    }

    return messages.map((msg, index) => (
      <div key={index} className="p-6 bg-white bg-opacity-90 backdrop-blur-lg rounded-xl shadow-md">
        <p className="text-gray-800 text-lg italic">&quot;{msg.message}&quot;</p>
        <div className="text-sm text-gray-600 mt-4">
          <span className="font-semibold">From:</span> {msg.sender} | <span className="font-semibold">Donated:</span>{" "}
          {formatDonationAmount(msg.amount, tokenPrice)} | <span className="font-semibold">Chain:</span>{" "}
          {getChainName(selectedChain)}
        </div>
      </div>
    ));
  };

  return (
    <div className="mt-12 w-full max-w-2xl">
      <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">Messages from Our Supporters</h2>
      <div className="space-y-6">{renderMessageContent()}</div>
    </div>
  );
};
