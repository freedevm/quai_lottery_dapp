// lib/providers/AppContextProvider.tsx
"use client";

import {
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { useAccount, useChainId, useBalance } from "wagmi";
import PreLoading from "@/components/PreLoading";

// Define the shape of the context data for the lottery app
interface ContextData {
  // Wallet-related data
  network: number | null;
  userAddress: string | null;
  userBalance: string | null;
  isWalletConnected: boolean;

  // Lottery-related data
  currentJackpot: string | null;
  userTickets: number;
  lotteryStatus: "active" | "closed" | "pending" | null;
  lastWinner: string | null;

  // New: NFT holder and participation tracking
  isNFTHolder: boolean;
  participatedJackpots: string[];
}

const initialData: ContextData = {
  network: null,
  userAddress: null,
  userBalance: null,
  isWalletConnected: false,
  currentJackpot: null,
  userTickets: 0,
  lotteryStatus: null,
  lastWinner: null,
  isNFTHolder: false, // Default: user is not an NFT holder
  participatedJackpots: [], // Default: user has not participated in any jackpots
};

// Create the context with initial values and types for the setter functions
export const AppContext = createContext<{
  data: ContextData;
  setData: (data: Partial<ContextData>) => void;
  setDataT: (value: SetStateAction<ContextData>) => void;
  addParticipation: (jackpotId: string) => Promise<boolean>; // New: Add participation
}>({
  data: initialData,
  setData: () => {},
  setDataT: () => {},
  addParticipation: async () => false,
});

// AppContextProvider component
export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [data, setDataT] = useState<ContextData>(initialData);
  const [firstLoad, setFirstLoad] = useState(true);
  const [loading, setLoading] = useState(true);

  // Wagmi hooks for wallet data
  const chainId = useChainId();
  const account = useAccount();
  const { data: balanceData } = useBalance({
    address: account.address,
  });

  // Helper to update context data partially
  const setData = (d: Partial<ContextData>) =>
    setDataT((prevData) => ({ ...prevData, ...d }));

  // Function to add participation to a jackpot
  const addParticipation = async (jackpotId: string): Promise<boolean> => {
    try {
      // Simulate an API call or smart contract interaction to add participation
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
  
      setDataT((prev) => ({
        ...prev,
        userTickets: prev.userTickets + 1, // Increment user tickets
        participatedJackpots: [...prev.participatedJackpots, jackpotId], // Add jackpot to participated list
      }));
      return true; // Success
    } catch (error) {
      console.error("Failed to add participation:", error);
      return false; // Failure
    }
  };

  // Persist context data to localStorage whenever it changes
  useEffect(() => {
    if (data !== initialData) {
      localStorage.setItem("lottery-app-data", JSON.stringify(data));
    }
  }, [data]);

  // Load persisted data from localStorage on mount
  useEffect(() => {
    const appDataJson = localStorage.getItem("lottery-app-data");
    if (appDataJson) {
      const appData = JSON.parse(appDataJson) as ContextData;
      setData(appData);
    }
  }, []);

  // Update wallet-related data when the account or chain changes
  useEffect(() => {
    if (account.isConnected && account.address) {
      setData({
        network: chainId,
        userAddress: account.address,
        userBalance: balanceData?.formatted || "0",
        isWalletConnected: true,
        // Simulate NFT holder check (replace with real check in production)
        isNFTHolder: false, // For testing, set to true; in production, query a smart contract
      });
    } else {
      setData({
        network: null,
        userAddress: null,
        userBalance: null,
        isWalletConnected: false,
        isNFTHolder: false,
        participatedJackpots: [],
      });
    }
  }, [account.isConnected, account.address, chainId, balanceData]);

  // Fetch lottery-related data on first load
  useEffect(() => {
    (async function init() {
      if (!firstLoad) return;
      setLoading(true);

      try {
        const mockJackpot = "10.5";
        const mockStatus = "active";
        const mockLastWinner = "0x123...abc";
        const mockUserTickets = account.isConnected ? 5 : 0;

        setData({
          currentJackpot: mockJackpot,
          lotteryStatus: mockStatus,
          lastWinner: mockLastWinner,
          userTickets: mockUserTickets,
        });
      } catch (error) {
        toast.error("Failed to load lottery data!");
        console.error(error);
      }
    })();
  }, [firstLoad, account.isConnected]);

  // Handle chain ID changes
  useEffect(() => {
    if (!account.isConnected) return;

    setData({ network: chainId });

    const supportedChains = [1, 11155111];
    if (!supportedChains.includes(chainId)) {
      toast.error("Please switch to a supported network (Ethereum Mainnet or Sepolia).");
    }
  }, [chainId, account.isConnected]);

  if (firstLoad && loading) {
    return (
      <PreLoading
        loading={firstLoad || loading}
        setLoading={setLoading}
        setFirstLoad={setFirstLoad}
      />
    );
  }

  return (
    <AppContext.Provider
      value={{
        data,
        setData,
        setDataT,
        addParticipation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};