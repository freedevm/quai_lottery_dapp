"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AppContext } from "@/lib/providers/AppContextProvider";
import "./style.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  jackpotId?: string; // Add jackpotId to identify which jackpot the user is participating in
  setShowNFTBoostModal: (value: boolean) => void;
}

export default function ConfirmModal({ isOpen, onClose, jackpotId, setShowNFTBoostModal }: ModalProps) {
  const { data: appData, addParticipation } = useContext(AppContext);
  const { isWalletConnected, isNFTHolder } = appData;
  const router = useRouter();
  const [showNFTCheck, setShowNFTCheck] = useState(false);
  const [isPlayTicketProcessing, setIsPlayTicketProcessing] = useState(false)

  if (!isOpen) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (isNFTHolder) {
      setShowNFTCheck(false);
    } else {
      setShowNFTCheck(true);
    }
  }, [isNFTHolder]);

  const handleShowNFTBoostModal = () => {
    setShowNFTBoostModal(true);
    onClose();
  }

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
              <h2 className="text-2xl font-bold mb-4 text-white">Confirm Participation</h2>
              <p className="text-center mb-6 text-white">
                Are you ready to participate in this jackpot?
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handlePlayWithTicket}
                  className="bg-purple-500 hover:bg-purple-400 px-4 py-2 rounded-lg text-white"
                >
                  {isPlayTicketProcessing ? "Processing..." : "Play with Ticket"}
                </button>
                <button
                  onClick={handleShowNFTBoostModal}
                  className="bg-purple-500 hover:bg-purple-400 px-4 py-2 rounded-lg text-white"
                >
                  NFT Boost
                </button>
                <button
                  onClick={onClose}
                  className="bg-purple-500 hover:bg-purple-400 px-4 py-2 rounded-lg text-white"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4 text-white">Not an NFT Holder</h2>
              <p className="text-center mb-6 text-white">
                You are not an NFT holder. Would you like to play with a ticket or buy NFTs?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handlePlayWithTicket}
                  className="bg-purple-500 hover:bg-purple-400 px-4 py-2 rounded-lg text-white"
                >
                  {isPlayTicketProcessing ? "Processing..." : "Play with Ticket"}
                </button>
                <button
                  onClick={handlePurchaseNFT}
                  className="bg-purple-500 hover:bg-purple-400 px-4 py-2 rounded-lg text-white"
                >
                  Purchase NFT
                </button>
                <button
                  onClick={onClose}
                  className="bg-purple-500 hover:bg-purple-400 px-4 py-2 rounded-lg text-white"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}