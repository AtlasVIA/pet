import React from 'react';
import { FaTwitter } from 'react-icons/fa';

const TweetButton = () => {
  const tweetText = encodeURIComponent("Check out Dogachi.Pet - The cutest blockchain pet adoption platform! 🐶🐱 #DogachiPet #BlockchainPets");
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  return (
    <a
      href={tweetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center bg-blue-400 hover:bg-blue-500 text-white px-3 py-2 rounded-md font-medium transition-colors duration-200"
    >
      <FaTwitter className="mr-2" />
      Tweet About Us
    </a>
  );
};

export default TweetButton;