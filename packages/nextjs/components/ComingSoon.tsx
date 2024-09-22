import React, { useEffect, useState, useRef } from "react";
import { InformationCircleIcon, SparklesIcon } from "@heroicons/react/24/outline";
import useScrolling from "../app/donations/hooks/useScrolling";

interface ComingSoonProps {
  name: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ name }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMouseInside, setIsMouseInside] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { scrollToDonationForm } = useScrolling();

  const startTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => setIsVisible(false), 5000);
  };

  useEffect(() => {
    if (isVisible && !isMouseInside) {
      startTimer();
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isVisible, isMouseInside]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsVisible(true);
  };

  const handleDonateClick = () => {
    setIsVisible(false);
    scrollToDonationForm();
  };

  const handleMouseEnter = () => {
    setIsMouseInside(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsMouseInside(false);
    startTimer();
  };

  return (
    <div className="relative inline-block">
      <span onClick={handleClick} className="cursor-pointer hover:text-primary transition-colors duration-300">
        {name}
      </span>
      {isVisible && (
        <div
          ref={popupRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="fixed sm:absolute z-10 top-1/4 sm:top-full left-1/2 transform -translate-x-1/2 mt-4 p-4 sm:p-6 bg-base-200 text-base-content rounded-xl shadow-xl transition-all duration-300 ease-in-out animate-fadeIn w-[90vw] sm:w-[36rem] max-w-[36rem] border-2 border-primary"
        >
          <div className="flex flex-col items-center space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full">
              <SparklesIcon className="h-8 w-8 sm:h-10 sm:w-10 text-primary-content" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-center text-primary">Coming Soon!</h3>
            <p className="text-sm sm:text-base text-center">Consider donating to accelerate development!</p>
            <button
              onClick={handleDonateClick}
              className="flex items-center justify-center space-x-2 text-primary-content bg-primary hover:bg-primary-focus p-2 sm:p-3 rounded-lg w-full transition-colors duration-200"
            >
              <InformationCircleIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm font-semibold">Your support matters!</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComingSoon;
