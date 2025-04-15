"use client";

import { useContext, useEffect, useState } from "react";
import JackpotCard from "./_components/JackpotCard";
import ProgressiveJackpot from "./_components/ProgressiveJackpot";
import ConfirmModal from "./_components/ConfirmModal";
import { AppContext } from "@/lib/providers/AppContextProvider";
import { Address, GameData, JackpotState, Jackpots } from "@/lib/types/lottery";
import NFTBoostModal from "./_components/NFTBoostModal";
import ImageCarousel from "../_components/ImageCarousel";

export default function Page() {
  // Access wallet connection status from AppContext
  const { data: appData } = useContext(AppContext);
  console.log("### context data => ", appData)
  const isWalletConnected = appData.isWalletConnected;

  const [games, setGames] = useState<GameData[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showNFTBoostModal, setShowNFTBoostModal] = useState<boolean>(false);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [selectedPotId, setSelectedPotId] = useState<number>(0);

  useEffect(() => {
    setButtonDisabled(!isWalletConnected)
  }, [isWalletConnected])

  useEffect(() => {
    appData.games.length && setGames(appData.games);
  }, [appData])

  const toggleConfirmModal = (id: number) => {
    setSelectedPotId(id);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const closeNFTBoostModal = () => {
    setShowNFTBoostModal(false);
  }

  return (
    <div className="h-full max-h-full">
      {showConfirmModal && (
        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={closeConfirmModal}
          jackpotId={selectedPotId}
          setShowNFTBoostModal={setShowNFTBoostModal}
        />
      )}
      {showNFTBoostModal && (
        <NFTBoostModal
          isOpen={showNFTBoostModal}
          onClose={closeNFTBoostModal}
          jackpotId={selectedPotId}
        />
      )}

      {/* Image Carousel */}
      <ImageCarousel />

      {/* Progressive Jackpot Section */}
      <div className="p-3 sm:p-4 md:p-6">
        <ProgressiveJackpot
          // {...jackpots.progressive}
          amount={appData.megaJackpot}
          targetAmount={100}
          // winner={appData.lastWinner}
          // onPlay={() => simulatePlay("progressive")}
          participants={[]}
          disabled={buttonDisabled}
          isActive={false}
          isSpinning={false}
        />

        {/* Jackpot Cards Section */}
        {
          games.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {games.map((game) => (
                <JackpotCard
                  key={game.gameIndex}
                  title={`${game.jackpotSize} ETH Jackpot`}
                  jackpotId={game.gameIndex}
                  targetAmount={game.jackpotSize}
                  isActive={game.status === "started"}
                  amount={game.currentSize}
                  disabled={buttonDisabled}
                  isSpinning={false}
                  onPlay={() => toggleConfirmModal(game.gameIndex)}
                />
              ))}
            </div>
          ) : (
            <div className="w-full flex items-center justify-center">
              There are no active games yet
            </div>
          )
        }
      
      </div>
    </div>
  );
}