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

// Fallback Alchemy URL
const ALCHEMY_URL = process.env.NEXT_PUBLIC_ALCHEMY_KEY_MAINNET || "https://eth-mainnet.g.alchemy.com/v2/VvvXuTxKhe0crIcgxiUSc2Bvf9NcT4bT";

// Interface for ContextData
interface ContextData {
  network: number | null;
  userAddress: string | null;
  userBalance: string | null;
  isWalletConnected: boolean;
  entryPrice: number | null;
  investors: Address[];
  activeGames: number[];
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
  activeGames: [],
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
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const setData = useCallback((d: Partial<ContextData>) => {
    setDataT((prevData) => ({ ...prevData, ...d }));
  }, []);

  const getContracts = async (): Promise<{
    lotteryContract: Contract;
    nftContract: Contract;
    settingContract: Contract;
  } | null> => {
    const walletConnected = !!walletClient;
    try {
      // Validate chain ID and contract addresses
      if (!CONTRACTS || !CONTRACTS.lottery || !CONTRACTS.nft || !CONTRACTS.setting) {
        toast.error(`Missing contract addresses for network: Chain ID ${chainId}`);
        throw new Error(`Invalid contract configuration for chain ID ${chainId}`);
      }

      let signer;
      let publicProvider;

      if (walletConnected) {
        const provider = new BrowserProvider(walletClient);
        signer = await provider.getSigner();
      } else {
        publicProvider = new ethers.JsonRpcProvider(ALCHEMY_URL);

        // Verify contract deployment (basic check)
        const lotteryCode = await publicProvider.getCode(CONTRACTS.lottery);
        const nftCode = await publicProvider.getCode(CONTRACTS.nft);
        if (lotteryCode === "0x" || nftCode === "0x") {
          throw new Error("One or more contracts are not deployed at the specified addresses");
        }
      }

      // Initialize contracts
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
    } catch (error: any) {
      console.error("Failed to initialize contracts:", error);
      toast.error(`Failed to connect to blockchain contracts: ${error.message}`);
      return null;
    }
  };

  const fetchAppData = useCallback(async (userAddress?: string): Promise<ContextData> => {
    try {
      const contracts = await getContracts();
      if (!contracts) throw new Error("Contracts not initialized");
  
      const { lotteryContract, nftContract, settingContract } = contracts;
  
      // Fetch wallet-independent data
      const entryPricePromise = settingContract.ENTRY_PRICE().then(ethers.formatEther).then(parseFloat);
      const megaJackpotPromise = lotteryContract.megaJackpot().then(ethers.formatEther).then(parseFloat);
      const activeIndicesPromise = lotteryContract.getActiveGameIndices().catch((e) => {
        console.error("Failed to fetch active game indices:", e);
        return [];
      });
      const maxMintCountPromise = nftContract.MAX_MINT_COUNT().then(parseInt);
      const numCardTypesPromise = nftContract.NUM_CARD_TYPES().then(parseInt);
      const investorsPromise = lotteryContract.getInvestorList().catch((e) => {
        console.error("Failed to fetch investors:", e);
        return [];
      });
  
      const [entryPrice, megaJackpot, activeIndices, maxMintCount, numCardTypes, investors] = await Promise.all([
        entryPricePromise,
        megaJackpotPromise,
        activeIndicesPromise,
        maxMintCountPromise,
        numCardTypesPromise,
        investorsPromise,
      ]);
  
      // Debug: Log active indices
      console.log("Active game indices:", activeIndices);
  
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
      const activeGames = activeIndices.map((i: any) => Number(i))
  
      // Fetch game data with robust error handling
      const gamePromises = userAddress && activeIndices.map(async (index: number) => {
        try {
          const game = await lotteryContract.games(index);
  
          // Verify game is initialized (non-zero values or valid state)
          if (!game || game.jackpotSize === 0 || game.currentSize === 0) {
            console.warn(`Game index ${index} is not initialized or has invalid data`);
            return null;
          }
  
          const currentSize = ethers.formatEther(game.currentSize);
          const jackpotSize = ethers.formatEther(game.jackpotSize);
          const totalTicketCount = parseInt(game.totalTicketCount) || 0;
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
            totalTicketCount,
            isParticipated,
            status: ["started", "finished", "calculating", "rewarded"][game.state],
            userTickets,
            players: new Set(game.players).size, // Note: players field is not in ABI, see below
          };
        } catch (err: any) {
          console.warn(`Skipping game index ${index} due to error:`, err.message);
          return null; // Skip invalid or reverted games
        }
      });
  
      const games: GameData[] = userAddress ? (await Promise.all(gamePromises)).filter((g): g is GameData => g !== null) : [];
  
      // Debug: Log fetched games
      console.log("Fetched games:", games);
  
      // Fetch wallet-dependent data
      let userNFTs = [0, 0, 0, 0, 0, 0];
      let userNFTCount = 0;
      let isNFTHolder = false;
      let participatedGames: number[] = [];
      let isWalletConnected = false;
  
      if (userAddress) {
        isWalletConnected = true;
        try {
          const { unlockedBalances } = await nftContract.getUserBalances(userAddress);
          userNFTs = unlockedBalances.map((balance: string) => parseInt(balance));
          userNFTCount = userNFTs.reduce((sum, count) => sum + count, 0);
          isNFTHolder = userNFTCount > 0;
          participatedGames = games.filter((game) => game.isParticipated).map((game) => game.gameIndex);
        } catch (error) {
          console.error("Failed to fetch user NFT data:", error);
        }
      }
  
      return {
        network: chainId,
        userAddress: userAddress || null,
        userBalance: balanceData?.formatted || null,
        isWalletConnected,
        entryPrice,
        activeGames,
        games,
        megaJackpot,
        cards,
        maxMintCount,
        investors,
        lastWinners: {},
        lastWinner: null,
        isNFTHolder,
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
      // toast.error(`Failed to load application data: ${error.message}`);
      throw error;
    }
  }, [chainId, balanceData]);

