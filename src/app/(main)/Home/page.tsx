"use client";

import { useEffect, useState } from "react";
import JackpotCard from "./_components/JackpotCard";
import ProgressiveJackpot from "./_components/ProgressiveJackpot";
// import Modal from "./_components/Modal";
import ConfirmModal from "./_components/ConfirmModal";

// Define interfaces
interface Address {
  address: string;
}

interface JackpotState {
  amount: number;
  targetAmount: number;
  isSpinning: boolean;
  winner: Address | null;
  isActive: boolean;
  isFirstCycle: boolean;
  participants: Address[];
}

interface Jackpots {
  small: JackpotState;
  medium: JackpotState;
  large: JackpotState;
  progressive: JackpotState;
}

export default function Page() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPotId, setSelectedPotId] = useState<String>("");
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const generateRandomAddress = (): string => {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    return (
      Array(4)
        .fill(0)
        .map(() =>
          Array(4)
            .fill(0)
            .map(() => chars[Math.floor(Math.random() * chars.length)])
            .join('')
        )
        .join('') +
      '...' +
      Array(4)
        .fill(0)
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join('')
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
      amount: 435.05,
      targetAmount: 1000,
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
        (['small', 'medium', 'large'] as const).forEach((key) => {
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
      [jackpotKey]: { ...prev[jackpotKey], isSpinning: true, winner: null, isActive: false },
    }));

    setTimeout(() => {
      setJackpots((prev) => {
        const newState = { ...prev };
        const currentJackpot = newState[jackpotKey];

        if (currentJackpot.amount >= currentJackpot.targetAmount) {
          const winner =
            currentJackpot.participants[Math.floor(Math.random() * currentJackpot.participants.length)];
          currentJackpot.winner = winner;

          if (jackpotKey !== 'progressive') {
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
              [jackpotKey]: { ...prev[jackpotKey], winner: null, isActive: true },
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

  const toggleConfirmModal = (id: String) => {
    setSelectedPotId(id);
    setShowConfirmModal(true);
  }

  const closeConfirmModal = () => {
    setShowConfirmModal(false)
  }

  return (
    <div className="h-full max-h-full overflow-y-auto p-3">
      {showConfirmModal && 
        <ConfirmModal isOpen={showConfirmModal} onClose={closeConfirmModal} />
      }
      <ProgressiveJackpot
        {...jackpots.progressive}
        onPlay={() => simulatePlay('progressive')}
        participants={jackpots.progressive.participants}
      />
      <div className="grid md:grid-cols-3 gap-6">
        <JackpotCard
          title={`${jackpots.small.targetAmount} ETH Jackpot`}
          {...jackpots.small}
          onPlay={() => toggleConfirmModal('small')}
          participants={jackpots.small.participants}
        />
        <JackpotCard
          title={`${jackpots.medium.targetAmount} ETH Jackpot`}
          {...jackpots.medium}
          onPlay={() => toggleConfirmModal('medium')}
          participants={jackpots.medium.participants}
        />
        <JackpotCard
          title={`${jackpots.large.targetAmount} ETH Jackpot`}
          {...jackpots.large}
          onPlay={() => toggleConfirmModal('large')}
          participants={jackpots.large.participants}
        />
      </div>
    </div>
  );
}