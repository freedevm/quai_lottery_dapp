"use client";

import { useContext, useEffect, useState } from "react";
import JackpotCard from "./_components/JackpotCard";
import ProgressiveJackpot from "./_components/ProgressiveJackpot";
import ConfirmModal from "./_components/ConfirmModal";
import { AppContext } from "@/lib/providers/AppContextProvider";
import { Address, JackpotState, Jackpots } from "@/lib/types/lottery";
import NFTBoostModal from "./_components/NFTBoostModal";
import { setEngine } from "crypto";

export default function Page() {
  // Access wallet connection status from AppContext
  const { data: appData } = useContext(AppContext);
  const isWalletConnected = appData.isWalletConnected;

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showNFTBoostModal, setShowNFTBoostModal] = useState<boolean>(false);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [selectedPotId, setSelectedPotId] = useState<string>("");

  useEffect(() => {
    setButtonDisabled(!isWalletConnected)
  }, [isWalletConnected])

  const generateRandomAddress = (): string => {
    const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    return (
      Array(4)
        .fill(0)
        .map(() =>
          Array(4)
            .fill(0)
            .map(() => chars[Math.floor(Math.random() * chars.length)])
            .join("")
        )
        .join("") +
      "..." +
      Array(4)
        .fill(0)
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join("")
    );
  };

  const generateParticipants = (count: number): Address[] =>
    Array(count)
      .fill(0)
      .map(() => ({ address: generateRandomAddress() }));

  const getRandomJackpotSize = (): number => {
    return Math.floor(Math.random() * 10) + 1;
  };

  const getRandomStartingAmount = (targetAmount: number): number => {
    return Number((Math.random() * targetAmount).toFixed(2));
  };

  const [jackpots, setJackpots] = useState<Jackpots>({
    small: {
      amount: 0,
      targetAmount: 1,
      isSpinning: false,
      winner: null,
      isActive: true,
      isFirstCycle: true,
      participants: [],
    },
    medium: {
      amount: 0,
      targetAmount: 1,
      isSpinning: false,
      winner: null,
      isActive: true,
      isFirstCycle: true,
      participants: [],
    },
    large: {
      amount: 0,
      targetAmount: 1,
      isSpinning: false,
      winner: null,
      isActive: true,
      isFirstCycle: true,
      participants: [],
    },
    progressive: {
      amount: 43.05,
      targetAmount: 100,
      isSpinning: false,
      winner: null,
      isActive: true,
      isFirstCycle: false,
      participants: [],
    },
  });

  useEffect(() => {
    setJackpots((prev) => {
      const newSmallTarget = getRandomJackpotSize();
      const newMediumTarget = getRandomJackpotSize();
      const newLargeTarget = getRandomJackpotSize();

      return {
        ...prev,
        small: {
          ...prev.small,
          targetAmount: newSmallTarget,
          amount: getRandomStartingAmount(newSmallTarget),
          participants: generateParticipants(20),
        },
        medium: {
          ...prev.medium,
          targetAmount: newMediumTarget,
          amount: getRandomStartingAmount(newMediumTarget),
          participants: generateParticipants(20),
        },
        large: {
          ...prev.large,
          targetAmount: newLargeTarget,
          amount: getRandomStartingAmount(newLargeTarget),
          participants: generateParticipants(20),
        },
        progressive: {
          ...prev.progressive,
          participants: generateParticipants(20),
        },
      };
    });
  }, []);

  useEffect(() => {
    const updateJackpots = () => {
      setJackpots((prev) => {
        const newState = { ...prev };
        (["small", "medium", "large"] as const).forEach((key) => {
          if (!newState[key].isActive) return;
          const increment = 0.01;
          const currentAmount = newState[key].amount;
          const targetAmount = newState[key].targetAmount;
          let newAmount = Math.min(currentAmount + increment, targetAmount);
          newAmount = Number(newAmount.toFixed(2));
          newState[key].amount = newAmount;

          if (newAmount >= targetAmount) {
            newState.progressive.amount = Math.min(
              newState.progressive.amount + targetAmount * 0.05,
              newState.progressive.targetAmount
            );
            newState[key].amount = 0;
            newState[key].targetAmount = getRandomJackpotSize();
            newState[key].isFirstCycle = false;
          }
        });
        return newState;
      });
    };

    const timer = setInterval(updateJackpots, 200);
    return () => clearInterval(timer);
  }, []);

  const simulatePlay = (jackpotKey: keyof Jackpots) => {
    setJackpots((prev) => ({
      ...prev,
      [jackpotKey]: {
        ...prev[jackpotKey],
        isSpinning: true,
        winner: null,
        isActive: false,
      },
    }));

    setTimeout(() => {
      setJackpots((prev) => {
        const newState = { ...prev };
        const currentJackpot = newState[jackpotKey];

        if (currentJackpot.amount >= currentJackpot.targetAmount) {
          const winner =
            currentJackpot.participants[
              Math.floor(Math.random() * currentJackpot.participants.length)
            ];
          currentJackpot.winner = winner;

          if (jackpotKey !== "progressive") {
            newState.progressive.amount = Math.min(
              newState.progressive.amount + currentJackpot.targetAmount * 0.05,
              newState.progressive.targetAmount
            );
            currentJackpot.amount = 0;
            currentJackpot.targetAmount = getRandomJackpotSize();
            currentJackpot.isFirstCycle = false;
          } else {
            currentJackpot.amount = 0;
          }

          setTimeout(() => {
            setJackpots((prev) => ({
              ...prev,
              [jackpotKey]: {
                ...prev[jackpotKey],
                winner: null,
                isActive: true,
              },
            }));
          }, 3000);
        } else {
          currentJackpot.isActive = true;
        }
        currentJackpot.isSpinning = false;
        return newState;
      });
    }, 2000);
  };

  const toggleConfirmModal = (id: string) => {
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
    <div className="h-full max-h-full p-3 sm:p-4 md:p-6">
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
      <div className="space-y-6">
        {/* Progressive Jackpot Section */}
        <ProgressiveJackpot
          {...jackpots.progressive}
          onPlay={() => simulatePlay("progressive")}
          participants={jackpots.progressive.participants}
          disabled={buttonDisabled} // Disable if wallet is not connected
        />

        {/* Jackpot Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <JackpotCard
            title={`${jackpots.small.targetAmount} ETH Jackpot`}
            {...jackpots.small}
            onPlay={() => toggleConfirmModal("small")}
            participants={jackpots.small.participants}
            disabled={buttonDisabled}
            jackpotId="small"
          />
          <JackpotCard
            title={`${jackpots.medium.targetAmount} ETH Jackpot`}
            {...jackpots.medium}
            onPlay={() => toggleConfirmModal("medium")}
            participants={jackpots.medium.participants}
            disabled={buttonDisabled}
            jackpotId="medium"
          />
          <JackpotCard
            title={`${jackpots.large.targetAmount} ETH Jackpot`}
            {...jackpots.large}
            onPlay={() => toggleConfirmModal("large")}
            participants={jackpots.large.participants}
            disabled={buttonDisabled}
            jackpotId="large"
          />
        </div>
      </div>
    </div>
  );
}