'use client';

import React, { useState, useEffect } from 'react';
import PetCard from './PetCard';
import { GameScreenProps, Achievement } from '../types';
import { mockAchievements, mockTips } from '../mockData';

const GameScreen: React.FC<GameScreenProps> = ({ pets, gameState, onDonation }) => {
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    setAchievements(mockAchievements);
  }, [gameState]);

  const nextTip = () => {
    setCurrentTipIndex((prevIndex) => (prevIndex + 1) % mockTips.length);
  };

  const prevTip = () => {
    setCurrentTipIndex((prevIndex) => (prevIndex - 1 + mockTips.length) % mockTips.length);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-base-200 rounded-lg p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pets.map((pet) => (
                <PetCard key={pet.id} pet={pet} onDonation={onDonation} />
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-base-200 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-primary">Game Stats</h2>
            <div className="space-y-2">
              <StatItem label="Total Donations" value={`$${gameState.totalDonations.toFixed(2)}`} icon="💰" />
              <StatItem label="Level" value={gameState.level.toString()} icon="🏆" />
              <StatItem label="Pets Adopted" value={gameState.totalPetsAdopted.toString()} icon="🏠" />
              <StatItem label="Total Play Time" value={`${gameState.totalPlayTime} hours`} icon="⏱️" />
              <StatItem label="Consecutive Days" value={gameState.consecutiveDaysPlayed.toString()} icon="📅" />
            </div>
          </div>
          <div className="bg-base-200 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-primary">Achievements</h2>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className={`bg-base-100 rounded p-3 flex flex-col items-center ${achievement.completed ? 'opacity-100' : 'opacity-50'}`}>
                  <span className="text-4xl mb-2">{achievement.icon}</span>
                  <p className="font-medium text-primary text-center">{achievement.name}</p>
                  <p className="text-xs text-base-content opacity-75 text-center">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-base-200 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-primary">Tip of the Day</h2>
            <div className="relative">
              <p className="text-base-content italic min-h-[4rem] flex items-center">
                <span className="text-4xl mr-4">{mockTips[currentTipIndex].split(' ')[0]}</span>
                <span>{mockTips[currentTipIndex].split(' ').slice(1).join(' ')}</span>
              </p>
              <div className="flex justify-between mt-4">
                <button onClick={prevTip} className="btn btn-sm btn-primary">⬅️ Previous</button>
                <button onClick={nextTip} className="btn btn-sm btn-primary">Next ➡️</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatItem: React.FC<{ label: string; value: string; icon: string }> = ({ label, value, icon }) => (
  <div className="flex items-center justify-between">
    <span className="text-base-content flex items-center">
      <span className="text-2xl mr-2">{icon}</span>
      {label}:
    </span>
    <span className="font-medium text-primary">{value}</span>
  </div>
);

export default GameScreen;