// app/(main)/NFTBoost/_components/NFTMintCard.tsx
'use client';

import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NumberCounter from '../NumberCounter';
import { AppContext } from '@/lib/providers/AppContextProvider';

import nftImage1 from './assets/01.jpg';
import nftImage2 from './assets/02.jpg';
import nftImage3 from './assets/03.jpg';
import { toast } from 'react-toastify';
import Image from 'next/image';
import NFTMintItem from '../NFTMintItem';

export default function NFTMintCard() {
  const { data, mintNFTs, addParticipation } = useContext(AppContext);
  const [mintCount, setMintCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [currentNFTImage, setCurrentNFTImage] = useState<string>('');
  const router = useRouter();

  const mockNFTImages = [nftImage1, nftImage2, nftImage3];

  // Calculate max mintable NFTs based on balance (assuming 0.01 ETH per NFT)
  const nftPrice = 0.01; // ETH per NFT
  const userBalance = parseFloat(data.userBalance || '0');

  // useEffect(() => {
    // if (data.userNFTCount > 0) {
      // const interval = setInterval(() => {
      //   const randomIndex = Math.floor(Math.random() * mockNFTImages.length);
      //   setCurrentNFTImage(mockNFTImages[randomIndex]);
      // }, 500);
      // return () => clearInterval(interval);
    // } else {
    //   setCurrentNFTImage('');
    // }
  // }, []);
  // }, [data.userNFTCount]);

  const handleCountChange = (value: number) => {
    setMintCount(value);
    console.log('Current count:', value);
  };

  const handleMintClick = async () => {
    if (!data.isWalletConnected) {
      alert("Please connect your wallet to mint NFTs.");
      return;
    }

    if (mintCount * nftPrice > userBalance) {
      alert("Insufficient balance to mint this many NFTs.");
      return;
    }

    setIsLoading(true);
    const success = await mintNFTs(mintCount);
    if (success) {
      router.push('/Home');
    }
    setIsLoading(false);
  };

  const handlePlayWithTicket = async () => {
    if (!data.isWalletConnected) {
      alert("Please connect your wallet to participate.");
      return;
    }

    if (data.userTickets < 1) {
      alert("You need at least 1 ticket to play!");
      return;
    }

    setIsLoading(true);
    const success = await addParticipation(`jackpot-${Date.now()}`);
    if (success) {
      toast.success("Added successfully!");
      router.push('/Home');
    } else {
      toast.error("Failed to add participation!");
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full rounded-2xl p-2 sm:px-4 sm:py-3 flex flex-col justify-center ml-auto mr-auto lg:even:ml-0 lg:odd:mr-0 relative">
      <div className="flex flex-col gap-2 min-h-30">
        <NFTMintItem nftName='DIAMOND' handleCountChange={handleCountChange} />
        <NFTMintItem nftName='PLATINUM' handleCountChange={handleCountChange} />
        <NFTMintItem nftName='GOLDEN' handleCountChange={handleCountChange} />
        <NFTMintItem nftName='SILVER' handleCountChange={handleCountChange} />
        <NFTMintItem nftName='BRONZE' handleCountChange={handleCountChange} />
        <NFTMintItem nftName='IRON' handleCountChange={handleCountChange} />

        <div className="relative flex items-center gap-3">
          <p className="font-semibold text-lg">Your NFTs: </p>
          <p className="font-bold text-lg">{data.userNFTCount}</p>
        </div>
        <div className="relative flex items-center gap-3">
          <p className="font-semibold text-lg">Balance: </p>
          <p className="font-bold text-lg">{data.userBalance} ETH</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePlayWithTicket}
            disabled={isLoading || data.userTickets < 1}
            className={`px-6 py-2 text-white font-semibold rounded-lg shadow-md transition duration-200 ease-in-out ${
              isLoading || data.userTickets < 1
                ? 'bg-purple-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800'
            }`}
          >
            {isLoading ? 'Processing...' : 'Play with One Ticket'}
          </button>
        </div>
      </div>
    </div>
  );
}