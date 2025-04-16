"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AppContext } from "@/lib/providers/AppContextProvider";
import "./style.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  jackpotId?: number; // Add jackpotId to identify which jackpot the user is participating in
  userSeed: number;
  randomSeedGenerator: () => void;
  setShowNFTBoostModal: (value: boolean) => void;
}

export default function ConfirmModal({ isOpen, onClose, jackpotId, userSeed, randomSeedGenerator, setShowNFTBoostModal }: ModalProps) {
  const { data: appData, addParticipation } = useContext(AppContext);
  const { isNFTHolder } = appData;
  const router = useRouter();
  const [isPlayTicketProcessing, setIsPlayTicketProcessing] = useState<boolean>(false)

  if (!isOpen) return null;

  const handleShowNFTBoostModal = () => {
    if (!userSeed) {
      toast.warning("You have to generate your seed");
      return;
    }
    
    setShowNFTBoostModal(true);
    onClose();
  }

  const handlePlayWithTicket = async () => {
    if (!userSeed) {
      toast.warning("You have to generate your seed");
      return;
    }

    setIsPlayTicketProcessing(true);
    if (!jackpotId) {
      toast.error("Jackpot ID is missing!");
      return;
    }

    const success = await addParticipation(jackpotId, userSeed);
    if (success) {
      toast.success("You have been added in this game successfully!");
    } else {
      toast.error("Failed to play game!");
    }
    onClose(); // Close the modal after attempting to add participation
    setIsPlayTicketProcessing(false);
  };

  const handlePurchaseNFT = () => {
    router.push("/NFTMint");
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-purple-900 rounded-lg p-6 max-w-lg w-full mx-4">
        <div className="flex flex-col items-center">
          {isNFTHolder ? (
            <>
              <h2 className="text-2xl font-bold mb-4 text-white uppercase">Confirm Participation</h2>
              <p className="text-center mb-6 text-white">
                Are you ready to participate in this jackpot?
              </p>
              <div className="w-full sm:w-[90%] h-8 justify-center items-center flex flex-row mb-3 border border-purple-900 rounded-lg overflow-hidden">
                <p
                  className="bg-purple-300 w-[60%] border-none cursor-not-allowed h-full text-center content-center"
                >{!!userSeed ? userSeed : "Generate your seed..." }</p>
                <button
                  onClick={randomSeedGenerator}
                  className="w-[40%] bg-purple-500 hover:bg-purple-400 active:bg-purple-600 px-4 py-1 text-white"
                >
                  Generate
                </button>
              </div>
              <div className="w-full justify-center flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleShowNFTBoostModal}
                  className="bg-purple-500 hover:bg-purple-400 active:bg-purple-600 px-4 py-2 rounded-lg text-white uppercase"
                >
                  boost card(s)
                </button>
                <button
                  onClick={handlePlayWithTicket}
                  className="bg-purple-500 hover:bg-purple-400 active:bg-purple-600 px-4 py-2 rounded-lg text-white uppercase"
                >
                  {isPlayTicketProcessing ? "processing..." : "buy one ticket"}
                </button>
                <button
                  onClick={onClose}
                  className="bg-purple-500 hover:bg-purple-400 active:bg-purple-600 px-4 py-2 rounded-lg text-white uppercase"
                >
                  cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4 text-white">Not an NFT Holder</h2>
              <p className="text-center mb-6 text-white">
                You are not an NFT holder. Would you like to play with a ticket or buy NFTs?
              </p>
              <div className="w-full sm:w-[90%] h-8 justify-center items-center flex flex-row mb-3 border border-purple-900 rounded-lg overflow-hidden">
                <p
                  className="bg-purple-300 w-[60%] border-none cursor-not-allowed h-full text-center content-center"
                >{!!userSeed ? userSeed : "Generate your seed..." }</p>
                <button
                  onClick={randomSeedGenerator}
                  className="w-[40%] bg-purple-500 hover:bg-purple-400 active:bg-purple-600 px-4 py-1 text-white"
                >
                  Generate
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handlePurchaseNFT}
                  className="bg-purple-500 hover:bg-purple-400 active:bg-purple-600 px-4 py-2 rounded-lg text-white uppercase"
                >
                  buy card(s)
                </button>
                <button
                  onClick={handlePlayWithTicket}
                  className="bg-purple-500 hover:bg-purple-400 active:bg-purple-600 px-4 py-2 rounded-lg text-white uppercase"
                >
                  {isPlayTicketProcessing ? "Processing..." : "buy one ticket"}
                </button>
                <button
                  onClick={onClose}
                  className="bg-purple-500 hover:bg-purple-400 active:bg-purple-600 px-4 py-2 rounded-lg text-white uppercase"
                >
                  cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}