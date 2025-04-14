"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "@/lib/providers/AppContextProvider";
import { toast } from "react-toastify";
import NFTMintItem from "./_components/NFTMintItem";
import { cards } from "@/lib/constants/ui";

export default function NFTMints() {
  const { data, mintNFTs, addParticipation } = useContext(AppContext);
  const [nftCounts, setNftCounts] = useState<number[]>([0,0,0,0,0,0]);
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
    let totalCost = 0;
    let totalNfts = 0;

    if (data.cards) {
      for (let i = 0; i < nftCounts.length; i++) {
        totalCost += parseFloat(data.cards[i].cardPrice) * nftCounts[i];
        totalNfts += nftCounts[i];
      }
    }

    if (totalNfts === 0) {
      toast.error("Please select at least one NFT to mint.");
      return;
    }

    if (totalCost > userBalance) {
      toast.error("Insufficient balance to mint these NFTs.");
      return;
    }

    setIsLoading(true);

    // const success = await mintNFTs(nftCounts);
    // if (success) {
    //   toast.success("NFTs minted successfully!");
    //   router.push("/Home");
    // } else {
    //   toast.error("Failed to mint NFTs!");
    // }
    setIsLoading(false);
  };

  return (
    <div className="w-full rounded-2xl p-2 sm:px-4 sm:py-5 flex flex-col justify-center ml-auto mr-auto lg:even:ml-0 lg:odd:mr-0 relative">
      <div className="flex flex-col">
        {data.cards && data.cards.map((card) => (
          <NFTMintItem
            key={card.cardName}
            data={card}
            handleCountChange={(value: number) => handleCountChange(card.cardName, value)}
            onMint={handleMintClick}
            isLoading={isLoading}
            maxMintable={data.maxMintCount}
            stockNum={card.supplyLimits}
          />
        ))}
      </div>
    </div>
  );
}