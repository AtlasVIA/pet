import React from 'react';
import PetCard from './PetCard';
import { Pet } from '../types';

interface GameScreenProps {
  pets: Pet[];
}

const GameScreen: React.FC<GameScreenProps> = ({ pets }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">My Dogachi Pets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  );
};

export default GameScreen;