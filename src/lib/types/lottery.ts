// lib/types/lottery.ts
export interface Address {
    address: string;
  }
  
export interface JackpotState {
    amount: number | null;
    targetAmount: number;
    isSpinning: boolean;
    isActive: boolean;
}
  
export interface Jackpots {
    small: JackpotState;
    medium: JackpotState;
    large: JackpotState;
    progressive: JackpotState;
}

export interface NFT {
  id: string;
  name: string;
  imageUrl: string;
  boostValue: number;
  isLocked: boolean;
}

export interface GameData {
  gameIndex: number;
  jackpotSize: number;
  currentSize: number;
  status: "started" | "finished" | "calculating" | "rewarded";
  userTickets: number;
  players: number;
  prizePool?: {
    mainReward: string;
    randomTenReward: string;
  };
}

export interface Card {
  cardName: string;
  cardPrice: string;
  boostValue: number;
  supplyLimits: number;
}