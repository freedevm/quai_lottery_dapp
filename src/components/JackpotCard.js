import { useState, useEffect } from 'react';
import { TrophyIcon } from './Icons';

function CyclingAddresses({ addresses, isSpinning, winner }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isSpinning) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % addresses.length);
    }, 100);
    return () => clearInterval(interval);
  }, [isSpinning, addresses.length]);

  if (winner) return <div className="text-purple-300 text-sm mt-2">{winner.address}</div>;
  return (
    <div className="text-purple-300 text-sm mt-2 h-6">
      {isSpinning && addresses[currentIndex] ? addresses[currentIndex].address : ''}
    </div>
  );
}

export default function JackpotCard({ title, amount, targetAmount, isSpinning, winner, onPlay, participants }) {
  // State to manage the displayed amount for smooth animation
  const [displayedAmount, setDisplayedAmount] = useState(amount);
  const [previousAmount, setPreviousAmount] = useState(amount); // Track the previous amount to detect resets

  // Smoothly animate the displayed amount when the actual amount changes
  useEffect(() => {
    // If the amount has reset to 0 (e.g., after reaching targetAmount), instantly set displayedAmount to 0
    if (amount === 0 && previousAmount >= targetAmount) {
      setDisplayedAmount(0);
      setPreviousAmount(0);
      return;
    }

    // Otherwise, animate the amount smoothly
    if (Math.abs(displayedAmount - amount) < 0.01) {
      setDisplayedAmount(amount);
      setPreviousAmount(amount);
      return;
    }

    const increment = amount > displayedAmount ? 0.01 : -0.01;
    const interval = setInterval(() => {
      setDisplayedAmount((prev) => {
        const newAmount = prev + increment;
        // Stop when we reach the target amount
        if (
          (increment > 0 && newAmount >= amount) ||
          (increment < 0 && newAmount <= amount)
        ) {
          clearInterval(interval);
          return amount;
        }
        return Number(newAmount.toFixed(2));
      });
    }, 50); // Update every 50ms for smooth animation

    setPreviousAmount(amount);
    return () => clearInterval(interval);
  }, [amount, displayedAmount, previousAmount, targetAmount]);

  return (
    <div className="bg-purple-900/50 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <div className="text-4xl font-bold text-purple-400 mb-4">
        {displayedAmount.toLocaleString()} ETH
      </div>
      <div className="w-full h-2 bg-purple-900 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-purple-500 transition-all duration-300 ease-in-out"
          style={{ width: `${(displayedAmount / targetAmount) * 100}%` }}
        />
      </div>
      <CyclingAddresses addresses={participants} isSpinning={isSpinning} winner={winner} />
      {winner && (
        <div className="text-center mt-4 mb-4">
          <TrophyIcon />
          <div className="text-xl font-bold text-yellow-400">Winner!</div>
        </div>
      )}
      <button
        onClick={onPlay}
        className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg mt-4 text-white"
      >
        Play - 0.05 ETH
      </button>
    </div>
  );
}