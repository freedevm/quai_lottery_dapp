import Image from "next/image";
import Link from "next/link";

export default function Footer () {
    return (
        <div className="bg-purple-950 rounded-lg shadow-sm dark:bg-purple-900 m-4">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <Link href="https://ethereumlottery.org/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                        <img src="https://ipfs.io/ipfs/bafybeiaq5jsajyddcvi5ym5kjjmgjgsyzhs3hmuuwgu2ufsz2nngypiaby" className="w-16 h-16" alt="Flowbite Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap hidden sm:flex">Ethereum Lottery</span>
                    </Link>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-purple-500 sm:mb-0 dark:text-purple-400">
                        <li>
                            <Link href="/Jackpots" className="hover:underline me-4 md:me-6 uppercase">Jackpots</Link>
                        </li>
                        <li>
                            <Link href="/NFTMint" className="hover:underline me-4 md:me-6 uppercase">Card Mint</Link>
                        </li>
                        <li>
                            <Link href="/Investors" className="hover:underline me-4 md:me-6 uppercase">Investors</Link>
                        </li>
                        <li>
                            <Link href="https://ethereum-lottery-game-docs.vercel.app/" target="_blank" className="hover:underline uppercase">Docs</Link>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-purple-200 sm:mx-auto dark:border-purple-700 lg:my-8" />
                <span className="block text-sm text-purple-500 sm:text-center dark:text-purple-400">© {new Date().getFullYear()}&nbsp;<Link href="https://ethereumlottery.org/" className="hover:underline">Ethereum Lottery™</Link>. All Rights Reserved.</span>
            </div>
        </div>
    )
}