"use client";

import BoostInfo from "./_components/BoostInfo";
import NFTMintCard from "./_components/NFTMintCard";

export default function NFTBoost () {

    return (
        <div className="h-full max-h-full overflow-y-auto p-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 mx-auto gap-2 xl:gap-x-10 w-full">
                <BoostInfo />
                <NFTMintCard />
            </div>
        </div>
    );
}