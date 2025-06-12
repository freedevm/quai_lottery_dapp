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
  disabled?: boolean;
  jackpotId: number;
  status: string;
  userTickets: number;
  totalTicketCount: number;
}

const imageFolder = "https://ipfs.io/ipfs/bafybeidt4rnvygim42sxyy4icxyasabzbvoegxbw5ew5ww3lcnggyhyjoa/"

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
  isSpinning = false,
  isActive,
  isParticipated,
  totalTicketCount,
  userTickets,
  onPlay,
  disabled = false,
  jackpotId,
  status,
}: JackpotCardProps) {
  const { data: appData } = useContext(AppContext);
  const participatedJackpots = appData.participatedGames;

  // Calculate progress percentage
  let percentage = 0;
  if(amount) percentage = Math.min((amount / targetAmount) * 100, 100);
 
  let shimClass = "shim-green";
  if (percentage > 90) shimClass = "shim-rose";
  else if (percentage > 60) shimClass = "shim-orange";
  else if (percentage > 30) shimClass = "shim-amber"

  const handlePlayBtnClick = () => {
    if (!isParticipated && status!== "finished" && !isSpinning) {
      onPlay();
    }
  }

  return (
    <div className="w-full bg-transparent rounded-lg shadow-xl/20 transition-all duration-300 hover:shadow-xl/30 max-w-sm mx-auto">
      <div className="w-full h-0 pb-[100%] relative [perspective:1000px] group">
        <div className="absolute inset-0 w-full h-full duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-t-lg overflow-hidden">
            <Image
              src={`${imageFolder}${(jackpotId%12===0)?12:(jackpotId%12)}.jpg`}
              alt={title}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-t-lg overflow-hidden">
            <div className="w-full h-full relative scale-x-[-1]">
              <Image
                src={`${imageFolder}${(jackpotId%12===0)?12:(jackpotId%12)}.jpg`}
                alt={`${title} (Back)`}
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 bg-purple-800 rounded-b-lg">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-2 animate-text-glare uppercase">{title}</h2>
        <div className="space-y-2">
          {amount && <p className="text-sm sm:text-base text-purple-200 uppercase">
            Current: <span className="font-semibold text-white">{parseInt(amount.toString())} QUAI ({totalTicketCount} Tickets)</span>
          </p>}
          {targetAmount && <p className="text-sm sm:text-base text-purple-200 uppercase">
            Target: <span className="font-semibold text-white">{parseInt(targetAmount.toString())} QUAI</span>
          </p>}
        </div>
        {/* {winner && (
          <p className="mt-3 text-sm sm:text-base text-purple-300">
            Winner: <span className="font-semibold">{winner.address}</span>
          </p>
        )} */}

        {/* Play Button */}
        <div className="w-full py-2 flex flex-col space-y-3 text-sm sm:text-base font-semibold text-white uppercase">
          <div
            onClick={handlePlayBtnClick}
            className="relative flex justify-center items-center w-full bg-purple-300 rounded-lg overflow-hidden h-9 sm:h-10 cursor-pointer"
          >
            <div
              style={{ width: `${percentage}%` }}
              className={`absolute top-0 left-0 h-9 sm:h-10 opacity-80 ${shimClass}`}
            ></div>
            <span className="z-10">
              {disabled ? "play now" :
                status === "finished" ?  "waiting reward" : 
                isParticipated ? `already in with ${userTickets} ticket${userTickets===1?"":"s"}` : 
                isSpinning ? "processing..." : 
                `play now - ${appData.entryPrice ? appData.entryPrice : 0} QUAI`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}