import { Hero } from '../components/landing/Hero';
import { WhyCivicFlow } from '../components/landing/WhyCivicFlow';
import { DecisionEngine } from '../components/landing/DecisionEngine';

export function Home() {
  return (
    <div className="flex flex-col w-full -mt-8">
      {/* -mt-8 offsets the default padding from RootLayout main container */}
      <Hero />
      <WhyCivicFlow />
      <DecisionEngine />
    </div>
  );
}
