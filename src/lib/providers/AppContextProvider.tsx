"use client";

import {
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { toast } from "react-toastify";
import { useAccount, useChainId, useBalance, usePublicClient, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import PreLoading from "@/components/PreLoading";
import { ABI } from "../abi";
import { Address, NFT, GameData, Card, NFTCount } from "../types/lottery";

interface ContractAddresses {
  lottery: string;
  nft: string;
  setting: string;
}

const CONTRACTS: ContractAddresses = {
  lottery: "0xC181C594EBC724A1Acc8EF711ff5921281ba461d",
  nft: "0xBd24551fcce10c059614A18a46eF4D3E4118F1BA",
  setting: "0xf95Ecbc1cBe909FF2F6ab50DA6897de83B3cB1d6",
};

const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY || "hra0WS7LQz4cQfdKoscbvfEFBDB54ELk";

interface ContextData {
  network: number | null;
  userAddress: string | null;
  userBalance: string | null;
  isWalletConnected: boolean;
  entryPrice: number | null;
  games: GameData[];
  megaJackpot: number | null;
  cards: Card[] | null;
  maxMintCount: number;
  lastWinners: { [gameIndex: number]: Address };
  lastWinner: Address | null;
  isNFTHolder: boolean;
  userNFTCount: number;
  userNFTs: number[];
  mintedCounts: number[];
  boostedNFTs: { [gameIndex: string]: NFT[] };
  participatedGames: number[];
  userTickets: number;
}

const initialData: ContextData = {
  network: null,
  userAddress: null,
  userBalance: null,
  isWalletConnected: false,
  entryPrice: null,
  games: [],
  megaJackpot: null,
  cards: [],
  maxMintCount: 0,
  lastWinners: {},
  lastWinner: null,
  isNFTHolder: false,
  userNFTCount: 0,
  userNFTs: [0, 0, 0, 0, 0, 0],
  mintedCounts: [0, 0, 0, 0, 0, 0],
  boostedNFTs: {},
  participatedGames: [],
  userTickets: 0,
};

export const AppContext = createContext<{
  data: ContextData;
  setData: (data: Partial<ContextData>) => void;
  setDataT: (value: SetStateAction<ContextData>) => void;
  addParticipation: (gameIndex: number, userSeed: number, boostCards?: { id: number; count: number }[]) => Promise<boolean>;
  mintNFTs: (nfts: NFTCount) => Promise<boolean>;
}>({
  data: initialData,
  setData: () => {},
  setDataT: () => {},
  addParticipation: async () => false,
  mintNFTs: async () => false,
});

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [data, setDataT] = useState<ContextData>(initialData);
  const [firstLoad, setFirstLoad] = useState(true);
  const [loading, setLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);

  const chainId = useChainId();
  const account = useAccount();
  const { data: balanceData } = useBalance({ address: account.address });
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const setData = useCallback((d: Partial<ContextData>) => {
    setDataT((prevData) => ({ ...prevData, ...d }));
  }, []);

  const getContracts = async () => {
    const walletConnected = !!walletClient;
    try {
      let signer;
      let publicProvider;

      if (walletConnected) {
        const provider = new ethers.BrowserProvider(walletClient);
        signer = await provider.getSigner();
      } else {
        publicProvider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`);
      }

      const lotteryContract = new ethers.Contract(
        CONTRACTS.lottery,
        ABI.lotteryGame,
        walletConnected && signer ? signer : publicProvider
      );

      const nftContract = new ethers.Contract(
        CONTRACTS.nft,
        ABI.lotteryGameNFTCard,
        walletConnected && signer ? signer : publicProvider
      );

      const settingContract = new ethers.Contract(
        CONTRACTS.setting,
        ABI.lotterySetting,
        walletConnected && signer ? signer : publicProvider
      );

      return { lotteryContract, nftContract, settingContract };
    } catch (error) {
      console.error("Failed to initialize contracts:", error);
      toast.error("Failed to connect to blockchain contracts");
      return null;
    }
  };

  const fetchAppData = useCallback(async (userAddress?: string): Promise<ContextData> => {
    try {
      const contracts = await getContracts();
      if (!contracts) throw new Error("Contracts not initialized");

      const { lotteryContract, nftContract, settingContract } = contracts;

      // Fetch wallet-independent data
      const entryPrice = parseFloat(ethers.formatEther(await settingContract.ENTRY_PRICE()));
      const megaJackpot = parseFloat(ethers.formatEther(await lotteryContract.megaJackpot()));
      const activeIndices = await lotteryContract.getActiveGameIndices();
      const maxMintCount = parseInt(await nftContract.MAX_MINT_COUNT());
      const numCardTypes = parseInt(await nftContract.NUM_CARD_TYPES());
      const cardNames = ["diamond", "platinum", "gold", "silver", "bronze", "iron"];

      // Batch fetch card data
      const cardPromises = Array.from({ length: numCardTypes }, async (_, i) => {
        const [cardPrice, boostValue, supplyLimits, mintedCount] = await Promise.all([
          nftContract.cardPrices(i).then(ethers.formatEther),
          nftContract.boostValues(i).then((v: any) => parseInt(v)),
          nftContract.totalSupplyLimits(i).then((v: any) => parseInt(v)),
          nftContract.mintedCounts(i).then((v: any) => parseInt(v)),
        ]);
        return {
          cardName: cardNames[i],
          cardPrice,
          boostValue,
          supplyLimits,
          mintedCount,
        };
      });

      const cards: Card[] = await Promise.all(cardPromises);
      const mintedCounts = cards.map((card) => card.mintedCount);

      // Fetch game data
      const gamePromises = activeIndices.map(async (index: number) => {
        const game = await lotteryContract.games(index);
        const mainRewardPercent = Number(await settingContract.MAIN_REWARD_PERCENT()) / 10000;
        const randomTenPercent = Number(await settingContract.RANDOM_TEN_REWARD_PERCENT()) / 10000;
        const currentSize = ethers.formatEther(game.currentSize);
        const jackpotSize = ethers.formatEther(game.jackpotSize);
        let userTickets = 0;
        let isParticipated = false;

        if (userAddress) {
          userTickets = Number(await lotteryContract.getTickets(index, userAddress));
          isParticipated = userTickets > 0;
        }

        return {
          gameIndex: Number(index),
          jackpotSize,
          currentSize,
          isParticipated,
          status: ["started", "finished", "calculating", "rewarded"][game.state] as GameData["status"],
          userTickets,
          players: new Set(game.players).size,
          prizePool: {
            mainReward: (Number(currentSize) * mainRewardPercent).toFixed(4),
            randomTenReward: (Number(currentSize) * randomTenPercent).toFixed(4),
          },
        };
      });

      const games: GameData[] = await Promise.all(gamePromises);

      // Fetch wallet-dependent data (only if userAddress is provided)
      let userNFTs = [0, 0, 0, 0, 0, 0];
      let userNFTCount = 0;
      let isNFTHolder = false;
      let participatedGames: number[] = [];
      let isWalletConnected = false;

      if (userAddress) {
        isWalletConnected = true;
        const { totalBalances } = await nftContract.getUserBalances(userAddress);
        userNFTs = totalBalances.map((balance: string) => parseInt(balance));
        userNFTCount = userNFTs.reduce((sum, count) => sum + count, 0);
        isNFTHolder = userNFTCount > 0;
        participatedGames = games.filter((game) => game.isParticipated).map((game) => game.gameIndex);
      }

      // Return complete ContextData object
      return {
        network: chainId, // Set by wallet connection useEffect
        userAddress: null, // Set by wallet connection useEffect
        userBalance: null, // Set by wallet connection useEffect
        isWalletConnected, // Set by wallet connection useEffect
        entryPrice,
        games,
        megaJackpot,
        cards,
        maxMintCount,
        lastWinners: {}, // Not fetched; use default
        lastWinner: null, // Not fetched; use default
        isNFTHolder,
        userNFTCount,
        userNFTs,
        mintedCounts,
        boostedNFTs: {}, // Not fetched; use default
        participatedGames,
        userTickets: 0, // Aggregate userTickets not implemented; use default
      };
    } catch (error: any) {
      console.error("Failed to fetch app data:", error);
      toast.error("Failed to load lottery data");
      throw error;
    }
  }, []);

  const mintNFTs = async (nftCounts: NFTCount): Promise<boolean> => {
    if (!account.isConnected || !walletClient) {
      toast.error("Wallet not connected");
      return false;
    }

    try {
      const { nftContract } = await getContracts() || {};
      if (!nftContract) throw new Error("Contracts not initialized");

      const cardNames = ["diamond", "platinum", "gold", "silver", "bronze", "iron"];
      const cardIndex = cardNames.indexOf(nftCounts.name);

      if (cardIndex === -1) throw new Error(`Invalid card type: ${nftCounts.name}`);
      const maxMintCount = parseInt(await nftContract.MAX_MINT_COUNT());
      const cardPrice = ethers.formatEther(await nftContract.cardPrices(cardIndex));
      const mintedCount = parseInt(await nftContract.mintedCounts(cardIndex));
      const supplyLimits = parseInt(await nftContract.totalSupplyLimits(cardIndex));

      if (nftCounts.count > maxMintCount) throw new Error(`Max ${maxMintCount} cards per mint`);
      if (mintedCount + nftCounts.count > supplyLimits) {
        throw new Error(`Exceeds supply limit for ${nftCounts.name}`);
      }

      const totalPrice = parseFloat(cardPrice) * nftCounts.count;
      const tx = await nftContract.mint(account.address, cardIndex, nftCounts.count, {
        value: ethers.parseEther(totalPrice.toString()),
      });
      await tx.wait();

      // Refresh wallet-dependent data
      const newData = await fetchAppData(account.address);
      setDataT(newData);

      return true;
    } catch (error: any) {
      console.error("Failed to mint NFTs:", error);
      if (error.code === "INSUFFICIENT_FUNDS") {
        toast.error("Insufficient funds to mint NFTs");
      } else if (error.reason) {
        toast.error(`Minting failed: ${error.reason}`);
      } else {
        toast.error("Failed to mint NFTs");
      }
      return false;
    }
  };

  const addParticipation = async (
    gameIndex: number,
    userSeed: number,
    boostCards?: { id: number; count: number }[]
  ): Promise<boolean> => {
    if (!account.isConnected || !walletClient) {
      toast.error("Wallet not connected");
      return false;
    }

    try {
      const { lotteryContract, settingContract } = await getContracts() || {};
      if (!lotteryContract || !settingContract) throw new Error("Contracts not initialized");

      const game = await lotteryContract.games(gameIndex);
      if (parseInt(game.state) !== 0) {
        toast.error("Game is not active");
        return false;
      }

      const entryPrice = await settingContract.ENTRY_PRICE();
      let tokenIds: number[] = [];
      let counts: number[] = [];
      let ticketCount = 1;

      if (boostCards && boostCards.length > 0) {
        tokenIds = boostCards.map((card) => card.id);
        counts = boostCards.map((card) => card.count);
        ticketCount = boostCards.reduce((sum, card) => sum + card.count, 1);
      }

      const tx = await lotteryContract.buyTickets(gameIndex, tokenIds, counts, userSeed, {
        value: entryPrice,
      });
      await tx.wait();

      // Refresh wallet-dependent data
      const newData = await fetchAppData(account.address);
      setDataT(newData);

      return true;
    } catch (error: any) {
      console.error("Failed to buy ticket:", error);
      if (error.code === "INSUFFICIENT_FUNDS") {
        toast.error("Insufficient funds to buy tickets");
      } else if (error.reason) {
        toast.error(`Ticket purchase failed: ${error.reason}`);
      } else {
        toast.error("Failed to buy tickets");
      }
      return false;
    }
  };

  // Initialize data on first load
  useEffect(() => {
    if (!firstLoad) return;
    (async () => {
      setLoading(true);
      try {
        const newData = await fetchAppData();
        setDataT(newData);
      } finally {
        setDataFetched(true);
      }
    })();
  }, [firstLoad, fetchAppData]);

  // Handle wallet connection changes
  useEffect(() => {
    if (account.isConnected && account.address) {
      // Wallet connected: Fetch wallet-dependent data
      (async () => {
        try {
          const newData = await fetchAppData(account.address);
          setDataT({
            ...newData,
            network: chainId,
            userAddress: account.address ?? null, // Normalize undefined to null
            userBalance: balanceData?.formatted || "0",
            isWalletConnected: true,
          });
        } catch (error) {
          console.error("Failed to fetch wallet data:", error);
        }
      })();
    } else {
      (async () => {
        try {
          const newData = await fetchAppData();
          setDataT({
            ...newData,
            network: null,
            userAddress: null, // Normalize undefined to null
            userBalance: null,
            isWalletConnected: false,
          });
        } catch (error) {
          console.error("Failed to fetch game data:", error);
        }
      })();
      // Clear wallet-dependent data from localStorage
      localStorage.setItem(
        "lottery-app-data",
        JSON.stringify({
          ...data,
          network: null,
          userAddress: null,
          userBalance: null,
          isWalletConnected: false,
          userNFTCount: 0,
          userNFTs: [0, 0, 0, 0, 0, 0],
          isNFTHolder: false,
          participatedGames: [],
          userTickets: 0,
          lastWinners: {},
          lastWinner: null,
          boostedNFTs: {},
        })
      );
    }
  }, [account.isConnected, account.address, chainId, balanceData, fetchAppData]);

  // Persist data to localStorage (excluding sensitive wallet data)
  useEffect(() => {
    localStorage.setItem(
      "lottery-app-data",
      JSON.stringify({
        ...data,
        network: null,
        userAddress: null,
        userBalance: null,
        isWalletConnected: false,
        userNFTCount: 0,
        userNFTs: [0, 0, 0, 0, 0, 0],
        isNFTHolder: false,
        participatedGames: [],
        userTickets: 0,
        lastWinners: {},
        lastWinner: null,
        boostedNFTs: {},
      })
    );
  }, [data]);

  if (firstLoad && loading) {
    return (
      <PreLoading
        loading={firstLoad || loading}
        setLoading={setLoading}
        setFirstLoad={setFirstLoad}
        dataFetched={dataFetched}
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};