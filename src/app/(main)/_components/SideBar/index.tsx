"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { pages } from "@/lib/constants/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function SideBar({ visible, onClose }: Props) {
  const [localVisible, setLoalVisible] = useState(false);
  const localVisibleRef = useRef(localVisible);
  const onCloseRef = useRef(onClose);
  localVisibleRef.current = localVisible;
  onCloseRef.current = onClose;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setLoalVisible(visible);
  }, [visible]);

  const goToLeague = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <div
      className="overflow-hidden bg-purple-950 w-[250px] h-full max-h-full overflow-y-auto py-6 flex flex-col fixed -left-[300px] top-0 opacity-0 z-[9995] transition-all duration-200 ease-in-out whitespace-nowrap pt-12 pl-5 pb-4 data-[visible=true]:left-0 data-[visible=true]:opacity-100"
      data-visible={visible}
    >
      <div className="lg:hidden z-[-1] w-[173px] h-[173px] bg-[#BDFF00] rounded-full blur-[150px] absolute top-[250px] left-[-235px]"></div>
      <button
        className="absolute right-2 top-2 w-[34px] h-[34px] text-purple-300"
        onClick={onClose}
      >
        <FontAwesomeIcon
            icon={faAngleLeft}
            className="text-2xl text-red-200"
        />
      </button>
      <div className="w-full h-full overflow-auto flex flex-col relative gap-2 no-scrollbar">
        <div className="relative w-full h-24">
          <Image
            src={"https://ipfs.io/ipfs/bafybeiaq5jsajyddcvi5ym5kjjmgjgsyzhs3hmuuwgu2ufsz2nngypiaby"}
            alt=""
            style={{ objectFit: "contain", zIndex: -1 }}
            priority
            fill
          />
        </div>
        <div className="flex flex-col text-base max-h-[60%]">
          <div
            className="px-6 py-1 rounded-l-full border-b-1 border-purple-400 data-[selected=true]:text-purple-900 data-[selected=true]:font-bold data-[selected=true]:bg-purple-400 cursor-pointer"
            data-selected={/^\/Jackpots/.test(pathname)}
            onClick={() => goToLeague("/Jackpots")}
          >
            <div className="flex items-center justify-end">
              <span className="text-inherit text-md">
                Jackpots
              </span>
            </div>
          </div>
          <div
            className="px-6 py-1 rounded-l-full border-b-1 border-purple-400 data-[selected=true]:text-purple-900 data-[selected=true]:font-bold data-[selected=true]:bg-purple-400 cursor-pointer"
            data-selected={/^\/NFTMint/.test(pathname)}
            onClick={() => goToLeague("/NFTMint")}
          >
            <div className="flex items-center justify-end">
              <span className="text-inherit text-md">
                Card Mint
              </span>
            </div>
          </div>
          <div
            className="px-6 py-1 rounded-l-full border-b-1 border-purple-400 data-[selected=true]:text-purple-900 data-[selected=true]:font-bold data-[selected=true]:bg-purple-400 cursor-pointer"
            data-selected={/^\/Investors/.test(pathname)}
            onClick={() => goToLeague("/Investors")}
          >
            <div className="flex items-center justify-end">
              <span className="text-inherit text-md">
                Investors
              </span>
            </div>
          </div>
          <Link
            href="https://ethereum-lottery-game-docs.vercel.app/"
            target="_blank"
            className="px-6 py-1 rounded-l-full border-b-1 border-purple-400 data-[selected=true]:text-purple-900 data-[selected=true]:font-bold data-[selected=true]:bg-purple-400 cursor-pointer"
            >
            <div className="flex items-center justify-end">
              <span className="text-inherit text-md">
                Docs
              </span>
            </div>
          </Link>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center gap-4">
        <div className="text-sm text-center">
          © {new Date().getFullYear()}&nbsp;Ethereum Lottery
          {/* <br /> */}
          {/* <a
            href="https://discord.gg/kemTYetJ"
            rel="noopener,noreferrer"
            className="flex items-center justify-center p-2 text-xs"
            aria-label="Join our Discord Server"
          >
            <u>Join our Discord Server</u>
          </a> */}
        </div>
        {/* <div className="flex items-center justify-center">
            <a
                href="https://discord.gg/kemTYetJ"
                rel="noopener,noreferrer"
                className="flex items-center justify-center p-2 bg-white rounded-full hover:bg-purple-300 active:bg-purple-100 transition-colors duration-200 ease-in-out"
                aria-label="Join our Discord Server"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="1.55em" height="1.2em" viewBox="0 0 256 199"><path fill="#5865f2" d="M216.856 16.597A208.5 208.5 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046q-29.538-4.442-58.533 0c-1.832-4.4-4.55-9.933-6.846-14.046a207.8 207.8 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161 161 0 0 0 79.735 175.3a136.4 136.4 0 0 1-21.846-10.632a109 109 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a132 132 0 0 0 5.355 4.237a136 136 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848c21.142-6.58 42.646-16.637 64.815-33.213c5.316-56.288-9.08-105.09-38.056-148.36M85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2s23.236 11.804 23.015 26.2c.02 14.375-10.148 26.18-23.015 26.18m85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2c0 14.375-10.148 26.18-23.015 26.18"/></svg>
            </a>
        </div> */}
      </div>
    </div>
  );
}
