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

// Define the shape of an NFT
interface NFT {
  id: string;
  name: string;
  imageUrl: string;
}

interface ContextData {
  network: number | null;
  userAddress: string | null;
  userBalance: string | null;
  isWalletConnected: boolean;
  currentJackpot: string | null;
  userTickets: number;
  lotteryStatus: "active" | "closed" | "pending" | null;
  lastWinner: string | null;
  isNFTHolder: boolean;
  participatedJackpots: string[];
  userNFTCount: number;
  userNFTs: NFT[];
  boostedNFTs: { [jackpotId: string]: NFT[] }; // New: Store boosted NFTs per jackpot
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
  isNFTHolder: false,
  participatedJackpots: [],
  userNFTCount: 0,
  userNFTs: [],
  boostedNFTs: {}, // Initialize as empty object
};

export const AppContext = createContext<{
  data: ContextData;
  setData: (data: Partial<ContextData>) => void;
  setDataT: (value: SetStateAction<ContextData>) => void;
  addParticipation: (jackpotId: string) => Promise<boolean>;
  mintNFTs: (count: number) => Promise<boolean>;
  boostNFTs: (jackpotId: string, nfts: NFT[]) => Promise<boolean>; // New: Boost NFTs
}>({
  data: initialData,
  setData: () => {},
  setDataT: () => {},
  addParticipation: async () => false,
  mintNFTs: async () => false,
  boostNFTs: async () => false,
});

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [data, setDataT] = useState<ContextData>(initialData);
  const [firstLoad, setFirstLoad] = useState(true);
  const [loading, setLoading] = useState(true);

  const chainId = useChainId();
  const account = useAccount();
  const { data: balanceData } = useBalance({
    address: account.address,
  });

  const setData = (d: Partial<ContextData>) =>
    setDataT((prevData) => ({ ...prevData, ...d }));

  const addParticipation = async (jackpotId: string): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDataT((prev) => ({
        ...prev,
        userTickets: prev.userTickets + 1,
        participatedJackpots: [...prev.participatedJackpots, jackpotId],
      }));
      return true;
    } catch (error) {
      console.error("Failed to add participation:", error);
      return false;
    }
  };

  const mintNFTs = async (count: number): Promise<boolean> => {
    if (!account.isConnected) {
      console.error("Wallet not connected");
      return false;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const newNFTs: NFT[] = Array.from({ length: count }, (_, index) => ({
        id: `${data.userNFTCount + index + 1}`,
        name: `NFT #${data.userNFTCount + index + 1}`,
        imageUrl: `https://via.placeholder.com/150?text=NFT${data.userNFTCount + index + 1}`,
      }));

      setDataT((prev) => ({
        ...prev,
        userNFTCount: prev.userNFTCount + count,
        userNFTs: [...prev.userNFTs, ...newNFTs],
        isNFTHolder: true,
        userTickets: prev.userTickets + count * 2,
      }));
      return true;
    } catch (error) {
      console.error("Failed to mint NFTs:", error);
      return false;
    }
  };

  // New: Function to boost NFTs for a jackpot
  const boostNFTs = async (jackpotId: string, nfts: NFT[]): Promise<boolean> => {
    try {
      // Simulate boosting NFTs (replace with real smart contract call in production)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setDataT((prev) => ({
        ...prev,
        boostedNFTs: {
          ...prev.boostedNFTs,
          [jackpotId]: nfts, // Store the boosted NFTs for this jackpot
        },
      }));
      return true;
    } catch (error) {
      console.error("Failed to boost NFTs:", error);
      return false;
    }
  };

  useEffect(() => {
    if (data !== initialData) {
      localStorage.setItem("lottery-app-data", JSON.stringify(data));
    }
  }, [data]);

  useEffect(() => {
    const appDataJson = localStorage.getItem("lottery-app-data");
    if (appDataJson) {
      const appData = JSON.parse(appDataJson) as ContextData;
      setData(appData);
    }
  }, []);

  useEffect(() => {
    if (account.isConnected && account.address) {
      setData({
        network: chainId,
        userAddress: account.address,
        userBalance: balanceData?.formatted || "0",
        isWalletConnected: true,
        isNFTHolder: true,
      });
    } else {
      setData({
        network: null,
        userAddress: null,
        userBalance: null,
        isWalletConnected: false,
        isNFTHolder: false,
        participatedJackpots: [],
        userNFTCount: 0,
        userNFTs: [],
        boostedNFTs: {},
      });
    }
  }, [account.isConnected, account.address, chainId, balanceData, data.userNFTCount]);

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
        mintNFTs,
        boostNFTs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};