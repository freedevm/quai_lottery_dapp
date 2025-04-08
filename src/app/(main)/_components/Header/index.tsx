"use client";

import "./style.scss";

import Link from "next/link";
import { usePathname } from "next/navigation";

import ConnectButton from "@/wallet-connect/ConnectButton";

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
            <div>Ethereum Multi-Jackpot</div>
          </Link>
          <div className="flex items-center border border-[--border-primary-color] rounded-lg overflow-hidden">
            <ConnectButton />
          </div>
        </div>
      </div>
    </>
  );
}
