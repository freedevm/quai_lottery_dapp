"use client";

import React, { useContext, useState } from "react";
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
  const { data: appData, addParticipation, boostNFTs } = useContext(AppContext);
  const router = useRouter();
  const [isPlayTicketProcessing, setIsPlayTicketProcessing] = useState(false);
  const [isNFTBoostProcessing, setIsNFTBoostProcessing] = useState(false);
  const [selectedNFTs, setSelectedNFTs] = useState<{ id: string; count: number }[]>([]); // Track selected NFT IDs and counts

  if (!isOpen) return null;

  const handleNFTBoost = async () => {
    if (!jackpotId) {
      toast.error("Jackpot ID is missing!");
      return;
    }

    if (selectedNFTs.length === 0 || selectedNFTs.every((nft) => nft.count === 0)) {
      toast.error("Please select at least one Card to boost!");
      return;
    }

    setIsNFTBoostProcessing(true);
    // Map selectedNFTs to the format expected by boostNFTs
    // const nftsToBoost = selectedNFTs
    //   .filter((nft) => nft.count > 0)
    //   .map((nft) => ({
    //     id: nft.id,
    //     name: appData.userNFTs.find((userNFT) => userNFT.id === nft.id)?.name || "",
    //     imageUrl: appData.userNFTs.find((userNFT) => userNFT.id === nft.id)?.imageUrl || "",
    //     count: nft.count,
    //   }));

    // const success = await boostNFTs(jackpotId, nftsToBoost);
    // if (success) {
    //   toast.success("Card(s) boosted successfully!");
    // } else {
    //   toast.error("Failed to boost Card(s)!");
    // }
    setIsNFTBoostProcessing(false);
    onClose();
  };

  const handlePlayWithTicket = async () => {
    setIsPlayTicketProcessing(true);
    if (!jackpotId) {
      toast.error("Jackpot ID is missing!");
      return;
    }

    const success = await addParticipation(jackpotId);
    if (success) {
      toast.success("Added successfully!");
    } else {
      toast.error("Failed to add participation!");
    }
    onClose();
    setIsPlayTicketProcessing(false);
  };

  const handlePurchaseNFT = () => {
    router.push("/NFTMint");
  };

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
                  setSelectedNFTs={setSelectedNFTs}
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
              onClick={handlePlayWithTicket}
              disabled={isPlayTicketProcessing}
              className={`bg-purple-500 hover:bg-purple-400 active:bg-purple-600 px-4 py-2 rounded-lg text-white uppercase ${
                isPlayTicketProcessing ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isPlayTicketProcessing ? "processing..." : "no, buy one ticket"}
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