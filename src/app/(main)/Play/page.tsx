"use client";

import { useContext, useEffect, useState } from "react";
import JackpotCard from "./_components/JackpotCard";
import ProgressiveJackpot from "./_components/ProgressiveJackpot";
import ConfirmModal from "./_components/ConfirmModal";
import { AppContext } from "@/lib/providers/AppContextProvider";
import { GameData } from "@/lib/types/lottery";
import NFTBoostModal from "./_components/NFTBoostModal";
import ImageCarousel from "../_components/ImageCarousel";
import InvesterListModal from "./_components/InvesterListModal";
import { toast } from "react-toastify";

export default function Page() {
  // Access wallet connection status from AppContext
  const { data: appData } = useContext(AppContext);
  const isWalletConnected = appData.isWalletConnected;

  const [games, setGames] = useState<GameData[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showNFTBoostModal, setShowNFTBoostModal] = useState<boolean>(false);
  const [showInvesterListModal, setShowInvesterListModal] = useState<boolean>(false);
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
    setGames(appData.games);
  }, [appData])

  const toggleConfirmModal = (id: number) => {
    !isWalletConnected && toast.warning("Please connect your wallet to play")
    isWalletConnected && setSelectedPotId(id);
    isWalletConnected && setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setUserSeed(0);
    setShowConfirmModal(false);
  };

  const closeNFTBoostModal = () => {
    setUserSeed(0);
    setShowNFTBoostModal(false);
  }

  const closeInvesterListModal = () => {
    setShowInvesterListModal(false);
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
      {showInvesterListModal && (
        <InvesterListModal
          isOpen={showInvesterListModal}
          onClose={closeInvesterListModal}
        />
      )}

      {/* Image Carousel */}
      <ImageCarousel />

      {/* Progressive Jackpot Section */}
      <div className="p-3 sm:p-4 md:p-6">   
        <ProgressiveJackpot
          amount={appData.megaJackpot}
          targetAmount={1000000}
          disabled={buttonDisabled}
          isActive={false}
          isParticipated={false}
          isSpinning={false}
        />

        {/* Jackpot Cards Section */}
        {
          appData.activeGames.length > 0 ? (
            <>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold my-3 sm:my-5 text-white uppercase text-center">active jackpots</h1>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                {appData.activeGames.map((id, index) => (
                  (games[index]?.status !== "rewarded" || !games[index]) && 
                  <JackpotCard
                    key={id}
                    title={`Jackpot ${id} ${games[index]?.jackpotSize ? `- ${games[index].jackpotSize} QUAI` : ""}`}
                    jackpotId={id}
                    targetAmount={games[index]?.jackpotSize}
                    isActive={games[index]?.status && games[index].status === "started"}
                    isParticipated={games[index]?.isParticipated}
                    userTickets={games[index]?.userTickets}
                    totalTicketCount={games[index]?.totalTicketCount}
                    amount={games[index]?.currentSize}
                    status={games[index]?.status}
                    disabled={buttonDisabled}
                    isSpinning={false}
                    onPlay={() => toggleConfirmModal(id)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-center">
              There are no Active Games yet
            </div>
          )
        }
      </div>
    </div>
  );
}