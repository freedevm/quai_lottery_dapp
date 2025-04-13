"use client";

import "./style.scss";

import Link from "next/link";
import { usePathname } from "next/navigation";

import ConnectButton from "@/wallet-connect/ConnectButton";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();

  return (
    <>
      <div
        id="header"
        className="fixed left-0 top-0 flex flex-col w-screen z-[100] shadow-xl bg-purple-800"
      >
        <div className="container mx-auto px-4 sm:px-8 h-12 sm:h-16 md:h-20 flex justify-between items-center">
          <Link href="/Home">
            <div className="relative w-[80px] h-12 sm:h-16 md:h-20">
              <Image
                src="https://ipfs.io/ipfs/bafybeiaq5jsajyddcvi5ym5kjjmgjgsyzhs3hmuuwgu2ufsz2nngypiaby"
                alt="logo"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </Link>
          <div className="flex relative gap-2 h-full items-center">
            <div className="hidden lg:flex h-full">
              <Link
                href="/Home"
                className="header-button"
                data-selected={/^\/Home/.test(pathname)}
              >
                Home
              </Link>
              <Link
                href="/NFTMint"
                className="header-button"
                data-selected={/^\/NFTMint/.test(pathname)}
              >
                Mint Cards
              </Link>
            </div>
            <div className="h-6 sm:h-8 flex items-center border border-[--border-primary-color] rounded-md overflow-hidden cursor-pointer">
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
