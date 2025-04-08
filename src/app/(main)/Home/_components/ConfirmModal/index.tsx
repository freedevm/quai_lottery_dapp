// app/(main)/Home/_components/ConfirmModal/index.tsx
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AppContext } from "@/lib/providers/AppContextProvider";
import "./style.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  jackpotId?: string; // Add jackpotId to identify which jackpot the user is participating in
}

export default function ConfirmModal({ isOpen, onClose, jackpotId }: ModalProps) {
  const { data: appData, addParticipation } = useContext(AppContext);
  const { isWalletConnected, isNFTHolder } = appData;
  const router = useRouter();
  const [showNFTCheck, setShowNFTCheck] = useState(false);

  if (!isOpen) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (isNFTHolder) {
      setShowNFTCheck(false);
    } else {
      setShowNFTCheck(true);
    }
  }, [isNFTHolder]);

  const handlePlayNow = () => {
    if (!isWalletConnected) {
      toast.error("Please connect your wallet first!");
      return;
    }

    if (isNFTHolder) {
      // If user is an NFT holder, navigate to NFT page
      router.push("/NFTBoost");
    } else {
      // If user is not an NFT holder, show the NFT check options
      setShowNFTCheck(true);
    }
  };

  const handlePlayWithTicket = async () => {
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
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-purple-900 rounded-lg p-6 max-w-lg w-full mx-4">
        <div className="flex flex-col items-center">
          {showNFTCheck ? (
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
                  Play with just one ticket
                </button>
                <Link
                  href="/NFTMarketplace"
                  className="bg-purple-500 hover:bg-purple-400 px-4 py-2 rounded-lg text-white text-center"
                >
                  Go to buy NFTs
                </Link>
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
              <h2 className="text-2xl font-bold mb-4 text-white">Confirm Participation</h2>
              <p className="text-center mb-6 text-white">
                Are you ready to participate in this jackpot?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handlePlayNow}
                  className="bg-purple-500 hover:bg-purple-400 px-4 py-2 rounded-lg text-white"
                >
                  Play Now
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