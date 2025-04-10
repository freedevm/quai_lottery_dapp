// app/(main)/Home/_components/NFTBoostModal/index.tsx
"use client";

import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AppContext } from "@/lib/providers/AppContextProvider";
import "./style.scss";
import Image from "next/image";
import NFTBoostCard from "../NFTBoostCard";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  jackpotId?: string;
}

const MockImages = [
  { id: "0001", name: "nft-01", imageUrl: "./assets/01.jpg" },
  { id: "0002", name: "nft-02", imageUrl: "./assets/02.jpg" },
  { id: "0003", name: "nft-03", imageUrl: "./assets/03.jpg" },
  { id: "0004", name: "nft-04", imageUrl: "./assets/01.jpg" },
  { id: "0005", name: "nft-05", imageUrl: "./assets/02.jpg" },
  { id: "0006", name: "nft-06", imageUrl: "./assets/03.jpg" },
  { id: "0007", name: "nft-07", imageUrl: "./assets/01.jpg" },
  { id: "0008", name: "nft-08", imageUrl: "./assets/02.jpg" },
  { id: "0009", name: "nft-09", imageUrl: "./assets/03.jpg" },
  { id: "0010", name: "nft-10", imageUrl: "./assets/01.jpg" },
  { id: "0011", name: "nft-11", imageUrl: "./assets/02.jpg" },
  { id: "0012", name: "nft-12", imageUrl: "./assets/03.jpg" },
  { id: "0013", name: "nft-13", imageUrl: "./assets/01.jpg" },
  { id: "0014", name: "nft-14", imageUrl: "./assets/02.jpg" },
];

export default function NFTBoostModal({ isOpen, onClose, jackpotId }: ModalProps) {
  const { data: appData, addParticipation, boostNFTs } = useContext(AppContext);
  const { isWalletConnected, isNFTHolder, userNFTs } = appData;
  const router = useRouter();
  const [showNFTCheck, setShowNFTCheck] = useState(false);
  const [isPlayTicketProcessing, setIsPlayTicketProcessing] = useState(false);
  const [isNFTBoostProcessing, setIsNFTBoostProcessing] = useState(false);
  const [selectedNFTs, setSelectedNFTs] = useState<string[]>([]); // Track selected NFT IDs

  // Use MockImages for now; switch to userNFTs when ready
  const nftsToDisplay = MockImages; // Replace with userNFTs when integrating with real data

  if (!isOpen) return null;

  // Derive selectAll state from selectedNFTs
  const isSelectAll = nftsToDisplay.length > 0 && selectedNFTs.length === nftsToDisplay.length;

  // Handle individual NFT selection
  const handleNFTSelect = (nftId: string) => {
    setSelectedNFTs((prev) =>
      prev.includes(nftId)
        ? prev.filter((id) => id !== nftId)
        : [...prev, nftId]
    );
  };

  // Handle "Select All" toggle
  const handleSelectAll = () => {
    if (isSelectAll) {
      setSelectedNFTs([]); // Deselect all
    } else {
      setSelectedNFTs(nftsToDisplay.map((nft) => nft.id)); // Select all
    }
  };

  const handleNFTBoost = async () => {
    if (!jackpotId) {
      toast.error("Jackpot ID is missing!");
      return;
    }

    if (selectedNFTs.length === 0) {
      toast.error("Please select at least one NFT to boost!");
      return;
    }

    setIsNFTBoostProcessing(true);
    const nftsToBoost = nftsToDisplay.filter((nft) => selectedNFTs.includes(nft.id));
    const success = await boostNFTs(jackpotId, nftsToBoost);

    if (success) {
      toast.success("NFTs boosted successfully!");
      router.push("/Home");
    } else {
      toast.error("Failed to boost NFTs!");
    }
    setIsNFTBoostProcessing(false);
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
            Are you ready to boost your NFTs in this jackpot?
          </p>

          {nftsToDisplay.length > 0 ? (
            <div className="mb-6 w-full">
              <div className="flex items-center mb-2 justify-end">
                <button
                  onClick={handlePurchaseNFT}
                  className="bg-purple-500 hover:bg-purple-400 px-2 rounded-lg text-white uppercase"
                >
                  purchase card
                </button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-4">
                <NFTBoostCard nftName="diamond" />
                <NFTBoostCard nftName="platinum" />
                <NFTBoostCard nftName="golden" />
                <NFTBoostCard nftName="silver" />
                <NFTBoostCard nftName="bronze" />
                <NFTBoostCard nftName="iron" />
              </div>
            </div>
          ) : (
            <p className="text-center mb-6 text-white">You don’t own any NFTs yet.</p>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={handleNFTBoost}
              disabled={isNFTBoostProcessing}
              className={`bg-purple-500 hover:bg-purple-400 px-4 py-2 rounded-lg text-white uppercase ${
                isNFTBoostProcessing ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isNFTBoostProcessing ? "processing..." : "yes, by card boost"}
            </button>
            <button
              onClick={handlePlayWithTicket}
              disabled={isPlayTicketProcessing}
              className={`bg-purple-500 hover:bg-purple-400 px-4 py-2 rounded-lg text-white uppercase ${
                isPlayTicketProcessing ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isPlayTicketProcessing ? "processing..." : "no, by ticket"}
            </button>
            <button
              onClick={onClose}
              className="bg-purple-500 hover:bg-purple-400 px-4 py-2 rounded-lg text-white uppercase"
            >
              cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}