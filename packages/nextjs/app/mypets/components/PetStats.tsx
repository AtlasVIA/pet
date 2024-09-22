import React from 'react';
import { Pet } from '../types';

interface PetStatsProps {
  pet: Pet;
}

const PetStats: React.FC<PetStatsProps> = ({ pet }) => {
  return (
    <div className="mb-4">
      <h3 className="font-semibold mb-2">Stats</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>Happiness: {pet.happiness}%</div>
        <div>Health: {pet.health}%</div>
        <div>Hunger: {pet.hunger}%</div>
        <div>Energy: {pet.energy}%</div>
      </div>
    </div>
  );
};

export default PetStats;