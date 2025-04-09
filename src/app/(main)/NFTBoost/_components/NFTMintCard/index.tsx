'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import NumberCounter from '../NumberCounter';
// import { AppContext } from '../../context/AppContext'; // Adjust path to your context file

interface AppContextType {
  setData: (data: any) => void;
}

const mockUser = {
  walletAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  username: 'User123',
};

export default function NFTMintCard() {
  const [mintCount, setMintCount] = useState<number>(5);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
//   const context = useContext(AppContext) as AppContextType;

  const handleCountChange = (value: number) => {
    setMintCount(value);
    console.log('Current count:', value);
  };

  const handleMintClick = async () => {
    setIsLoading(true);

    try {
      // Simulate an async minting action (replace with real minting logic)
      const mintSuccess = await new Promise<boolean>((resolve) =>
        setTimeout(() => resolve(true), 2000) // Simulate success after 2 seconds
      );

      if (mintSuccess) {
        // Prepare data only if minting succeeds
        const nftInfo = {
          mintCount,
          totalNFTs: 20,
        };

        const dataToSend = {
          nft: nftInfo,
          user: mockUser,
        };

        // if (context?.setData) {
        //   context.setData(dataToSend);
        // } else {
        //   console.error('AppContext is not available');
        // }

        // Navigate to /Jackpot only on success
        router.push('/Jackpot');
      } else {
        console.log('Minting failed, not navigating.');
      }
    } catch (error) {
      console.error('Minting error:', error);
    } finally {
      setIsLoading(false); // Reset loading state regardless of outcome
    }
  };

  return (
    <div className="w-full border border-[--border-primary-color] rounded-2xl p-2 sm:px-4 sm:py-3 flex flex-col justify-center ml-auto mr-auto lg:even:ml-0 lg:odd:mr-0 relative">
      <div className="flex flex-col gap-2 items-center justify-center min-h-30">
        <h1 className="text-3xl font-bold">Start Minting</h1>
        <div className="relative flex items-center gap-3">
          <span className="text-2xl">Mint: </span>
          <NumberCounter
            min={0}
            max={10}
            initialValue={5}
            onChange={handleCountChange}
          />
        </div>
        <div className="relative flex items-center gap-3">
          <p className="font-semibold text-lg">Total: </p>
          <p className="font-bold text-lg">20 NFTs</p>
        </div>
        <button
          onClick={handleMintClick}
          disabled={isLoading}
          className={`px-6 py-2 text-white font-semibold rounded-lg shadow-md transition duration-200 ease-in-out ${
            isLoading
              ? 'bg-purple-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800'
          }`}
        >
          {isLoading ? 'Minting...' : 'Mint Now'}
        </button>
      </div>
    </div>
  );
}