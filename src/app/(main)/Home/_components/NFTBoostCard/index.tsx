import { cardImages } from "@/lib/constants/cardImages";
import Image from "next/image";

interface Props {
    nftName: string,
}

export default function NFTBoostCard ({nftName}: Props) {
    return (
        <div
            role="button"
            tabIndex={0}
            className="bg-purple-700 rounded-lg flex flex-col items-center relative cursor-pointer pb-1"
        >
            <div className="w-full h-28 relative rounded-md mb-2 overflow-hidden">
                <Image
                    src={cardImages[nftName]} 
                    alt={`${nftName} card`}
                    fill
                />
            </div>
            <p className="text-sm text-white">{nftName.toLocaleUpperCase()}</p>
            {/* Counter */}
            <div className="w-full flex justify-center">
                <div className="inline-flex items-center overflow-hidden shadow-sm">
                    <button
                        className="rounded-lg w-7 h-7 flex items-center justify-center text-white text-lg font-semibold hover:bg-purple-500 active:bg-purple-600 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        -
                    </button>
                    
                    <input
                        type="number"
                        className="w-14 h-7 text-center bg-purple-700 text-white text-lg px-2 focus:outline-none focus:ring-2 focus:ring-purple-700 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    
                    <button
                        className="rounded-lg w-7 h-7 flex items-center justify-center text-white text-lg font-semibold hover:bg-purple-500 active:bg-purple-600 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    )
}