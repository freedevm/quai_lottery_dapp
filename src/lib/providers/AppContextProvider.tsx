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
import { useAccount, useChainId, useBalance, useWalletClient } from "wagmi";
import { ethers, Contract, BrowserProvider } from "ethers";
import PreLoading from "@/components/PreLoading";
import { ABI } from "../abi";
import { Address, NFT, GameData, Card, NFTCount } from "../types/lottery";

// Define chain ID
const CHAIN_ID: number = 1;

// Define contract addresses
interface ContractAddresses {
  lottery: string;
  nft: string;
  setting: string;
}

const CONTRACTS: ContractAddresses = {
  lottery: process.env.LOTTERY_GAME_ADDRESS || "0x90Bf9a12a8456d038Cf22E51536D6D7d624D6732",
  nft: process.env.LOTTERY_GAME_NFT_CARD_ADDRESS || "0xFA93dBa2A2F10dE8b77ccB452943Fcb2EF3794C8",
  setting: process.env.LOTTERY_GAME_SETTING_ADDRESS || "0x4AbCc0D1DdE8ad398a36907113cdfe08B470FFf9",
};

// Interface for ContextData
interface ContextData {
  network: number | null;
  userAddress: string | null;
  userBalance: string | null;
  isWalletConnected: boolean;
  entryPrice: number | null;
  investors: Address[];
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
  totalInvestorTicketCount: number;
}

const initialData: ContextData = {
  network: null,
  userAddress: null,
  userBalance: null,
  isWalletConnected: false,
  entryPrice: null,
  investors: [],
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
  totalInvestorTicketCount: 0,
};

