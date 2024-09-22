import { Pet, GameState, Achievement } from './types';

export const mockPets: Pet[] = [
  {
    id: 1,
    name: "Buddy",
    image: "https://images.dog.ceo/breeds/husky/n02110185_10047.jpg",
    happiness: 80,
    health: 90,
    hunger: 30,
    energy: 70
  },
  {
    id: 2,
    name: "Luna",
    image: "https://images.dog.ceo/breeds/husky/n02110185_10047.jpg",
    happiness: 75,
    health: 85,
    hunger: 40,
    energy: 60
  },
  {
    id: 3,
    name: "Max",
    image: "https://images.dog.ceo/breeds/husky/n02110185_10047.jpg",
    happiness: 70,
    health: 80,
    hunger: 50,
    energy: 50
  },
  {
    id: 4,
    name: "Daisy",
    image: "https://images.dog.ceo/breeds/husky/n02110185_10047.jpg",
    happiness: 85,
    health: 95,
    hunger: 20,
    energy: 80
  }
];

export const mockInitialGameState: GameState = {
  totalDonations: 1500,
  level: 15,
  totalPetsAdopted: 12,
  totalPlayTime: 120,
  consecutiveDaysPlayed: 25
};

export const mockAchievements: Achievement[] = [
  { name: "Newbie Caretaker", description: "Reach level 5", completed: true, icon: "🏆" },
  { name: "Dogachi Enthusiast", description: "Reach level 10", completed: true, icon: "🎖️" },
  { name: "Master Trainer", description: "Reach level 20", completed: false, icon: "🏅" },
  { name: "Legendary Dogachi Hero", description: "Reach level 50", completed: false, icon: "👑" },
  { name: "Adoption Advocate", description: "Adopt 10 pets", completed: true, icon: "🏠" },
  { name: "Playtime Pro", description: "Play for 100 hours", completed: true, icon: "⏱️" },
  { name: "Donation Champion", description: "Donate $1000 in total", completed: true, icon: "💰" },
  { name: "Consistent Caregiver", description: "Play for 30 consecutive days", completed: false, icon: "📅" },
  { name: "Gourmet Chef", description: "Prepare 50 meals for your pets", completed: false, icon: "👨‍🍳" },
  { name: "Veterinarian's Friend", description: "Complete 20 health check-ups", completed: false, icon: "🩺" },
  { name: "Agility Master", description: "Win 10 agility competitions", completed: false, icon: "🏃‍♂️" },
  { name: "Social Butterfly", description: "Arrange 30 playdates for your pets", completed: false, icon: "🦋" },
];

export const mockTips: string[] = [
  "Remember to feed your Dogachi regularly! 🍖",
  "Playing with your Dogachi increases their happiness! 🎾",
  "A clean Dogachi is a happy Dogachi! Don't forget to groom them! 🛁",
  "Exercise is important! Take your Dogachi for walks often! 🚶‍♂️🐕",
  "Show your Dogachi love and affection every day! ❤️",
  "Balanced nutrition is key to your Dogachi's health! 🥗",
  "Regular vet check-ups keep your Dogachi healthy! 👨‍⚕️",
  "Teaching your Dogachi new tricks stimulates their mind! 🧠",
  "Socialization is important! Let your Dogachi meet other pets! 🐾",
  "A tired Dogachi is a good Dogachi! Ensure they get enough exercise! 🏃‍♂️",
];