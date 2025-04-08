
export default function BoostInfo () {
    

    return (
        <div className="w-full p-2 sm:px-4 sm:py-3 flex flex-col ml-auto mr-auto lg:even:ml-0 lg:odd:mr-0 relative">
            <h1 className="text-2xl text-center">🚀 NFT Boost Mint</h1>
            <p>
                Our NFTs give you a boost in Entry Games by increasing your ticket count!<br />
                The more NFTs you hold, the bigger the boost—but we’ve balanced it to keep things fair.
            </p>
            <ul className="list-disc pl-5 text-blue-300">
                <li>Max Boost: 30 tickets, reached by holding 10 NFTs.</li>
                <li>
                    Boost Curve:
                    <ul className="list-circle pl-5">
                        <li>1 NFT: 2 tickets</li>
                        <li>2 NFT: 4 tickets</li>
                        <li>3 NFT: 7 tickets</li>
                        <li>4 NFT: 10 tickets</li>
                        <li>5 NFT: 13 tickets</li>
                        <li>6 NFT: 14 tickets</li>
                        <li>7 NFT: 18 tickets</li>
                        <li>8 NFT: 21 tickets</li>
                        <li>9 NFT: 25 tickets</li>
                        <li>10+ NFT: 30 tickets (Max)</li>
                    </ul>
                </li>
                </ul>
        </div>
    )
}