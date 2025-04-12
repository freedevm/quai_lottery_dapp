// app/(main)/Home/_components/ProgressiveJackpot.tsx
import { useState, useEffect, ReactNode, useContext } from "react";
import { AppContext } from "@/lib/providers/AppContextProvider";
import { Address, JackpotState } from "@/lib/types/lottery";

// Define interfaces for props
interface CyclingAddressesProps {
  addresses: Address[];
  isSpinning: boolean;
  winner: Address | null;
}

interface TooltipProps {
  children: ReactNode;
}

interface ProgressiveJackpotProps extends JackpotState {
  onPlay: () => void;
  participants: Address[];
  disabled?: boolean;
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

  if (winner) {
    return (
      <div className="text-purple-300 text-xs sm:text-sm mt-2">
        {winner.address}
      </div>
    );
  }

  return (
    <div className="text-purple-300 text-xs sm:text-sm mt-2 h-6">
      {isSpinning && addresses[currentIndex] ? addresses[currentIndex].address : ""}
    </div>
  );
}

function Tooltip({ children }: TooltipProps) {
  return (
    <div className="relative group inline-block">
      {children}
      <div className="opacity-0 bg-purple-900 text-white text-xs sm:text-sm rounded-lg py-2 px-3 absolute z-10 top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 sm:w-64 pointer-events-none group-hover:opacity-100 transition-opacity duration-200">
        The progressive Jackpot is rewarded to a random holder who enters the smaller games in the current cycle.
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-8 border-transparent border-b-purple-900"></div>
      </div>
    </div>
  );
}

function WalletConnectTooltip({ children }: TooltipProps) {
  return (
    <div className="relative w-full group inline-block">
      <div className="opacity-0 bg-purple-900 text-white text-xs sm:text-sm rounded-lg py-2 px-3 absolute z-10 top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 sm:w-64 pointer-events-none group-hover:opacity-100 transition-opacity duration-200">
        You must connect your wallet to play
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-8 border-transparent border-b-purple-900"></div>
      </div>
      {children}
    </div>
  );
}

export default function ProgressiveJackpot({
  amount,
  targetAmount,
  isSpinning,
  winner,
  onPlay,
  participants,
  disabled = false,
}: ProgressiveJackpotProps) {
  const { data: appData } = useContext(AppContext);
  const isWalletConnected = appData.isWalletConnected;

  // Calculate progress percentage
  const percentage = Math.min((amount / targetAmount) * 100, 100);

  // Determine color based on percentage
  const getColor = (percent: number) => {
    if (percent <= 30) return "#22c55e"; // green-500
    else if (percent <= 60) return "#eab308"; // yellow-500
    else if (percent <= 90) return "#f97316"; // orange-500
    else return "#ef4444"; // red-500
  };
  const color = getColor(percentage);

  // Define button style
  const buttonStyle = { background: `linear-gradient(to right, ${color} ${percentage}%, #ccc ${percentage}%)` }; // Enabled state: progress gradient

  return (
    <div className="text-center mb-8 sm:mb-10 md:mb-12">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-white">
        100 ETH Progressive Mega Jackpot
        <Tooltip>
          <span className="inline-block ml-1 sm:ml-2 align-middle cursor-help">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.732-1A3 3 0 0110 5a3 3 0 012.732 1.732 1 1 0 11-1.732 1A1 1 0 0010 7zm0 6a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </Tooltip>
      </h1>

      <div
        style={buttonStyle}
        className="text-4xl sm:text-5xl md:text-6xl font-bold text-white uppercase my-4 w-full py-2 rounded-lg text-sm sm:text-base font-semibold text-white transition-colors duration-200 animate-glare"
      >
        {amount.toLocaleString()} eth
      </div>

      <WalletConnectTooltip>
        <button
          onClick={onPlay}
          disabled={disabled || isSpinning}
          className={`uppercase w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-xl font-bold text-white transition-colors duration-200 ${
            disabled || isSpinning
              ? "bg-purple-400 cursor-not-allowed"
              : "bg-purple-500 hover:bg-purple-600"
          }`}
          aria-label="Participate in the Progressive Mega Jackpot"
        >
          {isSpinning ? "Spinning..." : "Investor Inquiry"}
        </button>
      </WalletConnectTooltip>

      {/* Cycling Addresses */}
      <CyclingAddresses
        addresses={participants}
        isSpinning={isSpinning}
        winner={winner}
      />

      {/* Winner Announcement */}
      {winner && (
        <div className="mt-4 sm:mt-6 text-center">
          <div className="text-lg sm:text-xl font-bold text-yellow-400">
            Winner!
          </div>
        </div>
      )}
    </div>
  );
}