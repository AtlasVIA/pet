import React, { useEffect, useState } from "react";
import { InformationCircleIcon, SparklesIcon } from "@heroicons/react/24/outline";

interface ComingSoonProps {
  name: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ name }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setIsVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsVisible(true);
  };

  return (
    <div className="relative inline-block">
      <span onClick={handleClick} className="cursor-pointer">
        {name}
      </span>
      {isVisible && (
        <div className="absolute z-10 top-full left-1/2 transform -translate-x-1/2 mt-4 p-6 bg-base-200 text-base-content rounded-xl shadow-xl transition-all duration-300 ease-in-out animate-fadeIn max-w-sm border-2 border-primary">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full">
              <SparklesIcon className="h-10 w-10 text-primary-content" />
            </div>
            <h3 className="text font-bold text-center">Coming Soon!</h3>
            <p className="text-sm text-center">Consider donating to accelerate development!</p>
            <div className="flex items-center justify-center space-x-2 text-primary">
              <InformationCircleIcon className="h-5 w-5" />
              <span className="text-sm font-semibold">Your support matters!</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComingSoon;
