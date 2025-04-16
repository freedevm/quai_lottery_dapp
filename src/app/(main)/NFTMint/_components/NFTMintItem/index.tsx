"use client";

import Image from "next/image";
import NumberCounter from "../NumberCounter";
import { cardImages } from "@/lib/constants/cardImages";
import { Card } from "@/lib/types/lottery"
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "@/lib/providers/AppContextProvider";
import { NFTCount } from "@/lib/types/lottery";

interface MintItemProps {
  data: Card;
  maxMintable: number;
  stockNum: number;
  description?: string;
}

export default function NFTMintItem({
  data,
  maxMintable,
  stockNum,
  description = "Boost your chances with this exclusive NFT card!",
}: MintItemProps) {
  const { data: appData, mintNFTs } = useContext(AppContext);

  const [nftToMint, setNftToMint] = useState<NFTCount>({
    name: data.cardName,
    count: 0,
  })
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCountChange = (cardName: string, cardCounts: number) => {
    setNftToMint({
      name: cardName,
      count: cardCounts,
    });
  };

  const handleMintClick = async () => {
    if (!appData.isWalletConnected) {
      toast.warning("Please connect your wallet to mint Cards.");
      return;
    }

    // Calculate total cost
    let totalCost =  nftToMint.count * parseFloat(data.cardPrice);
    const userBalance = parseFloat(appData.userBalance || "0");

    if (nftToMint.count === 0) {
      toast.warning("Please select at least one Card to mint.");
      return;
    }

    if (totalCost > userBalance) {
      toast.warning("Insufficient balance to mint these Cards.");
      return;
    }

    setIsLoading(true);

    const success = await mintNFTs(nftToMint);
    if (success) {
      toast.success(`${nftToMint.count} ${nftToMint.name.toLocaleUpperCase()} Card${nftToMint.count === 1 ? "" : "s"} has been minted successfully!`);
    } else {
      toast.error("Failed to mint NFTs!");
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full mx-auto p-4">
      <div className="bg-purple-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col sm:flex-row">
        {/* Image Container */}
        <div className="relative w-full sm:w-[200px] h-64 shrink-0">
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
            <p className="text-sm text-gray-300 line-clamp-4">{description}</p>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Controls - Bottom */}
          <div className="flex justify-between mt-2">
            <NumberCounter
              min={0}
              max={maxMintable}
              initialValue={0}
              onChange={(value: number) => handleCountChange(data.cardName, value)}
            />
            <button
              onClick={handleMintClick}
              disabled={isLoading}
              className="w-full max-w-xs px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-400 active:bg-red-600 disabled:bg-red-400 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? "Processing..." : "Mint"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}