export const AppContext = createContext<{
  data: ContextData;
  setData: (data: Partial<ContextData>) => void;
  setDataT: (value: SetStateAction<ContextData>) => void;
  addParticipation: (gameIndex: number, userSeed: number, boostCards?: { id: number; count: number }[]) => Promise<boolean>;
  showInvestorTicketCount: (address: Address) => Promise<number>;
  mintNFTs: (nfts: NFTCount) => Promise<boolean>;
}>({
  data: initialData,
  setData: () => {},
  setDataT: () => {},
  addParticipation: async () => false,
  showInvestorTicketCount: async () => 0,
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
  const { data: walletClient } = useWalletClient();

  const setData = useCallback((d: Partial<ContextData>) => {
    setDataT((prevData) => ({ ...prevData, ...d }));
  }, []);

  const getContracts = useCallback(async (): Promise<{
    lotteryContract: Contract;
    nftContract: Contract;
    settingContract: Contract;
  } | null> => {
    if (!walletClient || !account.isConnected) {
      return null;
    }

    try {
      if (!CONTRACTS.lottery || !CONTRACTS.nft || !CONTRACTS.setting) {
        return null;
      }

      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();

      const [lotteryContract, nftContract, settingContract] = await Promise.all([
        new ethers.Contract(CONTRACTS.lottery, ABI.lotteryGame, signer),
        new ethers.Contract(CONTRACTS.nft, ABI.lotteryGameNFTCard, signer),
        new ethers.Contract(CONTRACTS.setting, ABI.lotterySetting, signer),
      ]);

      return { lotteryContract, nftContract, settingContract };
    } catch (error: any) {
      console.error("Failed to initialize contracts:", error);
      return null;
    }
  }, [walletClient, account.isConnected, chainId]);

  const fetchAppData = useCallback(async (userAddress?: string): Promise<ContextData> => {
    if (!userAddress || !walletClient) {
      return initialData;
    }

    try {
      const contracts = await getContracts();
      if (!contracts) throw new Error("Contracts not initialized");

      const { lotteryContract, nftContract, settingContract } = contracts;

      // Concurrent data fetching
      const [
        entryPrice,
        megaJackpot,
        activeIndices,
        maxMintCount,
        numCardTypes,
        investors,
      ] = await Promise.all([
        settingContract.ENTRY_PRICE().then(ethers.formatEther).then(parseFloat).catch(() => 0),
        lotteryContract.megaJackpot().then(ethers.formatEther).then(parseFloat).catch(() => 0),
        lotteryContract.getActiveGameIndices().catch(() => []),
        nftContract.MAX_MINT_COUNT().then(parseInt).catch(() => 0),
        nftContract.NUM_CARD_TYPES().then(parseInt).catch(() => 0),
        lotteryContract.getInvestorList().catch(() => []),
      ]);

      const cardNames = ["diamond", "platinum", "gold", "silver", "bronze", "iron"];

      // Batch fetch card data
      const cardPromises = Array.from({ length: numCardTypes }, async (_, i) => {
        try {
          const [cardPrice, boostValue, supplyLimits, mintedCount] = await Promise.all([
            nftContract.cardPrices(i).then(ethers.formatEther).catch(() => "0"),
            nftContract.boostValues(i).then((v: any) => parseInt(v)).catch(() => 0),
            nftContract.totalSupplyLimits(i).then((v: any) => parseInt(v)).catch(() => 0),
            nftContract.mintedCounts(i).then((v: any) => parseInt(v)).catch(() => 0),
          ]);
          return {
            cardName: cardNames[i] || `card-${i}`,
            cardPrice,
            boostValue,
            supplyLimits,
            mintedCount,
          };
        } catch (error) {
          console.error(`Failed to fetch card ${i} data:`, error);
          return {
            cardName: cardNames[i] || `card-${i}`,
            cardPrice: "0",
            boostValue: 0,
            supplyLimits: 0,
            mintedCount: 0,
          };
        }
      });

      const cards: Card[] = await Promise.all(cardPromises);
      const mintedCounts = cards.map((card) => card.mintedCount);

      // Fetch game data with batch processing
      const gamePromises = activeIndices.map(async (index: number) => {
        try {
          const game = await lotteryContract.games(index);
          if (!game || game.jackpotSize === 0 || game.currentSize === 0) {
            return null;
          }

          const [currentSize, jackpotSize, totalTicketCount, userTickets] = await Promise.all([
            ethers.formatEther(game.currentSize),
            ethers.formatEther(game.jackpotSize),
            parseInt(game.totalTicketCount) || 0,
            lotteryContract.getTickets(index, userAddress).then(Number).catch(() => 0),
          ]);

          return {
            gameIndex: Number(index),
            jackpotSize,
            currentSize,
            totalTicketCount,
            isParticipated: userTickets > 0,
            status: ["started", "finished", "calculating", "rewarded"][game.state],
            userTickets,
            players: new Set(game.players).size,
          };
        } catch (err: any) {
          console.warn(`Skipping game index ${index} due to error:`, err.message);
          return null;
        }
      });

      const games: GameData[] = (await Promise.all(gamePromises)).filter((g): g is GameData => g !== null);

      // Fetch user-specific data
      const { unlockedBalances } = await nftContract.getUserBalances(userAddress).catch(() => ({ unlockedBalances: [0, 0, 0, 0, 0, 0] }));
      const userNFTs = unlockedBalances.map((balance: string) => parseInt(balance));
      const userNFTCount = userNFTs.reduce((sum: number, count: number) => sum + count, 0);
      const participatedGames = games.filter((game) => game.isParticipated).map((game) => game.gameIndex);

      return {
        network: chainId,
        userAddress,
        userBalance: balanceData?.formatted || "0",
        isWalletConnected: true,
        entryPrice,
        games,
        megaJackpot,
        cards,
        maxMintCount,
        investors,
        lastWinners: {},
        lastWinner: null,
        isNFTHolder: userNFTCount > 0,
        userNFTCount,
        userNFTs,
        mintedCounts,
        boostedNFTs: {},
        participatedGames,
        userTickets: 0,
        totalInvestorTicketCount: 0,
      };
    } catch (error: any) {
      console.error("Failed to fetch app data:", error);
      return initialData;
    }
  }, [chainId, balanceData, walletClient, account.address]);

  const mintNFTs = useCallback(async (nftCounts: NFTCount): Promise<boolean> => {
    if (!account.isConnected || !walletClient) {
      return false;
    }

    if (chainId !== CHAIN_ID) {
      toast.warning("Please switch to Ethereum Mainnet");
      return false;
    }

    try {
      const { nftContract } = await getContracts() || {};
      if (!nftContract) throw new Error("Contracts not initialized");

      const cardNames = ["diamond", "platinum", "gold", "silver", "bronze", "iron"];
      const cardIndex = cardNames.indexOf(nftCounts.name);

      if (cardIndex === -1) throw new Error(`Invalid card type: ${nftCounts.name}`);

      const [maxMintCount, cardPrice, mintedCount, supplyLimits] = await Promise.all([
        nftContract.MAX_MINT_COUNT().then(parseInt),
        nftContract.cardPrices(cardIndex).then(ethers.formatEther),
        nftContract.mintedCounts(cardIndex).then(parseInt),
        nftContract.totalSupplyLimits(cardIndex).then(parseInt),
      ]);

      if (nftCounts.count > maxMintCount) throw new Error(`Max ${maxMintCount} cards per mint`);
      if (mintedCount + nftCounts.count > supplyLimits) {
        throw new Error(`Exceeds supply limit for ${nftCounts.name}`);
      }

      const totalPrice = parseFloat(cardPrice) * nftCounts.count;

      const tx = await nftContract.mint(account.address, cardIndex, nftCounts.count, {
        value: ethers.parseEther(totalPrice.toString()),
      });
      await tx.wait();

      const newData = await fetchAppData(account.address);
      setDataT(newData);

      return true;
    } catch (error: any) {
      console.error("Failed to mint NFTs:", error);
      return false;
    }
  }, [account.isConnected, walletClient, chainId, fetchAppData]);

  const addParticipation = useCallback(async (
    gameIndex: number,
    userSeed: number,
    boostCards?: { id: number; count: number }[]
  ): Promise<boolean> => {
    if (!account.isConnected || !walletClient) {
      return false;
    }

    if (chainId !== CHAIN_ID) {
      toast.warning("Please switch to Ethereum Mainnet");
      return false;
    }

    try {
      const { lotteryContract, settingContract } = await getContracts() || {};
      if (!lotteryContract || !settingContract) throw new Error("Contracts not initialized");

      const game = await lotteryContract.games(gameIndex);
      if (parseInt(game.state) !== 0) {
        return false;
      }

      const entryPrice = await settingContract.ENTRY_PRICE();
      const tokenIds = boostCards?.map((card) => card.id) || [];
      const counts = boostCards?.map((card) => card.count) || [];

      const tx = await lotteryContract.buyTickets(gameIndex, tokenIds, counts, userSeed, {
        value: entryPrice,
      });
      await tx.wait();

      const newData = await fetchAppData(account.address);
      setDataT(newData);
      return true;
    } catch (error: any) {
      console.error("Failed to buy ticket:", error);
      return false;
    }
  }, [account.isConnected, walletClient, chainId, fetchAppData]);

  const showInvestorTicketCount = useCallback(async (address: Address): Promise<number> => {
    try {
      const { lotteryContract } = await getContracts() || {};
      if (!lotteryContract) return 0;

      return Number(await lotteryContract.totalUserTicket(address));
    } catch (error: any) {
      console.error("Failed to load investor ticket count:", error);
      return 0;
    }
  }, []);

  useEffect(() => {
    if (!firstLoad) return;

    if (!account.isConnected || !walletClient || !account.address) {
      setDataT(initialData);
      setLoading(true);
      setDataFetched(false);
      return;
    }

    if (chainId !== CHAIN_ID) {
      toast.error("Please switch to Ethereum Mainnet");
      setDataT(initialData);
      setLoading(true);
      setDataFetched(false);
      return;
    }

    (async () => {
      try {
        const newData = await fetchAppData(account.address);
        setDataT(newData);
        setDataFetched(true);
      } catch (error) {
        console.error("Failed to fetch wallet data:", error);
        setDataT(initialData);
        setDataFetched(false);
        setLoading(true);
      }
    })();
  }, [account.isConnected, account.address, walletClient, chainId, balanceData, fetchAppData]);

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

  return (
    <AppContext.Provider
      value={{
        data,
        setData,
        setDataT,
        addParticipation,
        showInvestorTicketCount,
        mintNFTs,
      }}
    >
      {!firstLoad && account.isConnected && dataFetched && !loading ? (
        children
      ) : (
        <PreLoading
          setLoading={setLoading}
          setFirstLoad={setFirstLoad}
          dataFetched={dataFetched}
        />
      )}
    </AppContext.Provider>
  );
};