import { cardImages } from "@/lib/constants/cardImages";
import Image from "next/image";
import { useEffect, useState } from "react";
import { NFT } from "@/lib/types/lottery"; // Import NFT type

interface Props {
  nftName: string;
  userNFTs: NFT[];
  setSelectedNFTs: React.Dispatch<
    React.SetStateAction<{ id: string; count: number }[]>
  >;
}

export default function NFTBoostCard({ nftName, userNFTs, setSelectedNFTs }: Props) {
  // Count how many NFTs of this type the user owns
  const availableCount = userNFTs.filter(
    (nft) => nft.name.toLowerCase() === nftName.toLowerCase()
  ).length;

  // Initialize count state
  const [count, setCount] = useState(0);

  // Update selectedNFTs when count changes
  useEffect(() => {
    setSelectedNFTs((prev) => {
      const existing = prev.find(
        (item) => item.id === `${nftName.toLowerCase()}-nft`
      );
      if (count === 0 && existing) {
        return prev.filter((item) => item.id !== `${nftName.toLowerCase()}-nft`);
      }
      if (count > 0) {
        if (existing) {
          return prev.map((item) =>
            item.id === `${nftName.toLowerCase()}-nft`
              ? { ...item, count }
              : item
          );
        }
        return [
          ...prev,
          { id: `${nftName.toLowerCase()}-nft`, count },
        ];
      }
      return prev;
    });
  }, [count, nftName, setSelectedNFTs]);

  const handleIncrement = () => {
    if (count < availableCount) {
      setCount((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (count > 0) {
      setCount((prev) => prev - 1);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="bg-purple-700 rounded-lg flex flex-col items-center relative cursor-pointer pb-1"
    >
      <div className="w-full h-28 relative rounded-md mb-2 overflow-hidden">
        <Image
          src={cardImages[nftName]}
          alt={`${nftName} card`}
          fill
        />
      </div>
      <p className="text-sm text-white">{nftName.toUpperCase()}</p>
      {/* Counter */}
      <div className="w-full flex justify-center">
        <div className="inline-flex items-center overflow-hidden shadow-sm">
          <button
            onClick={handleDecrement}
            disabled={count === 0}
            className="rounded-lg w-7 h-7 flex items-center justify-center text-white text-lg font-semibold hover:bg-purple-500 active:bg-purple-600 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            -
          </button>

          <input
            type="number"
            value={count}
            readOnly
            className="w-14 h-7 text-center bg-purple-700 text-white text-lg px-2 focus:outline-none focus:ring-2 focus:ring-purple-700 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />

          <button
            onClick={handleIncrement}
            disabled={count >= availableCount}
            className="rounded-lg w-7 h-7 flex items-center justify-center text-white text-lg font-semibold hover:bg-purple-500 active:bg-purple-600 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}