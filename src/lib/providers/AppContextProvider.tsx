"use client";

import {
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { useAccount, useChainId, useBalance, usePublicClient, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import PreLoading from "@/components/PreLoading";
import { NFT } from "@/lib/types/lottery";
import { ABI } from "../abi";
// import env from "@/lib/config/contract";

const LOTTERY_GAME_ADDRESS = "0xDdc8F2Ef961678C604be9AAda94E41E20E598337";
const NFT_CARD_ADDRESS = "0xcE710a9A71a9601Da9744b698FC6aa3A758Eae4C";
const SETTING_ADDRESS = "0xDe3c7F250C65AE302148A700d2506bb200f7959F";

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
  boostedNFTs: { [jackpotId: string]: NFT[] };
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
  boostedNFTs: {},
};

export const AppContext = createContext<{
  data: ContextData;
  setData: (data: Partial<ContextData>) => void;
  setDataT: (value: SetStateAction<ContextData>) => void;
  addParticipation: (jackpotId: string) => Promise<boolean>;
  mintNFTs: (nfts: { name: string; count: number }[]) => Promise<boolean>;
  boostNFTs: (jackpotId: string, nfts: NFT[]) => Promise<boolean>;
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
  const { data: balanceData } = useBalance({ address: account.address });
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const setData = (d: Partial<ContextData>) =>
    setDataT((prevData) => ({ ...prevData, ...d }));

  // Initialize contracts
  const getContracts = async () => {
    if (!walletClient || !publicClient) return null;

    const provider = new ethers.BrowserProvider(walletClient);
    const signer = await provider.getSigner();

    const lotteryContract = new ethers.Contract(LOTTERY_GAME_ADDRESS, ABI.lotteryGame, signer);
    const nftContract = new ethers.Contract(NFT_CARD_ADDRESS, ABI.lotteryGameNFTCard, signer);
    const settingContract = new ethers.Contract(SETTING_ADDRESS, ABI.lotterySetting, signer);

    return { lotteryContract, nftContract, settingContract };
  };

  const mintNFTs = async (nfts: { name: string; count: number }[]): Promise<boolean> => {
    if (!account.isConnected || !walletClient) {
      toast.error("Wallet not connected");
      return false;
    }

    try {
      const { nftContract } = await getContracts() || {};
      if (!nftContract) throw new Error("Contracts not initialized");

      // Map NFT names to card types based on contract
      const cardTypeMap: { [key: string]: { type: number; price: string } } = {
        diamond: { type: 0, price: "0.5" }, // Diamond: 0.5 ETH
        platinum: { type: 1, price: "0.4" }, // Platinum: 0.4 ETH
      };

      let newNFTs: NFT[] = [];
      let totalCount = 0;

      for (const { name, count } of nfts) {
        const card = cardTypeMap[name.toLowerCase()];
        if (!card) throw new Error(`Invalid NFT type: ${name}`);

        // Check total supply limit (max 5 per card type)
        const minted = await nftContract.mintedCounts(card.type);
        if (Number(minted) + count > 5) {
          throw new Error(`Exceeds total supply for ${name}`);
        }

        const totalPrice = ethers.parseEther(card.price) * BigInt(count);
        const tx = await nftContract.mint(account.address, card.type, count, {
          value: totalPrice,
        });
        await tx.wait();

        // Fetch URI for metadata
        const uri = await nftContract.uri(card.type);
        for (let i = 0; i < count; i++) {
          const nftId = `${card.type}-${totalCount + i + 1}`;
          newNFTs.push({
            id: nftId,
            name: name.toLowerCase(),
            imageUrl: uri.replace(".json", ".png"), // Adjust based on actual metadata
          });
        }
        totalCount += count;
      }

      setDataT((prev) => ({
        ...prev,
        userNFTCount: prev.userNFTCount + totalCount,
        userNFTs: [...prev.userNFTs, ...newNFTs],
        isNFTHolder: true,
        // Tickets not directly updated here; user must buy tickets separately
      }));

      toast.success("NFTs minted successfully!");
      return true;
    } catch (error: any) {
      console.error("Failed to mint NFTs:", error);
      toast.error(error.reason || "Failed to mint NFTs");
      return false;
    }
  };

  const addParticipation = async (jackpotId: string): Promise<boolean> => {
    if (!account.isConnected || !walletClient) {
      toast.error("Wallet not connected");
      return false;
    }

    try {
      const { lotteryContract, settingContract, nftContract } = await getContracts() || {};
      if (!lotteryContract || !settingContract || !nftContract) {
        throw new Error("Contracts not initialized");
      }

      const gameIndex = parseInt(jackpotId);
      const entryPrice = await settingContract.ENTRY_PRICE(); // 0.05 ETH
      const game = await lotteryContract.games(gameIndex);

      // Check game state (0 = Active, 1 = Finished, 2 = Pending, 3 = Rewarded)
      if (game.state !== 0) {
        toast.error("Game is not active");
        return false;
      }

      // Check if user already participated
      const tickets = await lotteryContract.getTickets(gameIndex, account.address);
      if (Number(tickets) > 0) {
        toast.error("You have already entered this game");
        return false;
      }

      // Handle NFT boosting
      let tokenIds: number[] = [];
      let counts: number[] = [];
      let ticketCount = 1; // Default for no NFTs

      if (data.boostedNFTs[jackpotId]?.length > 0) {
        tokenIds = data.boostedNFTs[jackpotId].map((nft) => parseInt(nft.id.split("-")[0]));
        counts = data.boostedNFTs[jackpotId].map(() => 1);

        // Verify unlocked NFTs
        const boost = await nftContract.getBoost(account.address, tokenIds, counts);
        ticketCount = Number(boost); // e.g., 60 for Diamond, 40 for Platinum
      }

      const userRandom = Math.floor(Math.random() * 1000000);
      const tx = await lotteryContract.buyTickets(gameIndex, tokenIds, counts, userRandom, {
        value: entryPrice,
      });
      await tx.wait();

      setDataT((prev) => ({
        ...prev,
        userTickets: ticketCount,
        participatedJackpots: [...prev.participatedJackpots, jackpotId],
      }));

      toast.success(`Purchased ${ticketCount} ticket(s) successfully!`);
      return true;
    } catch (error: any) {
      console.error("Failed to buy ticket:", error);
      toast.error(error.reason || "Failed to buy ticket");
      return false;
    }
  };

  const boostNFTs = async (jackpotId: string, nfts: NFT[]): Promise<boolean> => {
    if (!account.isConnected || !walletClient) {
      toast.error("Wallet not connected");
      return false;
    }

    try {
      // Boosting is handled via addParticipation; store NFTs in context
      setDataT((prev) => ({
        ...prev,
        boostedNFTs: {
          ...prev.boostedNFTs,
          [jackpotId]: nfts,
        },
      }));

      toast.success("NFTs selected for boosting!");
      return true;
    } catch (error: any) {
      console.error("Failed to boost NFTs:", error);
      toast.error(error.reason || "Failed to boost NFTs");
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
        isNFTHolder: data.userNFTCount > 0,
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
        const { lotteryContract } = await getContracts() || {};
        if (!lotteryContract) throw new Error("Contracts not initialized");

        // Fetch active games
        const activeGames = await lotteryContract.getActiveGameIndices();
        const latestGameIndex = activeGames.length > 0 ? activeGames[activeGames.length - 1] : 0;

        if (latestGameIndex > 0) {
          const gameData = await lotteryContract.games(latestGameIndex);
          const currentSize = ethers.formatEther(gameData.currentSize);
          const jackpotSize = ethers.formatEther(gameData.jackpotSize);
          const gameState = ["active", "finished", "pending", "rewarded"][gameData.state];

          // Fetch user tickets
          const userTickets = account.isConnected
            ? Number(await lotteryContract.getTickets(latestGameIndex, account.address))
            : 0;

          // Fetch last winner (placeholder; requires event parsing)
          const lastWinner = "0x0";

          const validGameState = ["active", "closed", "pending"].includes(gameState)
            ? gameState as "active" | "closed" | "pending"
            : null;

          setData({
            currentJackpot: jackpotSize,
            lotteryStatus: validGameState,
            lastWinner,
            userTickets,
          });
        }
      } catch (error: any) {
        toast.error("Failed to load lottery data!");
        console.error(error);
      }
    })();
  }, [firstLoad, account.isConnected]);

  useEffect(() => {
    (async function fetchNFTs() {
      if (!account.isConnected || !walletClient) return;

      try {
        const { nftContract } = await getContracts() || {};
        if (!nftContract) return;

        // Fetch user balances for all card types (0 and 1)
        const cardTypes = [0, 1];
        const balances = await nftContract.balanceOfBatch(
          cardTypes.map(() => account.address),
          cardTypes
        );

        let newNFTs: NFT[] = [];
        let totalCount = 0;

        for (let i = 0; i < cardTypes.length; i++) {
          const balance = Number(balances[i]);
          if (balance > 0) {
            const uri = await nftContract.uri(cardTypes[i]);
            const name = i === 0 ? "diamond" : "platinum";
            for (let j = 0; j < balance; j++) {
              newNFTs.push({
                id: `${cardTypes[i]}-${j + 1}`,
                name,
                imageUrl: uri.replace(".json", ".png"),
              });
            }
            totalCount += balance;
          }
        }

        setData({
          userNFTCount: totalCount,
          userNFTs: newNFTs,
          isNFTHolder: totalCount > 0,
        });
      } catch (error: any) {
        console.error("Failed to fetch NFTs:", error);
      }
    })();
  }, [account.isConnected, walletClient]);

  useEffect(() => {
    if (!account.isConnected) return;

    setData({ network: chainId });

    const supportedChains = [11155111, 1]; // Sepolia only for now
    if (!supportedChains.includes(chainId)) {
      toast.error("Please switch to Sepolia network.");
      if (walletClient) {
        try {
          walletClient.switchChain({ id: 11155111 });
        } catch (error) {
          console.error("Failed to switch network:", error);
        }
      }
    }
  }, [chainId, account.isConnected, walletClient]);

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