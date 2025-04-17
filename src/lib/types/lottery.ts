// lib/types/lottery.ts
export interface Address {
    address: string;
  }
  
export interface JackpotState {
    amount: number | null;
    targetAmount: number;
    isSpinning: boolean;
    isActive: boolean;
    isParticipated: boolean;
}
  
export interface Jackpots {
    small: JackpotState;
    medium: JackpotState;
    large: JackpotState;
    progressive: JackpotState;
}

export interface NFT {
  name: string;
  boostValue: number;
}

export interface GameData {
  gameIndex: number;
  jackpotSize: number;
  currentSize: number;
  isParticipated: boolean;
  totalTicketCount: number;
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
  mintedCount: number;
}

export interface NFTCount {
  name: string;
  count: number;
}