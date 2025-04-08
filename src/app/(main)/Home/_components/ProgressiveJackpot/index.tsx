import { useState, useEffect, ReactNode } from 'react';

// Define interfaces for props
interface Address {
  address: string;
}

interface CyclingAddressesProps {
  addresses: Address[];
  isSpinning: boolean;
  winner: Address | null;
}

interface TooltipProps {
  children: ReactNode;
}

interface ProgressiveJackpotProps {
  amount: number;
  targetAmount: number;
  isSpinning: boolean;
  winner: Address | null;
  onPlay: () => void;
  participants: Address[];
}

function CyclingAddresses({ addresses, isSpinning, winner }: CyclingAddressesProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (!isSpinning) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % addresses.length);
    }, 100);
    return () => clearInterval(interval);
  }, [isSpinning, addresses.length]);

  if (winner) return <div className="text-purple-300 text-sm mt-2">{winner.address}</div>;
  return (
    <div className="text-purple-300 text-sm mt-2 h-6">
      {isSpinning && addresses[currentIndex] ? addresses[currentIndex].address : ''}
    </div>
  );
}

function Tooltip({ children }: TooltipProps) {
  return (
    <div className="relative group inline-block">
      {children}
      <div className="opacity-0 bg-purple-900 text-white text-sm rounded-lg py-2 px-3 absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 pointer-events-none group-hover:opacity-100 transition-opacity duration-200">
        The progressive Jackpot is rewarded to a random holder who enters the smaller games in the current cycle.
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 border-8 border-transparent border-t-purple-900"></div>
      </div>
    </div>
  );
}

export default function ProgressiveJackpot({ 
  amount, 
  targetAmount, 
  isSpinning, 
  winner, 
  onPlay, 
  participants 
}: ProgressiveJackpotProps) {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold mb-4">
        1,000 ETH Progressive Mega Jackpot
        <Tooltip>
          <span className="inline-block ml-2 align-middle cursor-help">
          </span>
        </Tooltip>
      </h1>
      <div className="text-6xl font-bold text-purple-400 mb-4">{amount.toLocaleString()} ETH</div>
      <div className="w-full h-8 bg-purple-900 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-purple-500 transition-all duration-300"
          style={{ width: `${(amount / targetAmount) * 100}%` }}
        />
      </div>
      <button
        onClick={onPlay}
        className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-lg text-xl font-bold text-white"
      >
        Investor Inquiry
      </button>
      <CyclingAddresses addresses={participants} isSpinning={isSpinning} winner={winner} />
      {winner && (
        <div className="mt-6 text-center">
          <div className="text-xl font-bold text-yellow-400">Winner!</div>
        </div>
      )}
    </div>
  );
}