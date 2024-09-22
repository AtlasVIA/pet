'use client';

import { useState, useEffect } from 'react';
import GameScreen from './components/GameScreen';
import { mockPets, mockInitialGameState } from './mockData';
import { Pet, GameState } from './types';

export default function MyPetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [gameState, setGameState] = useState<GameState>(mockInitialGameState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate API call to fetch pets
    const fetchPets = async () => {
      try {
        // In a real app, you would fetch data from an API here
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
        setPets(mockPets);
        setLoading(false);
      } catch (err) {
        setError('Failed to load pets. Please try again later.');
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const handleDonation = (amount: number) => {
    setGameState(prevState => {
      const newTotalDonations = prevState.totalDonations + amount;
      const newLevel = Math.floor(newTotalDonations / 10) + 1;
      return {
        totalDonations: newTotalDonations,
        level: newLevel
      };
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <div className="text-2xl font-bold text-primary animate-pulse">Loading Dogachis...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <div className="text-xl font-bold text-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-base-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">My Dogachi Pets</h1>
      <div className="max-w-7xl mx-auto">
        <GameScreen 
          pets={pets} 
          gameState={gameState}
          onDonation={handleDonation} 
        />
      </div>
    </div>
  );
}
