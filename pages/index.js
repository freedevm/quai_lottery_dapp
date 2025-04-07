import { useState, useEffect } from 'react';
import Head from 'next/head';
import ProgressiveJackpot from '../src/components/ProgressiveJackpot';
import JackpotCard from '../src/components/JackpotCard';
import Modal from '../src/components/Modal';
import { WalletIcon, TrophyIcon, InfoIcon } from '../src/components/Icons';

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [nftCount, setNftCount] = useState(0); // Simulate NFT holdings

  const generateRandomAddress = () => {
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

  const generateParticipants = (count) =>
    Array(count)
      .fill(0)
      .map(() => ({ address: generateRandomAddress() }));

  const calculateBoostTickets = (nftCount) => {
    if (nftCount === 0) return 1;
    if (nftCount >= 10) return 30;
    const boost = Math.floor(Math.pow(nftCount, 1.5)); // Concave curve approximation
    return Math.min(boost + 1, 30); // +1 for base ticket
  };

  // Function to generate a random jackpot size between 1 ETH and 10 ETH
  const getRandomJackpotSize = () => {
    return Math.floor(Math.random() * 10) + 1; // Random integer between 1 and 10
  };

  // Function to generate a random starting amount between 0 and targetAmount
  const getRandomStartingAmount = (targetAmount) => {
    return Number((Math.random() * targetAmount).toFixed(2)); // Random value between 0 and targetAmount
  };

  const [jackpots, setJackpots] = useState({
    small: {
      amount: 0, // Will be set to a random value on client side
      targetAmount: 1, // Fixed initial value for SSR
      isSpinning: false,
      winner: null,
      isActive: true,
      isFirstCycle: true, // Track if this is the first cycle
      participants: [], // Initialize empty to avoid hydration issues
    },
    medium: {
      amount: 0, // Will be set to a random value on client side
      targetAmount: 1, // Fixed initial value for SSR
      isSpinning: false,
      winner: null,
      isActive: true,
      isFirstCycle: true, // Track if this is the first cycle
      participants: [],
    },
    large: {
      amount: 0, // Will be set to a random value on client side
      targetAmount: 1, // Fixed initial value for SSR
      isSpinning: false,
      winner: null,
      isActive: true,
      isFirstCycle: true, // Track if this is the first cycle
      participants: [],
    },
    progressive: {
      amount: 435.05, // Start at 435.05 ETH as requested
      targetAmount: 1000,
      isSpinning: false,
      winner: null,
      isActive: true,
      isFirstCycle: false, // Progressive jackpot doesn't need this
      participants: [],
    },
  });

  // Set random target amounts, participants, and random starting amounts on the client side only
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
          amount: getRandomStartingAmount(newSmallTarget), // Random starting amount for first cycle
          participants: generateParticipants(20),
        },
        medium: {
          ...prev.medium,
          targetAmount: newMediumTarget,
          amount: getRandomStartingAmount(newMediumTarget), // Random starting amount for first cycle
          participants: generateParticipants(20),
        },
        large: {
          ...prev.large,
          targetAmount: newLargeTarget,
          amount: getRandomStartingAmount(newLargeTarget), // Random starting amount for first cycle
          participants: generateParticipants(20),
        },
        progressive: {
          ...prev.progressive,
          participants: generateParticipants(20),
        },
      };
    });
  }, []); // Empty dependency array ensures this runs only once on the client

  useEffect(() => {
    const updateJackpots = () => {
      setJackpots((prev) => {
        const newState = { ...prev };
        ['small', 'medium', 'large'].forEach((key) => {
          if (!newState[key].isActive) return;
          const increment = 0.01; // Increment by 0.01 ETH
          const currentAmount = newState[key].amount;
          const targetAmount = newState[key].targetAmount;
          let newAmount = Math.min(currentAmount + increment, targetAmount);
          newAmount = Number(newAmount.toFixed(2));
          newState[key].amount = newAmount;

          if (newAmount >= targetAmount) {
            // Contribute 5% to the Mega Jackpot
            newState.progressive.amount = Math.min(
              newState.progressive.amount + targetAmount * 0.05,
              newState.progressive.targetAmount
            );

            // Reset amount to 0 and set a new random targetAmount
            newState[key].amount = 0; // Instant reset to 0
            newState[key].targetAmount = getRandomJackpotSize(); // Random size between 1 and 10 ETH
            newState[key].isFirstCycle = false; // Mark that the first cycle is complete
          }
        });
        return newState;
      });
    };

    const timer = setInterval(updateJackpots, 200); // Update every 200ms
    return () => clearInterval(timer);
  }, []);

  const simulatePlay = (jackpotKey) => {
    if (!walletConnected) {
      setShowModal(true);
      return;
    }

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
            currentJackpot.amount = 0; // Instant reset to 0
            // Set a new random targetAmount after a win
            currentJackpot.targetAmount = getRandomJackpotSize();
            currentJackpot.isFirstCycle = false; // Mark that the first cycle is complete
          } else {
            currentJackpot.amount = 0; // Reset progressive
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

  return (
    <>
      <Head>
        <title>Ethereum Multi-Jackpot | ETH Lottery with Multiple Prize Pools</title>
        <meta
          name="description"
          content="Play Ethereum Multi-Jackpot for a chance to win up to 1,000 ETH. Multiple prize pools including 1 ETH, 5 ETH, 10 ETH, and progressive mega jackpot."
        />
        <meta name="keywords" content="Ethereum lottery, ETH jackpot, crypto lottery, blockchain gambling" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#6B46C1" />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white">
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} />
        <header className="p-4 flex justify-between items-center">
          <div className="text-2xl font-bold">Ethereum Multi-Jackpot</div>
          <button
            onClick={() => setWalletConnected(!walletConnected)}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center text-white"
          >
            <WalletIcon className="mr-2" />
            <span>{walletConnected ? 'Connected' : 'Connect Wallet'}</span>
          </button>
        </header>
        <main className="container mx-auto px-4 py-8">
          <ProgressiveJackpot
            {...jackpots.progressive}
            onPlay={() => simulatePlay('progressive')}
            participants={jackpots.progressive.participants}
          />
          <div className="grid md:grid-cols-3 gap-6">
            <JackpotCard
              title={`${jackpots.small.targetAmount} ETH Jackpot`}
              {...jackpots.small}
              onPlay={() => simulatePlay('small')}
              participants={jackpots.small.participants}
            />
            <JackpotCard
              title={`${jackpots.medium.targetAmount} ETH Jackpot`}
              {...jackpots.medium}
              onPlay={() => simulatePlay('medium')}
              participants={jackpots.medium.participants}
            />
            <JackpotCard
              title={`${jackpots.large.targetAmount} ETH Jackpot`}
              {...jackpots.large}
              onPlay={() => simulatePlay('large')}
              participants={jackpots.large.participants}
            />
          </div>
          <div className="mt-8 text-center">
            <h2 className="text-xl font-bold">NFT Boost</h2>
            <p>Hold NFTs to boost your tickets: {calculateBoostTickets(nftCount)} tickets</p>
            <input
              type="number"
              min="0"
              max="10"
              value={nftCount}
              onChange={(e) => setNftCount(Math.min(parseInt(e.target.value) || 0, 10))}
              className="mt-2 p-2 rounded bg-purple-800 text-white"
            />
          </div>
        </main>
      </div>
    </>
  );
}