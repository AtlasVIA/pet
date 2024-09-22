'use client';

import React from 'react';
import PetStats from './PetStats';
import PetActions from './PetActions';
import { Pet } from '../types';

interface PetCardProps {
  pet: Pet;
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-2">{pet.name}</h2>
      <div className="mb-4">
        <img src={pet.image} alt={pet.name} className="w-full h-48 object-cover rounded" />
      </div>
      <PetStats pet={pet} />
      <PetActions pet={pet} />
    </div>
  );
};

export default PetCard;