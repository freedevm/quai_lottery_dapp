import { JackpotState } from "@/lib/types/lottery";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProgressiveJackpotProps extends JackpotState {
  disabled?: boolean;
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
  percentage=75

  let shimClass = "shim-green";
  if (percentage > 90) shimClass = "shim-rose";
  else if (percentage > 60) shimClass = "shim-orange";
  else if (percentage > 30) shimClass = "shim-amber"

  return (
    <div className="text-center mb-8 sm:mb-10 md:mb-12">
      {/* Title */}
      <div className="w-full flex flex-col md:flex-row justify-center items-center md:mb-10">
        <h1 className="relative md:text-4xl text-2xl sm:tracking-[10px] tracking-[5px] uppercase text-center outline-none animate-dimlight box-reflect">
          100ETH Progressive Mega Jackpot
        </h1>
      </div>
      
      <div className="w-full py-2 flex flex-col space-y-3 text-2xl sm:text-3xl md:text-4xl font-bold text-white uppercase">
        <div className="relative flex justify-center items-center w-full bg-purple-300 rounded-lg overflow-hidden h-10 sm:h-12 md:h-14">
          <div
            style={{ width: `${percentage}%` }}
            className={`absolute top-0 left-0 h-10 sm:h-12 md:h-14 opacity-80 ${shimClass}`}
          ></div>
          <span className="z-10">{amount ? amount.toFixed(2).toLocaleString() : 0} eth</span>
        </div>
      </div>

      <Link href="/Investors" className="box-border z-30 inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 overflow-hidden font-bold rounded-md cursor-pointer group bg-purple-500 relative hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-400 text-white hover:ring-2 hover:ring-purple-400 transition-all ease-out duration-300 focus:outline-none">
        <span className="absolute bottom-0 right-0 w-12 h-32 -mb-10 -mr-5 transition-all duration-500 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-10"></span>
        <span className="absolute top-0 left-0 w-32 h-12 -mt-1 -ml-12 transition-all duration-500 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:-translate-x-10"></span>
        <span className="relative z-20 flex items-center text-base sm:text-xl uppercase">
          Investor Inquiry
        </span>
      </Link>
    </div>
  );
}