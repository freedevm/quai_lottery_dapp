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
  const isWalletConnected = appData.isWalletConnected;

  const [games, setGames] = useState<GameData[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showNFTBoostModal, setShowNFTBoostModal] = useState<boolean>(false);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [selectedPotId, setSelectedPotId] = useState<number>(0);
  const [userSeed, setUserSeed] = useState<number>(0)

  const randomSeedGenerator = () => {
    const seed = Math.floor(Math.random() * 1000000);
    if (!!seed) {
      localStorage.setItem("seed", JSON.stringify(seed));
      setUserSeed(seed);
    } else randomSeedGenerator();
  }

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
    setUserSeed(0);
    setShowConfirmModal(false);
  };

  const closeNFTBoostModal = () => {
    setUserSeed(0);
    setShowNFTBoostModal(false);
  }

  return (
    <div className="h-full max-h-full">
      {showConfirmModal && (
        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={closeConfirmModal}
          jackpotId={selectedPotId}
          userSeed={userSeed}
          randomSeedGenerator={randomSeedGenerator}
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
          amount={appData.megaJackpot}
          targetAmount={100}
          participants={[]}
          disabled={buttonDisabled}
          isActive={false}
          isParticipated={false}
          isSpinning={false}
        />

        {/* Jackpot Cards Section */}
        {
          games.length > 0 ? (
            <>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold my-3 sm:my-5 text-white uppercase text-center">active jackpots</h1>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                {games.map((game) => (
                  game.status !== "rewarded" && <JackpotCard
                    key={game.gameIndex}
                    title={`Jackpot ${game.gameIndex} - ${game.jackpotSize} ETH`}
                    jackpotId={game.gameIndex}
                    targetAmount={game.jackpotSize}
                    isActive={game.status === "started"}
                    isParticipated={game.isParticipated}
                    userTickets={game.userTickets}
                    amount={game.currentSize}
                    status={game.status}
                    disabled={buttonDisabled}
                    isSpinning={false}
                    onPlay={() => toggleConfirmModal(game.gameIndex)}
                  />
                ))}
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold my-3 sm:my-5 text-white uppercase text-center">ended jackpots</h1>
                
            </>
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