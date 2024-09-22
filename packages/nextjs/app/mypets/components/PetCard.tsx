'use client';

import React from 'react';
import PetStats from './PetStats';
import PetActions from './PetActions';
import { PetCardProps } from '../types';

const PetCard: React.FC<PetCardProps> = ({ pet, onDonation }) => {
  const getHappinessEmoji = (happiness: number) => {
    if (happiness > 80) return '😄';
    if (happiness > 60) return '😊';
    if (happiness > 40) return '😐';
    if (happiness > 20) return '😕';
    return '😢';
  };

  return (
    <div className="bg-base-100 rounded-xl shadow-lg p-4 transition-all duration-300 hover:shadow-xl hover:scale-102 border border-primary">
      <div className="flex flex-col items-center mb-4">
        <div className="w-full mb-4">
          <div className="relative overflow-hidden rounded-lg border-2 border-primary h-48">
            <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="w-full text-center">
          <h2 className="text-2xl font-bold text-primary flex items-center justify-center mb-2">
            <span className="mr-2">🐾</span> {pet.name} <span className="ml-2">🐾</span>
          </h2>
          <div className="flex items-center justify-center mb-2">
            <span className="text-xl mr-2">{getHappinessEmoji(pet.happiness)}</span>
            <div className="w-3/4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-secondary">Happiness</span>
                <span className="text-secondary">{pet.happiness}%</span>
              </div>
              <div className="w-full bg-base-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${pet.happiness}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-base-200 rounded-lg p-2 mb-4">
        <PetStats pet={pet} />
      </div>
      <PetActions pet={pet} onDonation={onDonation} />
      <div className="mt-2 text-center text-sm font-medium text-secondary">
        💖 Love your Dogachi! 💖
      </div>
    </div>
  );
};

export default PetCard;