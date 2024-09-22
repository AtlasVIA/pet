import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

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
  isLoading
}) => {
  const confettiRef = useRef<SVGSVGElement>(null);
  const [impactPercentage, setImpactPercentage] = useState(0);
  const dogAnimation = useAnimation();
  const textAnimation = useAnimation();

  useEffect(() => {
    if (isVisible && !isLoading) {
      animateConfetti();
      animateImpactMeter();
      dogAnimation.start({
        y: [0, -10, 0],
        transition: { duration: 1, repeat: Infinity, repeatType: 'reverse' }
      });
      textAnimation.start({
        scale: [1, 1.05, 1],
        transition: { duration: 2, repeat: Infinity, repeatType: 'reverse' }
      });
    }
  }, [isVisible, isLoading]);

  const animateConfetti = () => {
    const confetti = confettiRef.current;
    if (confetti) {
      const particles = confetti.querySelectorAll('path');
      particles.forEach((particle) => {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const delay = Math.random() * 2;
        const duration = 2 + Math.random() * 2;
        const rotation = Math.random() * 360;
        particle.setAttribute('style', `
          animation: fall ${duration}s ease-in infinite;
          animation-delay: -${delay}s;
          transform: translate(${x}vw, -20px) rotate(${rotation}deg);
        `);
      });
    }
  };

  const animateImpactMeter = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setImpactPercentage(progress);
      if (progress >= 100) clearInterval(interval);
    }, 20);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 15 }}
            className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg p-6 w-full max-w-md shadow-xl relative overflow-hidden"
            style={{ aspectRatio: '1 / 1' }}
          >
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

            {/* 3D-like scene with perspective */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grass" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4CAF50" />
                  <stop offset="100%" stopColor="#8BC34A" />
                </linearGradient>
              </defs>
              <polygon points="0,100 100,100 100,70 0,85" fill="url(#grass)" />
              <path d="M0,85 C30,82 70,75 100,70" fill="none" stroke="#795548" strokeWidth="0.5" />
              <path d="M0,90 C30,88 70,82 100,80" fill="none" stroke="#795548" strokeWidth="0.5" />
              <path d="M0,95 C30,94 70,90 100,90" fill="none" stroke="#795548" strokeWidth="0.5" />
            </svg>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 border-t-4 border-white border-solid rounded-full"
                />
                <p className="mt-4 text-xl text-white">Processing your donation...</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative z-10 h-full flex flex-col justify-between"
              >
                {/* Animated dog character */}
                <motion.svg
                  animate={dogAnimation}
                  className="w-1/2 h-1/3 mx-auto"
                  viewBox="0 0 100 100"
                >
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

                {/* Dynamic impact meter */}
                <div className="w-full bg-white bg-opacity-30 rounded-full h-4 mt-4 overflow-hidden">
                  <motion.div
                    className="bg-yellow-300 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${impactPercentage}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <p className="text-white text-center mt-2 text-sm md:text-base">Impact: {impactPercentage}%</p>

                {/* Morphing text effect */}
                <motion.div
                  animate={textAnimation}
                  className="text-center my-4"
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Thank You!</h2>
                  <p className="text-lg md:text-xl text-white">
                    Your generous donation of
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-yellow-300 my-2">
                    {donationAmount} {tokenType}
                  </p>
                  <p className="text-lg md:text-xl text-white">
                    on {chainName} will help save dogs!
                  </p>
                </motion.div>

                {/* Interactive close button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-full bg-white bg-opacity-20 text-white font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-opacity-30 relative overflow-hidden"
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

            {/* Elaborate confetti animation */}
            <svg ref={confettiRef} className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              {[...Array(30)].map((_, i) => (
                <path
                  key={i}
                  d={`M${Math.random() * 100},${Math.random() * 100} L${Math.random() * 100},${Math.random() * 100} L${Math.random() * 100},${Math.random() * 100} Z`}
                  fill={`hsl(${Math.random() * 360}, 100%, 70%)`}
                />
              ))}
            </svg>

            {/* Paw print trail animation */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <path id="paw" d="M0,0 C-1,-1 -2,0 -2,1 C-2,2 -1,3 0,3 C1,3 2,2 2,1 C2,0 1,-1 0,0 M-1.5,1.5 C-2.5,1.5 -3.5,2.5 -3.5,3.5 C-3.5,4.5 -2.5,5.5 -1.5,5.5 C-0.5,5.5 0.5,4.5 0.5,3.5 C0.5,2.5 -0.5,1.5 -1.5,1.5 M1.5,1.5 C0.5,1.5 -0.5,2.5 -0.5,3.5 C-0.5,4.5 0.5,5.5 1.5,5.5 C2.5,5.5 3.5,4.5 3.5,3.5 C3.5,2.5 2.5,1.5 1.5,1.5 M-1.5,-1.5 C-2.5,-1.5 -3.5,-0.5 -3.5,0.5 C-3.5,1.5 -2.5,2.5 -1.5,2.5 C-0.5,2.5 0.5,1.5 0.5,0.5 C0.5,-0.5 -0.5,-1.5 -1.5,-1.5 M1.5,-1.5 C0.5,-1.5 -0.5,-0.5 -0.5,0.5 C-0.5,1.5 0.5,2.5 1.5,2.5 C2.5,2.5 3.5,1.5 3.5,0.5 C3.5,-0.5 2.5,-1.5 1.5,-1.5" />
              </defs>
              {[...Array(8)].map((_, i) => (
                <use
                  key={i}
                  href="#paw"
                  x={10 + i * 10}
                  y={80 - i * 5}
                  fill="rgba(255,255,255,0.3)"
                >
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="0 0"
                    to="100 -50"
                    dur="3s"
                    begin={`${i * 0.2}s`}
                    repeatCount="indefinite"
                  />
                </use>
              ))}
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DonationSuccessPanel;

// Add this CSS to your global styles or component-specific styles
`
@keyframes fall {
  0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
}
`