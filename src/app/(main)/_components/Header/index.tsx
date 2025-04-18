"use client";

import "./style.scss";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import ConnectButton from "@/wallet-connect/ConnectButton";
import Image from "next/image";
import { useContext, useState } from "react";
import { AppContext } from "@/lib/providers/AppContextProvider";
import SideBar from "../SideBar";

export default function Header() {
  const [sideBarVisible, setSideBarVisible] = useState(false);
  const pathname = usePathname();
  const { data: appData } = useContext(AppContext);
  const isWalletConnected = appData.isWalletConnected;

  return (
    <>
      <div
        id="header"
        className="fixed left-0 top-0 flex flex-col w-screen z-[100] shadow-xl bg-purple-800"
      >
        <div className="container mx-auto px-4 sm:px-8 h-12 sm:h-16 md:h-20 flex justify-between items-center">
          <button
            className="flex items-center gap-2"
          >
            <div className="sm:hidden">
              <DensityMediumIcon onClick={() => setSideBarVisible(true)} fontSize="medium" />
            </div>
            <Link href="https://ethereumlottery.org/">
              <div className="relative w-[80px] h-12 sm:h-16 md:h-20">
                <Image
                  src={"https://ipfs.io/ipfs/bafybeieo32jaqudin6s3sdahoikwllon2t5h62ueyfrcg7ceuz6mxjbpd4"}
                  alt=""
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
            </Link>
          </button>
          <div className="flex relative gap-2 h-full items-center">
            <div className="hidden lg:flex h-full">
              {/* {isWalletConnected &&
                <div className="px-5 flex items-center">
                  Balance: {appData.userBalance}
                </div>
              } */}
              <Link
                href="/Jackpots"
                className="header-button"
                data-selected={/^\/Jackpots/.test(pathname)}
              >
                Jackpots
              </Link>
              <Link
                href="/NFTMint"
                className="header-button"
                data-selected={/^\/NFTMint/.test(pathname)}
              >
                Card Mint
              </Link>
              <Link
                href="/Investors"
                className="header-button"
                data-selected={/^\/Investors/.test(pathname)}
              >
                Investors
              </Link>
              <Link
                href="https://ethereum-lottery-game-docs.vercel.app/"
                className="header-button"
                target="_blank"
              >
                Docs
              </Link>
            </div>
            <div className="h-6 sm:h-8 flex items-center border border-[--border-primary-color] rounded-md overflow-hidden cursor-pointer">
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>
      <SideBar
        visible={sideBarVisible}
        onClose={() => setSideBarVisible(false)}
      />
    </>
  );
}
