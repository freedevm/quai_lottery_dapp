import { ReactNode } from "react";
import { JackpotState } from "@/lib/types/lottery";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface TooltipProps {
  children: ReactNode;
}

interface ProgressiveJackpotProps extends JackpotState {
  disabled?: boolean;
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

export default function ProgressiveJackpot({
  amount = 0,
  targetAmount= 100,
  isSpinning = false,
  disabled = false,
}: ProgressiveJackpotProps) {
  const router = useRouter()
  // Calculate progress percentage
  let percentage = 0;
  if (amount) percentage = Math.min((amount / targetAmount) * 100, 100);

  // Determine color based on percentage
  const getColor = (percent: number) => {
    if (percent <= 30) return "#22c55e"; // green-500
    else if (percent <= 60) return "#eab308"; // yellow-500
    else if (percent <= 90) return "#f97316"; // orange-500
    else return "#ef4444"; // red-500
  };
  const color = getColor(percentage);

  // Define button style
  const buttonStyle = { background: `linear-gradient(to right, ${color} ${percentage}%, #D8B4FE ${percentage}%)` }; // Enabled state: progress gradient

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
        className="text-4xl sm:text-5xl md:text-6xl font-bold text-white uppercase my-4 w-full py-2 rounded-lg transition-colors duration-200"
      >
        {amount ? amount.toLocaleString() : 0} eth
      </div>

      {/* <button
        onClick={() => router.push('/Investors')}
        className="uppercase w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-xl font-bold text-white transition-colors duration-200 bg-purple-500 hover:bg-purple-600"
        aria-label="Participate in the Progressive Mega Jackpot"
      >
        Investor Inquiry
      </button> */}
      <Link href="/Investors" className="box-border relative z-30 inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-purple-600 rounded-md cursor-pointer group ring-offset-2 ring-1 ring-purple-500 ring-offset-purple-400 hover:ring-offset-purple-500 ease focus:outline-none">
        <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
        <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
        <span className="relative z-20 flex items-center text-base sm:text-xl">
            Investor Inquiry
        </span>
      </Link>
    </div>
  );
}