  const mintNFTs = async (nftCounts: NFTCount): Promise<boolean> => {
    if (!account.isConnected || !walletClient) {
      toast.error("Wallet not connected");
      return false;
    }

    if (chainId !== CHAIN_ID) {
      toast.error("Please switch to Ethereum Mainnet");
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

      const newData = await fetchAppData(account.address);
      setDataT(newData);

      toast.success(`Successfully minted ${nftCounts.count} ${nftCounts.name} NFTs`);
      return true;
    } catch (error: any) {
      console.error("Failed to mint NFTs:", error);
      toast.error(`Minting failed: ${error.message}`);
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

    if (chainId !== CHAIN_ID) {
      toast.error("Please switch to Ethereum Mainnet");
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

      const newData = await fetchAppData(account.address);
      setDataT(newData);

      toast.success(`Successfully purchased ${ticketCount} ticket(s) for game ${gameIndex}`);
      return true;
    } catch (error: any) {
      console.error("Failed to buy ticket:", error);
      return false;
    }
  };

  const showInvestorTicketCount = async (address: Address): Promise<number> => {
    try {
      const { lotteryContract } = await getContracts() || {};
      if (!lotteryContract) throw new Error("Contracts not initialized");

      const totalInvestorTicketCount = Number(await lotteryContract.totalUserTicket(address));
      return totalInvestorTicketCount;
    } catch (error: any) {
      console.error("Failed to load investor ticket count:", error);
      return 0;
    }
  };

  useEffect(() => {
    if (!firstLoad) return;
    (async () => {
      setLoading(true);
      try {
        if (!CONTRACTS || !CONTRACTS.lottery) {
          toast.error(`Unsupported network or missing contract addresses for Chain ID ${chainId}`);
          return;
        }
        const newData = await fetchAppData();
        setDataT(newData);
      } catch (error) {
        console.error("Initial data fetch failed:", error);
      } finally {
        setDataFetched(true);
      }
    })();
  }, [firstLoad, chainId, fetchAppData]);

  useEffect(() => {
    if (account.isConnected && account.address) {
      if (chainId !== CHAIN_ID) {
        toast.error("Please switch to Ethereum Mainnet");
        return;
      }
      (async () => {
        try {
          const newData = await fetchAppData(account.address);
          setDataT({
            ...newData,
            network: chainId,
            userAddress: account.address ?? null,
            userBalance: balanceData?.formatted || "0",
            isWalletConnected: true,
          });
        } catch (error) {
          console.error("Failed to fetch wallet data:", error);
          toast.error("Failed to load wallet data");
        }
      })();
    } else {
      (async () => {
        try {
          const newData = await fetchAppData();
          setDataT({
            ...newData,
            network: chainId,
            userAddress: null,
            userBalance: null,
            isWalletConnected: false,
          });
        } catch (error) {
          console.error("Failed to fetch game data:", error);
          toast.error("Failed to load game data");
        }
      })();
    }
  }, [account.isConnected, account.address, chainId, balanceData, fetchAppData]);

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
        showInvestorTicketCount,
        mintNFTs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};