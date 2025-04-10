// app/(main)/Home/_components/JackpotCard.tsx
import { useContext } from "react";
import { AppContext } from "@/lib/providers/AppContextProvider";
import { Address, JackpotState } from "@/lib/types/lottery";

interface JackpotCardProps extends JackpotState {
  title: string;
  onPlay: () => void;
  participants: Address[];
  disabled?: boolean;
  jackpotId: string; // Add jackpotId to identify this jackpot
}

export default function JackpotCard({
  title,
  amount,
  targetAmount,
  isSpinning,
  winner,
  isActive,
  isFirstCycle,
  participants,
  onPlay,
  disabled = false,
  jackpotId,
}: JackpotCardProps) {
  const { data: appData } = useContext(AppContext);
  const { participatedJackpots } = appData;
  const hasParticipated = participatedJackpots.includes(jackpotId);

  return (
    <div className="p-4 bg-purple-800 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
      {/* Title */}
      <h2 className="text-lg sm:text-xl font-bold text-white mb-2">{title}</h2>

      {/* Jackpot Info */}
      <div className="space-y-2">
        <p className="text-sm sm:text-base text-purple-200">
          Current Amount: <span className="font-semibold text-white">{amount} ETH</span>
        </p>
        <p className="text-sm sm:text-base text-purple-200">
          Target Amount: <span className="font-semibold text-white">{targetAmount} ETH</span>
        </p>
        <p className="text-sm sm:text-base text-purple-200">
          Participants: <span className="font-semibold text-white">{participants.length}</span>
        </p>
      </div>

      {/* Winner Info (if applicable) */}
      {winner && (
        <p className="mt-3 text-sm sm:text-base text-purple-300">
          Winner: <span className="font-semibold">{winner.address}</span>
        </p>
      )}

      {/* Play Button */}
      <button
        onClick={onPlay}
        disabled={disabled || isSpinning || !isActive || hasParticipated}
        className={`mt-4 w-full py-2 rounded-lg text-sm sm:text-base font-semibold text-white transition-colors duration-200 ${
          disabled || isSpinning || !isActive || hasParticipated
            ? "bg-purple-400 cursor-not-allowed"
            : "bg-purple-500 hover:bg-purple-400"
        }`}
      >
        {hasParticipated ? "Already in this place" : isSpinning ? "PROCESSING..." : "PLAY NOW - 0.05ETH"}
      </button>

      {/* Status Indicators */}
      <div className="mt-2 flex flex-wrap gap-2">
        {disabled && (
          <span className="text-xs sm:text-sm text-red-400">You must connect your wallet to play</span>
        )}
        {!isActive && (
          <span className="text-xs sm:text-sm text-red-400">Inactive</span>
        )}
        {isFirstCycle && (
          <span className="text-xs sm:text-sm text-yellow-400">First Cycle</span>
        )}
      </div>
    </div>
  );
}