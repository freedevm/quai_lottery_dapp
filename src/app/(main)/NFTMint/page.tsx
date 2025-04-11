"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "@/lib/providers/AppContextProvider";
import { toast } from "react-toastify";
import NFTMintItem from "./_components/NFTMintItem";
import { cards } from "@/lib/constants/ui";

export default function NFTMints() {
  const { data, mintNFTs, addParticipation } = useContext(AppContext);
  const [nftCounts, setNftCounts] = useState<{ [key: string]: number }>({
    diamond: 0,
    platinum: 0,
    gold: 0,
    silver: 0,
    bronze: 0,
    iron: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // NFT price (ETH per NFT)
  const nftPrice = 0.01;
  const userBalance = parseFloat(data.userBalance || "0");

  const handleCountChange = (nftName: string, value: number) => {
    setNftCounts((prev) => ({
      ...prev,
      [nftName]: value,
    }));
  };

  const handleMintClick = async () => {
    if (!data.isWalletConnected) {
      toast.error("Please connect your wallet to mint NFTs.");
      return;
    }

    // Calculate total NFTs and cost
    const totalNfts = Object.values(nftCounts).reduce((sum, count) => sum + count, 0);
    const totalCost = totalNfts * nftPrice;

    if (totalNfts === 0) {
      toast.error("Please select at least one NFT to mint.");
      return;
    }

    if (totalCost > userBalance) {
      toast.error("Insufficient balance to mint these NFTs.");
      return;
    }

    setIsLoading(true);
    const nftsToMint = Object.entries(nftCounts)
      .filter(([_, count]) => count > 0)
      .map(([name, count]) => ({ name, count }));

    const success = await mintNFTs(nftsToMint);
    if (success) {
      toast.success("NFTs minted successfully!");
      router.push("/Home");
    } else {
      toast.error("Failed to mint NFTs!");
    }
    setIsLoading(false);
  };

  const handlePlayWithTicket = async () => {
    if (!data.isWalletConnected) {
      toast.error("Please connect your wallet to participate.");
      return;
    }

    if (data.userTickets < 1) {
      toast.error("You need at least 1 ticket to play!");
      return;
    }

    setIsLoading(true);
    const success = await addParticipation(`jackpot-${Date.now()}`);
    if (success) {
      toast.success("Added successfully!");
      router.push("/Home");
    } else {
      toast.error("Failed to add participation!");
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full rounded-2xl p-2 sm:px-4 sm:py-3 flex flex-col justify-center ml-auto mr-auto lg:even:ml-0 lg:odd:mr-0 relative">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-6 mb-4 px-4">
        <div className="flex items-center justify-start sm:justify-end">
          <button
            onClick={handlePlayWithTicket}
            disabled={isLoading || data.userTickets < 1}
            className={`uppercase w-full sm:w-auto px-6 py-2 text-white font-semibold rounded-lg shadow-md transition duration-200 ease-in-out ${
              isLoading || data.userTickets < 1
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
            }`}
          >
            {isLoading ? "Processing..." : "buy one ticket - 0.05 eth"}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <p className="font-semibold text-lg text-white">Balance:</p>
          <p className="font-bold text-lg text-white">{data.userBalance} ETH</p>
        </div>
      </div>

      <div className="flex flex-col">
        {cards.map((card) => (
          <NFTMintItem
            key={card.name}
            nftName={card.name}
            nftPrice={card.price}
            handleCountChange={(value: number) => handleCountChange(card.name, value)}
            onMint={handleMintClick}
            isLoading={isLoading}
            maxMintable={Math.floor(userBalance / nftPrice)}
          />
        ))}
      </div>
    </div>
  );
}