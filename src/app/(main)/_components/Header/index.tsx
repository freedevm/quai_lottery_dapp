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
        className="absolute left-0 top-0 flex flex-col w-screen z-[100]"
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
          <div className="flex items-center border border-[--border-primary-color] rounded-lg overflow-hidden">
            <ConnectButton />
          </div>
        </div>
      </div>
    </>
  );
}
