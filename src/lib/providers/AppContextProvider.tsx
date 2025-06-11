// AppContextProvider.tsx
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
import { ethers } from "ethers";
import { quais, Contract } from "quais";
import PreLoading from "@/components/PreLoading";
import { ABI } from "../abi";
import { Address, NFT, GameData, Card, NFTCount } from "../types/lottery";

// Define chain ID and RPC URL
const CHAIN_ID: number = 15000;
const RPC_URL: string = "https://orchard.rpc.quai.network";

// Define contract addresses
interface ContractAddresses {
  lottery: string;
  nft: string;
  setting: string;
}

const CONTRACTS: ContractAddresses = {
  lottery: process.env.LOTTERY_GAME_ADDRESS || "0x00634a279852a4f824a41972922415d5bf29739E",
  nft: process.env.LOTTERY_GAME_NFT_CARD_ADDRESS || "0x0028743cE5e1EDAca8b6c2ABBab0763eb1fd3fE3",
  setting: process.env.LOTTERY_GAME_SETTING_ADDRESS || "0x003E5ff9bD6205Cb435b0D2a85e2FA9b87484e6C",
};

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
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
}>({
  data: initialData,
  setData: () => {},
  setDataT: () => {},
  addParticipation: async () => false,
  showInvestorTicketCount: async () => 0,
  mintNFTs: async () => false,
  connectWallet: async () => false,
  disconnectWallet: () => {},
});

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [data, setDataT] = useState<ContextData>(initialData);
  const [firstLoad, setFirstLoad] = useState(true);
  const [loading, setLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);

  const setData = useCallback((d: Partial<ContextData>) => {
    setDataT((prevData) => ({ ...prevData, ...d }));
  }, []);

  const disconnectWallet = useCallback(() => {
    setDataT({
      ...initialData,
      network: data.network, // Preserve network info
      entryPrice: data.entryPrice, // Preserve static data
      megaJackpot: data.megaJackpot,
      activeGames: data.activeGames,
      games: data.games,
      cards: data.cards,
      maxMintCount: data.maxMintCount,
      investors: data.investors,
      mintedCounts: data.mintedCounts,
    });
    toast.success("Wallet disconnected");
    localStorage.removeItem("lottery-app-data");

    getContracts();
  }, [data]);

  const getProvider = () => {
    if (typeof window !== "undefined" && window.pelagus) {
      return new quais.BrowserProvider(window.pelagus);
    }
    
    return new quais.JsonRpcProvider(RPC_URL, undefined, {usePathing: true});
  };

  const getContracts = async (): Promise<{
    lotteryContract: Contract;
    nftContract: Contract;
    settingContract: Contract;
  } | null> => {
    try {
      const quaiProvider = getProvider();
      let signer;

      if (data.isWalletConnected && window.pelagus) {
        signer = await quaiProvider.getSigner();
      }

      const lotteryContract = new quais.Contract(
        CONTRACTS.lottery,
        ABI.lotteryGame,
        signer || quaiProvider
      );

      const nftContract = new quais.Contract(
        CONTRACTS.nft,
        ABI.lotteryGameNFTCard,
        signer || quaiProvider
      );

      const settingContract = new quais.Contract(
        CONTRACTS.setting,
        ABI.lotterySetting,
        signer || quaiProvider
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

      // Get chain ID
      const provider = getProvider();
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

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

      const cardNames = ["diamond", "platinum", "gold", "silver", "bronze", "iron"];

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
      const activeGames = activeIndices.map((i: any) => Number(i));
      
      const gamePromises = userAddress && activeIndices.map(async (index: number) => {
      
        try {
          const game = await lotteryContract.games(index);
          
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
            players: new Set(game.players).size,
          };
        } catch (err: any) {
          console.warn(`Skipping game index ${index} due to error:`, err);
          return null;
        }
      });

      const games: GameData[] = userAddress ? (await Promise.all(gamePromises)).filter((g): g is GameData => g !== null) : [];

      let userNFTs = [0, 0, 0, 0, 0, 0];
      let userNFTCount = 0;
      let isNFTHolder = false;
      let participatedGames: number[] = [];
      let isWalletConnected = false;
      let userBalance = null;

      if (userAddress) {
        isWalletConnected = true;
        try {
          const { unlockedBalances } = await nftContract.getUserBalances(userAddress);
          userNFTs = unlockedBalances.map((balance: string) => parseInt(balance));
          userNFTCount = userNFTs.reduce((sum, count) => sum + count, 0);
          isNFTHolder = userNFTCount > 0;
          participatedGames = games.filter((game) => game.isParticipated).map((game) => game.gameIndex);
          userBalance = ethers.formatEther(await provider.getBalance(userAddress));
        } catch (error) {
          console.error("Failed to fetch user NFT data:", error);
        }
      }

      return {
        network: chainId,
        userAddress: userAddress || null,
        userBalance,
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
      throw error;
    }
  }, [data.isWalletConnected]);

  const connectWallet = async (): Promise<boolean> => {
    if (!window.pelagus) {
      toast.error("Pelagus wallet not detected. Please install Pelagus.");
      return false;
    }

    try {
      const provider = new ethers.BrowserProvider(window.pelagus);
      const accounts = await provider.send("eth_requestAccounts", []);
      const userAddress = accounts[0];

      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      if (chainId !== CHAIN_ID) {
        try {
          await window.pelagus.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.pelagus.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${CHAIN_ID.toString(16)}`,
                  chainName: "Orchard Network",
                  rpcUrls: [RPC_URL],
                  nativeCurrency: {
                    name: "QUAI",
                    symbol: "QUAI",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://explorer.quai.network"],
                },
              ],
            });
          } else {
            throw switchError;
          }
        }
      }

      const newData = await fetchAppData(userAddress);
      setDataT({
        ...newData,
        userAddress,
        isWalletConnected: true,
      });
      toast.success("Wallet connected successfully");
      return true;
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      toast.error(`Failed to connect wallet: ${error.message}`);
      return false;
    }
  };

  const mintNFTs = async (nftCounts: NFTCount): Promise<boolean> => {
    if (!data.isWalletConnected || !window.pelagus) {
      toast.error("Wallet not connected");
      return false;
    }

    const provider = new ethers.BrowserProvider(window.pelagus);
    const network = await provider.getNetwork();
    if (Number(network.chainId) !== CHAIN_ID) {
      toast.error("Please switch to Orchard Network");
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

      const tx = await nftContract.mint(data.userAddress, cardIndex, nftCounts.count, {
        value: ethers.parseEther(totalPrice.toString()),
      });
      await tx.wait();

      const newData = await fetchAppData(data.userAddress!);
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
    if (!data.isWalletConnected || !window.pelagus) {
      toast.error("Wallet not connected");
      return false;
    }

    const provider = new ethers.BrowserProvider(window.pelagus);
    const network = await provider.getNetwork();
    if (Number(network.chainId) !== CHAIN_ID) {
      toast.error("Please switch to Orchard Network");
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

      const newData = await fetchAppData(data.userAddress!);
      setDataT(newData);

      toast.success(`Successfully purchased ${ticketCount} ticket(s) for game ${gameIndex}`);
      return true;
    } catch (error: any) {
      console.error("Failed to buy ticket:", error);
      toast.error(`Failed to buy ticket: ${error.message}`);
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
          toast.error(`Unsupported network or missing contract addresses for Chain ID ${CHAIN_ID}`);
          return;
        }
        const newData = await fetchAppData();
        setDataT(newData);
      } catch (error) {
        console.error("Initial data fetch failed:", error);
      } finally {
        setDataFetched(true);
        setLoading(false);
        setFirstLoad(false);
      }
    })();
  }, [firstLoad, fetchAppData]);

  useEffect(() => {
    if (data.isWalletConnected && data.userAddress) {
      (async () => {
        try {
          const newData = await fetchAppData(data.userAddress ? data.userAddress : "");
          setDataT(newData);
        } catch (error) {
          console.error("Failed to fetch wallet data:", error);
          toast.error("Failed to load wallet data");
        }
      })();
    }
  }, [data.isWalletConnected, data.userAddress, fetchAppData]);

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
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};