import React from 'react';
import { PetStatsProps, StatBarProps } from '../types';

const StatBar: React.FC<StatBarProps> = ({ label, value, icon, tooltip, reverse = false }) => {
  const displayValue = reverse ? 100 - value : value;
  const barColor = displayValue > 66 ? 'bg-success' : displayValue > 33 ? 'bg-warning' : 'bg-error';

  return (
    <div className="mb-1 group relative">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-base-content flex items-center">
          <span className="mr-1">{icon}</span> {label}
        </span>
        <span className="font-medium text-base-content">{displayValue}%</span>
      </div>
      <div className="w-full bg-base-300 rounded-full h-1.5 mt-0.5">
        <div
          className={`h-1.5 rounded-full ${barColor} transition-all duration-500 ease-out`}
          style={{ width: `${displayValue}%` }}
        ></div>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute z-10 p-2 text-xs text-base-100 bg-base-content rounded-md shadow-lg -top-8 left-1/2 transform -translate-x-1/2">
        {tooltip}
      </div>
    </div>
  );
};

const PetStats: React.FC<PetStatsProps> = ({ pet }) => {
  return (
    <div>
      <StatBar 
        label="Health" 
        value={pet.health} 
        icon="❤️" 
        tooltip="Maintain your pet's health through proper care and training."
      />
      <StatBar 
        label="Hunger" 
        value={pet.hunger} 
        icon="🍖" 
        tooltip="Feed your pet to keep it satisfied and healthy."
        reverse
      />
      <StatBar 
        label="Energy" 
        value={pet.energy} 
        icon="⚡" 
        tooltip="Let your pet rest to regain energy for activities."
      />
    </div>
  );
};

export default PetStats;