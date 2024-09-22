export interface Pet {
  id: number;
  name: string;
  image: string;
  happiness: number;
  health: number;
  hunger: number;
  energy: number;
}

export interface Achievement {
  name: string;
  description: string;
  completed: boolean;
}

export interface GameState {
  totalDonations: number;
  level: number;
  totalPetsAdopted: number;
  totalPlayTime: number;
  consecutiveDaysPlayed: number;
}

export type ActionType = 'Feed' | 'Play' | 'Rest' | 'Train';

export interface Action {
  type: ActionType;
  icon: string;
  color: string;
  tooltip: string;
}

export type Cooldowns = Record<ActionType, boolean>;

export interface PetCardProps {
  pet: Pet;
  onDonation: (amount: number) => void;
}

export interface PetActionsProps {
  pet: Pet;
  onDonation: (amount: number) => void;
}

export interface PetStatsProps {
  pet: Pet;
}

export interface StatBarProps {
  label: string;
  value: number;
  icon: string;
  color: string;
  tooltip: string;
  reverse?: boolean;
}

export interface GameScreenProps {
  pets: Pet[];
  gameState: GameState;
  onDonation: (amount: number) => void;
}