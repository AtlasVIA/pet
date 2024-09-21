import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

interface ChainOption {
  id: number;
  name: string;
}

interface ChainSelectProps {
  label?: string;
  options: ChainOption[];
  value: number | null;
  onChange: (value: number | null) => void;
  isLoading: boolean;
  disabled?: boolean;
  className?: string;
}

const ChainSelect: React.FC<ChainSelectProps> = ({
  label,
  options,
  value,
  onChange,
  isLoading,
  disabled,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const preloadImages = useCallback(() => {
    options.forEach(option => {
      const img = new window.Image();
      img.src = `https://scan.vialabs.io/images/logos/chains/${option.id}.png`;
    });
  }, [options]);

  useEffect(() => {
    preloadImages();
  }, [preloadImages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (optionId: number | null) => {
    setIsOpen(false);
    onChange(optionId);
  };

  const selectedOption = value !== null ? options.find(option => option.id === value) : undefined;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-1 text-base-content">
          {label}
        </label>
      )}
      <div className="relative" ref={dropdownRef}>
        <div
          className={`block w-full px-3 py-2 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm bg-base-100 text-base-content ${
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {value !== null && (
                <Image
                  width={24}
                  height={24}
                  alt={`${value} logo`}
                  className="rounded-full mr-2"
                  src={`https://scan.vialabs.io/images/logos/chains/${value}.png`}
                />
              )}
              <span>{selectedOption ? selectedOption.name : "Select Chain"}</span>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
        {isOpen && !disabled && (
          <div className="absolute top-full left-0 w-full bg-base-100 border border-base-300 rounded-md mt-1 shadow-lg z-10">
            {options.map(option => (
              <div
                key={option.id}
                className="flex items-center px-3 py-2 hover:bg-base-200 cursor-pointer"
                onClick={() => handleSelect(option.id)}
              >
                <Image
                  width={24}
                  height={24}
                  alt={`${option.name} logo`}
                  className="rounded-full mr-2"
                  src={`https://scan.vialabs.io/images/logos/chains/${option.id}.png`}
                />
                <span>{option.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ChainSelect);