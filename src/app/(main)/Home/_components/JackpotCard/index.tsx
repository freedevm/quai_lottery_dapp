import { ReactNode, useContext } from "react";
import { AppContext } from "@/lib/providers/AppContextProvider";
import { Address, JackpotState } from "@/lib/types/lottery";
import Image from "next/image";

interface TooltipProps {
  children: ReactNode;
}

interface JackpotCardProps extends JackpotState {
  title: string;
  onPlay: () => void;
  participants: Address[];
  disabled?: boolean;
  jackpotId: string;
}

function Tooltip({ children }: TooltipProps) {
  return (
    <div className="relative w-full group inline-block">
      <div className="opacity-0 bg-purple-900 text-white text-xs sm:text-sm rounded-lg py-2 px-3 absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mt-2 w-48 sm:w-64 pointer-events-none group-hover:opacity-100 transition-opacity duration-200">
        You must connect your wallet to play
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-8 border-transparent border-b-purple-900"></div>
      </div>
      {children}
    </div>
  );
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
  const buttonStyle = isSpinning || !isActive || hasParticipated
    ? { backgroundColor: "#9f7aea" } // Disabled state: purple-400
    : { background: `linear-gradient(to right, ${color} ${percentage}%, #ccc ${percentage}%)` }; // Enabled state: progress gradient

  return (
    <div className="w-full bg-purple-800 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl max-w-sm mx-auto">
      {/* Image */}
      <div className="w-full h-0 pb-[100%] relative rounded-lg overflow-hidden mb-4">
        <Image src="https://ipfs.io/ipfs/bafkreihhgfsvvlowniwumnfygu4faveaxc7j6er4m6gvg3fd3tmskzhcr4" alt={title} layout="fill" objectFit="cover" />
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-2 animate-text-glare">{title}</h2>
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
        {winner && (
          <p className="mt-3 text-sm sm:text-base text-purple-300">
            Winner: <span className="font-semibold">{winner.address}</span>
          </p>
        )}

        {/* Play Button */}
        {disabled ? (
          <Tooltip>
            <button
              onClick={onPlay}
              disabled={true}
              style={{ backgroundColor: "#9f7aea" }}
              className="uppercase mt-4 w-full py-2 rounded-lg text-sm sm:text-base font-semibold text-white transition-colors duration-200 cursor-not-allowed animate-glare"
            >
              play now
            </button>
          </Tooltip>
        ) : (
          <button
            onClick={onPlay}
            disabled={isSpinning || !isActive || hasParticipated}
            style={buttonStyle}
            className={`uppercase mt-4 w-full py-2 rounded-lg text-sm sm:text-base font-semibold text-white transition-colors duration-200 animate-glare ${
              isSpinning || !isActive || hasParticipated ? "cursor-not-allowed" : ""
            }`}
          >
            {hasParticipated ? "already in this place" : isSpinning ? "processing..." : "play now - 0.05eth"}
          </button>
        )}
      </div>
    </div>
  );
}