"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AppContext } from "@/lib/providers/AppContextProvider";
import "./style.scss";
import NFTBoostCard from "../NFTBoostCard";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  jackpotId?: number;
}

export default function NFTBoostModal({ isOpen, onClose, jackpotId }: ModalProps) {
  const { data: appData, addParticipation } = useContext(AppContext);
  const router = useRouter();
  const [isNFTBoostProcessing, setIsNFTBoostProcessing] = useState(false);
  const [boostCards, setBoostCards] = useState<{ id: number; count: number }[]>([]); // Track selected NFT IDs and counts
  const [userSeed, setUserSeed] = useState<number>(0);

  if (!isOpen) return null;
  
  useEffect(() => {
    const randomSeed = localStorage.getItem("seed");
    !!randomSeed && setUserSeed(JSON.parse(randomSeed));
    localStorage.removeItem("seed");
  })

  const handleNFTBoost = async () => {
    if (!jackpotId) {
      toast.error("Jackpot ID is missing!");
      return;
    }

    const totalCount = boostCards.reduce((sum, card) => sum + card.count, 0);
    console.log("### totalcount => ", totalCount)
    if (totalCount === 0) {
      toast.warning("You have to choose at least 1 card.");
      return;
    }

    if (!userSeed) {
      toast.error("Seed is missing!");
      return;
    }

    setIsNFTBoostProcessing(true);

    const boostCardsArr = boostCards.filter(item => item.count !== 0);

    const success = await addParticipation(jackpotId, userSeed, boostCardsArr);
    if (success) {
      toast.success("You have been added successfully!");
    } else {
      toast.error("Failed to play game!");
    }

    setIsNFTBoostProcessing(false);
    onClose();
  };

  const handlePurchaseNFT = () => {
    router.push("/NFTMint");
  };
  console.log("### seed => ", userSeed)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[110] overflow-y-auto">
      <div className="bg-purple-900 rounded-lg p-6 max-w-lg w-full mx-4">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-white uppercase">card boost</h2>
          <p className="text-center mb-6 text-white">
            Are you ready to boost your Cards in this jackpot?
          </p>

          <div className="mb-6 w-full">
            <div className="flex items-center mb-2 justify-end">
              <button
                onClick={handlePurchaseNFT}
                className="bg-purple-500 hover:bg-purple-400 active:bg-purple-600 px-2 rounded-lg text-white uppercase"
              >
                buy card(s)
              </button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-4">
              {appData.cards?.map((card, index) => (
                <NFTBoostCard
                  key={index}
                  index={index}
                  nftName={card.cardName}
                  userNFTs={appData.userNFTs}
                  boostCards={boostCards}
                  setBoostCards={setBoostCards}
                />
              ))}
            </div>
          </div>

          <div className="w-full flex flex-col gap-3">
            <button
              onClick={handleNFTBoost}
              disabled={isNFTBoostProcessing}
              className={`bg-purple-500 hover:bg-purple-400 active:bg-purple-600 px-4 py-2 rounded-lg text-white uppercase ${
                isNFTBoostProcessing ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isNFTBoostProcessing ? "processing..." : "yes, boost card(s)"}
            </button>
            <button
              onClick={onClose}
              className="bg-purple-500 hover:bg-purple-400 active:bg-purple-600 px-4 py-2 rounded-lg text-white uppercase"
            >
              cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}