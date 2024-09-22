'use client';

import React, { useState, useEffect } from 'react';
import { PetActionsProps, Action, ActionType, Pet, Cooldowns } from '../types';

const SuccessPopup: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-success text-base-100 px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce text-sm">
      {message}
    </div>
  );
};

const PetActions: React.FC<PetActionsProps> = ({ pet, onDonation }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [cooldowns, setCooldowns] = useState<Cooldowns>({
    Feed: false,
    Play: false,
    Rest: false,
    Train: false,
  });

  const handleAction = (action: ActionType) => {
    if (cooldowns[action]) return;

    console.log(`${action} ${pet.name}`);
    
    // Simulate a microdonation
    const donation = Math.random() * 0.5 + 0.1; // Random donation between $0.1 and $0.6
    onDonation(donation);

    // Update pet stats (this would typically be done through an API call)
    const updatedPet = updatePetStats(pet, action);
    // In a real app, you would update the pet's state in the parent component or global state
    console.log('Updated pet:', updatedPet);

    // Show success popup
    setPopupMessage(`${action} successful! $${donation.toFixed(2)} donated.`);
    setShowPopup(true);

    // Set cooldown
    setCooldowns(prev => ({ ...prev, [action]: true }));
    setTimeout(() => {
      setCooldowns(prev => ({ ...prev, [action]: false }));
    }, 5000); // 5 second cooldown
  };

  const updatePetStats = (pet: Pet, action: ActionType): Pet => {
    const newPet = { ...pet };
    switch (action) {
      case 'Feed':
        newPet.hunger = Math.max(0, newPet.hunger - 20);
        newPet.happiness = Math.min(100, newPet.happiness + 10);
        break;
      case 'Play':
        newPet.happiness = Math.min(100, newPet.happiness + 20);
        newPet.energy = Math.max(0, newPet.energy - 10);
        break;
      case 'Rest':
        newPet.energy = Math.min(100, newPet.energy + 30);
        break;
      case 'Train':
        newPet.health = Math.min(100, newPet.health + 15);
        newPet.energy = Math.max(0, newPet.energy - 20);
        break;
    }
    return newPet;
  };

  const actionButtons: Action[] = [
    { type: 'Feed', color: 'btn-primary', icon: '🍖', tooltip: 'Feed your pet' },
    { type: 'Play', color: 'btn-secondary', icon: '🎾', tooltip: 'Play with your pet' },
    { type: 'Rest', color: 'btn-accent', icon: '💤', tooltip: 'Let your pet rest' },
    { type: 'Train', color: 'btn-info', icon: '🏋️', tooltip: 'Train your pet' },
  ];

  return (
    <div className="mt-2">
      <div className="grid grid-cols-4 gap-2">
        {actionButtons.map((button) => (
          <button
            key={button.type}
            className={`btn btn-sm ${button.color} ${
              cooldowns[button.type] ? 'btn-disabled' : ''
            }`}
            onClick={() => handleAction(button.type)}
            disabled={cooldowns[button.type]}
            title={button.tooltip}
          >
            <span>{button.icon}</span>
          </button>
        ))}
      </div>
      {showPopup && (
        <SuccessPopup
          message={popupMessage}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default PetActions;