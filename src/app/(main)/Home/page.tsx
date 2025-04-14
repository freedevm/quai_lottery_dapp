"use client";

import { useContext, useEffect, useState } from "react";
import JackpotCard from "./_components/JackpotCard";
import ProgressiveJackpot from "./_components/ProgressiveJackpot";
import ConfirmModal from "./_components/ConfirmModal";
import { AppContext } from "@/lib/providers/AppContextProvider";
import { Address, GameData, JackpotState, Jackpots } from "@/lib/types/lottery";
import NFTBoostModal from "./_components/NFTBoostModal";
import ImageCarousel from "../_components/ImageCarousel";

const getRandomImageIndexes = (countNumber: number) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const result = [];
  
  while (result.length < countNumber) {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      const selectedNumber = numbers.splice(randomIndex, 1)[0];
      result.push(selectedNumber);
  }
  
  return result;
}

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
  const [imageIndexes, setImageIndexes] = useState<number[]>([])

  useEffect(() => {
    setButtonDisabled(!isWalletConnected)
  }, [isWalletConnected])

  useEffect(() => {
    appData.games.length && setGames(appData.games);
  }, [appData])

  useEffect(() => {
    if (games.length) setImageIndexes(getRandomImageIndexes(games.length))
  }, [games])

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
            <div 
              className={`grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-${games.length > 4 ? 4 : games.length}`}
            >
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
                  imageIndexes={imageIndexes}
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