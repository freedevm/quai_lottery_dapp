// lib/types/lottery.ts
export interface Address {
    address: string;
  }
  
export interface JackpotState {
    amount: number;
    targetAmount: number;
    isSpinning: boolean;
    winner: Address | null;
    isActive: boolean;
    isFirstCycle: boolean;
    participants: Address[];
}
  
export interface Jackpots {
    small: JackpotState;
    medium: JackpotState;
    large: JackpotState;
    progressive: JackpotState;
}