"use client";

import Image from "next/image";
import NumberCounter from "../NumberCounter";
import { cardImages } from "@/lib/constants/cardImages";
import { Card } from "@/lib/types/lottery"
import { useEffect } from "react";

interface MintItemProps {
  data: Card;
  handleCountChange: (value: number) => void;
  onMint: () => void;
  isLoading: boolean;
  maxMintable: number;
  stockNum: number;
  description?: string;
}

export default function NFTMintItem({
  data,
  handleCountChange,
  onMint,
  isLoading,
  maxMintable,
  stockNum,
  description = "Boost your chances with this exclusive NFT card!",
}: MintItemProps) {

  return (
    <div className="w-full mx-auto p-4">
      <div className="bg-purple-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col sm:flex-row">
        {/* Image Container */}
        <div className="relative w-full sm:w-[300px] h-64 shrink-0">
          <Image
            src={cardImages[data.cardName]}
            alt={`${data.cardName}`}
            fill
            objectFit="cover"
            sizes="(max-width: 640px) 100vw, 300px"
            priority
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAIUwNRP9fKOQAAAABJRU5ErkJggg=="
          />
        </div>

        {/* Content Container */}
        <div className="flex-1 p-4 flex flex-col">
          {/* NFT Info - Top */}
            <h3 className="text-lg font-semibold text-white truncate uppercase animate-text-glare">
              {data.cardName} card
            </h3>
            <h3 className="text-md font-semibold text-white uppercase">
                price: {data.cardPrice} ETH
            </h3>
            <h3 className="text-md font-semibold text-white uppercase">
              {(stockNum !== 0) ? `${stockNum} in stock` : "out of stock"} 
            </h3>
            <p className="text-sm text-gray-300 line-clamp-3">{description}</p>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Controls - Bottom */}
          <div className="flex justify-between mt-2">
            <NumberCounter
              min={0}
              max={maxMintable}
              initialValue={0}
              onChange={handleCountChange}
            />
            <button
              onClick={onMint}
              disabled={isLoading}
              className="w-full max-w-xs px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-400 active:bg-red-600 disabled:bg-purple-400 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? "Processing..." : "Mint"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}