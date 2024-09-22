'use client';

import React from 'react';
import { Pet } from '../types';

interface PetActionsProps {
  pet: Pet;
}

const PetActions: React.FC<PetActionsProps> = ({ pet }) => {
  const handleAction = (action: string) => {
    console.log(`${action} ${pet.name}`);
    // Here you would typically dispatch an action or call a function to update the pet's state
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded"
          onClick={() => handleAction('Feed')}
        >
          Feed
        </button>
        <button
          className="bg-green-500 text-white px-2 py-1 rounded"
          onClick={() => handleAction('Play')}
        >
          Play
        </button>
        <button
          className="bg-purple-500 text-white px-2 py-1 rounded"
          onClick={() => handleAction('Rest')}
        >
          Rest
        </button>
        <button
          className="bg-yellow-500 text-white px-2 py-1 rounded"
          onClick={() => handleAction('Train')}
        >
          Train
        </button>
      </div>
    </div>
  );
};

export default PetActions;