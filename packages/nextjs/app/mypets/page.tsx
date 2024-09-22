import GameScreen from './components/GameScreen';
import { mockPets } from './mockData';

export default async function MyPetsPage() {
  return (
    <div className="bg-gradient-to-b from-primary to-base-300 min-h-screen">
      <GameScreen pets={mockPets} />
    </div>
  );
}
