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
import { ABI } from "../abi";
import { Address, NFT, GameData, Card, NFTCount } from "../types/lottery";

interface ContractAddresses {
  lottery: string;
  nft: string;
  setting: string;
}

interface ContractsMap {
  [chainId: number]: ContractAddresses;
}

const CONTRACTS = {
  lottery: "0xf95Ecbc1cBe909FF2F6ab50DA6897de83B3cB1d6",
  nft: "0xBd24551fcce10c059614A18a46eF4D3E4118F1BA",
  setting: "0xC181C594EBC724A1Acc8EF711ff5921281ba461d"
}

const ALCHEMY_KEY = "hra0WS7LQz4cQfdKoscbvfEFBDB54ELk";

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
  lastWinner: Address | null; // Winner of the latest rewarded game
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
  entryPrice: 0,
  games: [],
  megaJackpot: null,
  cards: [],
  maxMintCount: 0,
  lastWinners: {},
  lastWinner: null,
  isNFTHolder: false,
  userNFTCount: 0,
  userNFTs: [0,0,0,0,0,0],
  mintedCounts: [0,0,0,0,0,0],
  boostedNFTs: {},
  participatedGames: [],
  userTickets: 0,
};

export const AppContext = createContext<{
  data: ContextData;
  setData: (data: Partial<ContextData>) => void;
  setDataT: (value: SetStateAction<ContextData>) => void;
  addParticipation: (gameIndex: number, userSeed: number, boostCards?:{id:number, count:number}[]) => Promise<boolean>;
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

  const setData = (d: Partial<ContextData>) =>
    setDataT((prevData) => ({ ...prevData, ...d }));

  const getContracts = async () => {
    const walletConnected = !!walletClient; // Simplified check
    console.log("### wallet connected => ", walletConnected)
  
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
      console.log("### card index > ", cardIndex)

      if(cardIndex === -1) throw new Error(`Invalid card type: ${nftCounts.name}`);
      const maxMintCount = parseInt(await nftContract.MAX_MINT_COUNT());

      const cardPrice = ethers.formatEther(await nftContract.cardPrices(cardIndex));
      const mintedCount = parseInt(await nftContract.mintedCounts(cardIndex));
      const supplyLimit = parseInt(await nftContract.totalSupplyLimits(cardIndex));

      if (nftCounts.count > maxMintCount) throw new Error(`Max ${maxMintCount} cards per mint`);

      if (mintedCount + nftCounts.count > supplyLimit) {
        throw new Error(`Exceeds supply limit for ${nftCounts.name}`);
      }

      const totalPrice = parseFloat(cardPrice) * nftCounts.count;

      // Call mint with correct arguments and value
      const tx = await nftContract.mint(account.address, cardIndex, nftCounts.count, {
        value: ethers.parseEther(totalPrice.toString()),
      });
      await tx.wait(); // Wait for the transaction to be confirmed

      setDataT((prev) => {
        // Create copies of the arrays to avoid mutating the original state
        const updatedUserNFTs = [...prev.userNFTs];
        const updatedMintedCounts = [...prev.mintedCounts];
      
        // Update the specific index
        updatedUserNFTs[cardIndex] = prev.userNFTs[cardIndex] + nftCounts.count;
        updatedMintedCounts[cardIndex] = prev.mintedCounts[cardIndex] + nftCounts.count;
      
        return {
          ...prev,
          userNFTCount: prev.userNFTCount + nftCounts.count,
          userNFTs: updatedUserNFTs,
          mintedCounts: updatedMintedCounts,
          isNFTHolder: true,
        };
      });

      return true;
    } catch (error: any) {
      console.error("Failed to mint NFTs:", error);
      return false;
    }
  };

  const addParticipation = async (
    gameIndex: number, 
    userSeed: number,
    boostCards?: {id: number, count: number}[],
  ): Promise<boolean> => {
    if (!account.isConnected || !walletClient) {
      toast.error("Wallet not connected");
      return false;
    }

    try {
      const { lotteryContract, settingContract, nftContract } = await getContracts() || {};
      if (!lotteryContract || !settingContract || !nftContract) {
        throw new Error("Contracts not initialized");
      }

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
        tokenIds = boostCards.map(card => card.id);
        counts = boostCards.map(card => card.count);
        ticketCount = boostCards.reduce((sum, card) => sum + card.count, 1);
      }

      const tx = await lotteryContract.buyTickets(gameIndex, tokenIds, counts, userSeed, {
        value: entryPrice,
      });
      await tx.wait();

      setDataT((prev) => {
        const updatedGames = prev.games.map((g) =>
          g.gameIndex === gameIndex ? { ...g, userTickets: ticketCount } : g
        );
        return {
          ...prev,
          games: updatedGames,
          participatedGames: [...prev.participatedGames, gameIndex],
        };
      });

      return true;
    } catch (error: any) {
      console.error("Failed to buy ticket:", error);
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
      });
    }
  }, [account.isConnected, account.address, chainId, balanceData, data.userNFTCount]);

  useEffect(() => {
    (async function init() {
      if (!firstLoad) return;
      setLoading(true);

      try {
        const contracts = await getContracts();
        if (!contracts) throw new Error("Contracts not initialized");

        const { lotteryContract, nftContract, settingContract } = contracts;

        // Fetch Setting Data
        const entryPrice = parseFloat(ethers.formatEther(await settingContract.ENTRY_PRICE()));
        
        // Fetch Game Data
        const megaJackpot = parseFloat(ethers.formatEther(await lotteryContract.megaJackpot()));
        const activeIndices = await lotteryContract.getActiveGameIndices();
        
        const gamePromises = activeIndices.map(async (index: number) => {
          const game = await lotteryContract.games(index);
          const userTickets = account.isConnected
            ? Number(await lotteryContract.getTickets(index, account.address))
            : 0;
          const players = new Set(game.players).size;
          const currentSize = ethers.formatEther(game.currentSize);
          const jackpotSize = ethers.formatEther(game.jackpotSize);
          const ticketInGame = await lotteryContract.getTickets(index, account.address);
          const isParticipated = !!ticketInGame;

          // Calculate prize pool
          const mainRewardPercent = Number(await settingContract.MAIN_REWARD_PERCENT()) / 10000;
          const randomTenPercent = Number(await settingContract.RANDOM_TEN_REWARD_PERCENT()) / 10000;
          const prizePool = {
            mainReward: (Number(currentSize) * mainRewardPercent).toFixed(4),
            randomTenReward: (Number(currentSize) * randomTenPercent).toFixed(4),
          };

          return {
            gameIndex: Number(index),
            jackpotSize,
            currentSize,
            isParticipated,
            status: ["started", "finished", "calculating", "rewarded"][game.state] as GameData["status"],
            userTickets,
            players,
            prizePool,
          };
        });

        // Fetch NFTs
        const cardNames = ["diamond", "platinum", "gold", "silver", "bronze", "iron"];
        const maxMintCount = parseInt(await nftContract.MAX_MINT_COUNT());
        const numCardTypes = parseInt(await nftContract.NUM_CARD_TYPES());
        const {totalBalances, lockedBalances, unlockedBalances} = await nftContract.getUserBalances(account.address);
        const userNFTs = totalBalances.map((balance: string) => parseInt(balance));

        let cardPrices = [];
        let boostValues = [];
        let supplyLimits = [];
        let mintedCounts = [];
        let totalCount = 0;

        for (let i = 0; i < numCardTypes; i++) {
          cardPrices.push(ethers.formatEther(await nftContract.cardPrices(i)));
          boostValues.push(parseInt(await nftContract.boostValues(i)));
          supplyLimits.push(parseInt(await nftContract.totalSupplyLimits(i)));
          mintedCounts.push(parseInt(await nftContract.mintedCounts(i)));
          totalCount += userNFTs[i];
        }

        let cards = [];

        for (let i = 0; i < numCardTypes; i++) {
          cards.push({
            cardName: cardNames[i],
            cardPrice: cardPrices[i],
            boostValue: boostValues[i],
            supplyLimits: supplyLimits[i],
            mintedCount: mintedCounts[i],
          })
        }

        const games = await Promise.all(gamePromises);
        console.log("### games => ", games)

        setData({
          entryPrice,
          games,
          megaJackpot,
          cards,
          maxMintCount,
          userNFTCount: totalCount,
          userNFTs,
          mintedCounts,
          isNFTHolder: totalCount > 0,
        });
      } catch (error: any) {
        console.error("Init error:", error);
        toast.error("Failed to load lottery data");
      } finally {
        setDataFetched(true)
      }
    })();
  }, [firstLoad, account.address, account.isConnected, walletClient]);

  // useEffect(() => {
  //   if (account.isConnected && chainId === 11155111) {
  //     toast.warning("Please switch to a supported network (Sepolia)");
  //     return;
  //   }
  
  //   setData({ network: chainId });
  
  //   if (chainId !== 11155111) {
  //     try {
  //       walletClient?.switchChain({ id: 11155111 });
  //     } catch (error) {
  //       console.error("Failed to switch network:", error);
  //     }
  //   }
  // }, [chainId, account.isConnected, walletClient]);

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