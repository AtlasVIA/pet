import React, { useEffect, useState } from "react";
import TweetButton from "../../../components/TweetButton";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import Confetti from "react-confetti";

interface DonationSuccessPanelProps {
  isVisible: boolean;
  onClose: () => void;
  donationAmount: string;
  tokenType: string;
  chainName: string;
  isLoading: boolean;
}

const DonationSuccessPanel: React.FC<DonationSuccessPanelProps> = ({
  isVisible,
  onClose,
  donationAmount,
  tokenType,
  chainName,
  isLoading,
}) => {
  const [impactPercentage, setImpactPercentage] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const dogAnimation = useAnimation();
  const textAnimation = useAnimation();

  useEffect(() => {
    if (isVisible && !isLoading) {
      setShowConfetti(true);
      animateImpactMeter();
      dogAnimation.start({
        y: [0, -10, 0],
        transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
      });
      textAnimation.start({
        scale: [1, 1.05, 1],
        transition: { duration: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
      });
    } else {
      setShowConfetti(false);
    }
  }, [isVisible, isLoading, dogAnimation, textAnimation]);

  const animateImpactMeter = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setImpactPercentage(progress);
      if (progress >= 100) clearInterval(interval);
    }, 30);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
          >
            {showConfetti && (
              <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={200} />
            )}

            {/* Animated background */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)">
                <animate attributeName="x" from="0" to="-40" dur="20s" repeatCount="indefinite" />
                <animate attributeName="y" from="0" to="-40" dur="20s" repeatCount="indefinite" />
              </rect>
            </svg>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-t-4 border-white border-solid rounded-full"
                />
                <p className="mt-4 text-xl text-white">Processing your donation...</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="relative z-10 h-full flex flex-col justify-between"
              >
                {/* Animated dog character */}
                <motion.svg animate={dogAnimation} className="w-1/2 h-1/3 mx-auto" viewBox="0 0 100 100">
                  <g id="dog">
                    <ellipse cx="50" cy="70" rx="30" ry="20" fill="#8B4513" />
                    <circle cx="50" cy="40" r="25" fill="#8B4513" />
                    <circle cx="40" cy="35" r="5" fill="white" />
                    <circle cx="60" cy="35" r="5" fill="white" />
                    <circle cx="40" cy="35" r="2" fill="black" />
                    <circle cx="60" cy="35" r="2" fill="black" />
                    <ellipse cx="50" cy="45" rx="8" ry="6" fill="black" />
                    <path d="M 30 40 Q 50 60 70 40" fill="none" stroke="#8B4513" strokeWidth="4" />
                    <path d="M 25 20 Q 30 5 40 15" fill="#8B4513" />
                    <path d="M 75 20 Q 70 5 60 15" fill="#8B4513" />
                  </g>
                </motion.svg>

                {/* Enhanced impact meter */}
                <div className="w-full bg-white bg-opacity-30 rounded-full h-6 mt-6 overflow-hidden">
                  <motion.div
                    className="bg-yellow-300 h-full rounded-full flex items-center justify-end pr-2"
                    initial={{ width: 0 }}
                    animate={{ width: `${impactPercentage}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  >
                    <span className="text-xs font-bold text-blue-900">{impactPercentage}%</span>
                  </motion.div>
                </div>
                <p className="text-white text-center mt-2 text-sm md:text-base font-semibold">Impact Meter</p>

                <motion.div animate={textAnimation} className="text-center my-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Thank You!</h2>
                  <p className="text-xl md:text-2xl text-white">Your generous donation of</p>
                  <p className="text-3xl md:text-4xl font-bold text-yellow-300 my-3">${donationAmount}</p>
                  <p className="text-xl md:text-2xl text-white">on {chainName} will help save dogs!</p>
                </motion.div>

                <div className="flex flex-col space-y-4">
                  <p className="text-white text-center text-lg">Share your donation:</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <TweetButton
                      text="I just made a donation to help save dogs with Dogachi.Pet!"
                      donationAmount={donationAmount}
                      tokenType={tokenType}
                      chainName={chainName}
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-full bg-white bg-opacity-20 text-white font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-opacity-30 relative overflow-hidden mt-6"
                >
                  <span className="relative z-10">Close</span>
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 0.2 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DonationSuccessPanel;
