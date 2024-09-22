import React from "react";
import { FaTwitter } from "react-icons/fa";

interface TweetButtonProps {
  text: string;
  donationAmount?: string;
  tokenType?: string;
  chainName?: string;
}

const TweetButton: React.FC<TweetButtonProps> = ({ text, donationAmount, tokenType, chainName }) => {
  let tweetText = encodeURIComponent(text);

  if (donationAmount && tokenType && chainName) {
    tweetText += encodeURIComponent(` I just donated ${donationAmount} ${tokenType} on ${chainName}!`);
  }

  tweetText += encodeURIComponent(" #DogachiPet #BlockchainForGood");

  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  return (
    <a
      href={tweetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center bg-blue-400 hover:bg-blue-500 text-white px-3 py-2 rounded-md font-medium transition-colors duration-200"
    >
      <FaTwitter className="mr-2" />
      Tweet
    </a>
  );
};

export default TweetButton;
