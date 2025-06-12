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
      className="overflow-hidden bg-purple-950 w-[300px] h-full max-h-full overflow-y-auto py-6 flex flex-col fixed -left-[300px] top-0 opacity-0 z-[9995] transition-all duration-200 ease-in-out whitespace-nowrap pt-12 pl-5 pb-4 data-[visible=true]:left-0 data-[visible=true]:opacity-100"
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
        <div className="relative w-full h-28">
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
            className="px-6 py-1 rounded-l-full border-b-1 text-purple-400 border-purple-400 data-[selected=true]:text-purple-900 data-[selected=true]:font-bold data-[selected=true]:bg-purple-400 cursor-pointer"
            data-selected={/^\/Play/.test(pathname)}
            onClick={() => goToLeague("/Play")}
          >
            <div className="flex items-center justify-end">
              <span className="text-inherit text-md">
                Play
              </span>
            </div>
          </div>
          <div
            className="px-6 py-1 rounded-l-full border-b-1 text-purple-400 border-purple-400 data-[selected=true]:text-purple-900 data-[selected=true]:font-bold data-[selected=true]:bg-purple-400 cursor-pointer"
            data-selected={/^\/NFTMint/.test(pathname)}
            onClick={() => goToLeague("/NFTMint")}
          >
            <div className="flex items-center justify-end">
              <span className="text-inherit text-md">
                Card Shop
              </span>
            </div>
          </div>
          <div
            className="px-6 py-1 rounded-l-full border-b-1 text-purple-400 border-purple-400 data-[selected=true]:text-purple-900 data-[selected=true]:font-bold data-[selected=true]:bg-purple-400 cursor-pointer"
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
            className="px-6 py-1 rounded-l-full border-b-1 text-purple-400 border-purple-400 data-[selected=true]:text-purple-900 data-[selected=true]:font-bold data-[selected=true]:bg-purple-400 cursor-pointer"
            >
            <div className="flex items-center justify-end">
              <span className="text-inherit text-md">
                Docs
              </span>
            </div>
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="mb-6 flex justify-center space-x-2">
          <Link
            href="https://x.com/etherum_lottery"
            type="button"
            className="rounded-full bg-[#55acee] p-3 uppercase leading-normal text-white shadow-dark-3 shadow-black/30 transition duration-150 ease-in-out hover:shadow-dark-1 focus:shadow-dark-1 focus:outline-none focus:ring-0 active:shadow-1 dark:text-white"
            data-twe-ripple-init
            data-twe-ripple-color="light">
            <span className="mx-auto [&>svg]:h-5 [&>svg]:w-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 512 512">
                <path
                  d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
              </svg>
            </span>
          </Link>

          <Link
            href="https://www.instagram.com/ethereum_lottery/"
            type="button"
            className="rounded-full bg-[#ac2bac] p-3 uppercase leading-normal text-white shadow-dark-3 shadow-black/30 transition duration-150 ease-in-out hover:shadow-dark-1 focus:shadow-dark-1 focus:outline-none focus:ring-0 active:shadow-1 dark:text-white"
            data-twe-ripple-init
            data-twe-ripple-color="light">
            <span className="mx-auto [&>svg]:h-5 [&>svg]:w-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 448 512">
                <path
                  d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
              </svg>
            </span>
          </Link>

          <Link
            href="https://discord.gg/M6nUYVf3PY"
            type="button"
            className="rounded-full bg-[#4634ed] p-3 uppercase leading-normal text-white shadow-dark-3 shadow-black/30 transition duration-150 ease-in-out hover:shadow-dark-1 focus:shadow-dark-1 focus:outline-none focus:ring-0 active:shadow-1 dark:text-white"
            data-twe-ripple-init
            data-twe-ripple-color="light">
            <span className="mx-auto [&>svg]:h-5 [&>svg]:w-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 0 16 16"><path fill="currentColor" d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011a.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0a8 8 0 0 0-.412-.833a.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02a.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595a.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085a8 8 0 0 1-1.249.594a.05.05 0 0 0-.03.03a.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019a13.2 13.2 0 0 0 4.001-2.02a.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613c0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613c0 .888-.631 1.612-1.438 1.612"/></svg>
            </span>
          </Link>
          <Link
            href="https://discord.gg/M6nUYVf3PY"
            type="button"
            className="rounded-full bg-blue-400 p-3 uppercase leading-normal text-white shadow-dark-3 shadow-black/30 transition duration-150 ease-in-out hover:shadow-dark-1 focus:shadow-dark-1 focus:outline-none focus:ring-0 active:shadow-1 dark:text-white"
            data-twe-ripple-init
            data-twe-ripple-color="light">
            <span className="mx-auto [&>svg]:h-5 [&>svg]:w-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 0 512 512"><path fill="currentColor" d="M470.435 45.423L16.827 221.249c-18.254 8.188-24.428 24.585-4.412 33.484l116.37 37.173l281.368-174.79c15.363-10.973 31.091-8.047 17.557 4.024L186.053 341.075l-7.591 93.076c7.031 14.371 19.905 14.438 28.117 7.295l66.858-63.589l114.505 86.187c26.595 15.826 41.066 5.613 46.788-23.394l75.105-357.47c7.798-35.705-5.5-51.437-39.4-37.757"/></svg>
            </span>
          </Link>
        </div>
        <div className="text-sm text-center">
          © {new Date().getFullYear()}&nbsp;<Link href="https://ethereumlottery.org/" className="hover:underline">Quai Lottery</Link>
          {/* <br /> */}
          {/* <Link
            href="https://discord.gg/kemTYetJ"
            rel="noopener,noreferrer"
            className="flex items-center justify-center p-2 text-xs"
            aria-label="Join our Discord Server"
          >
            <u>Join our Discord Server</u>
          </Link> */}
        </div>
        {/* <div className="flex items-center justify-center">
            <Link
                href="https://discord.gg/kemTYetJ"
                rel="noopener,noreferrer"
                className="flex items-center justify-center p-2 bg-white rounded-full hover:bg-purple-300 active:bg-purple-100 transition-colors duration-200 ease-in-out"
                aria-label="Join our Discord Server"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="1.55em" height="1.2em" viewBox="0 0 256 199"><path fill="#5865f2" d="M216.856 16.597A208.5 208.5 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046q-29.538-4.442-58.533 0c-1.832-4.4-4.55-9.933-6.846-14.046a207.8 207.8 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161 161 0 0 0 79.735 175.3a136.4 136.4 0 0 1-21.846-10.632a109 109 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a132 132 0 0 0 5.355 4.237a136 136 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848c21.142-6.58 42.646-16.637 64.815-33.213c5.316-56.288-9.08-105.09-38.056-148.36M85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2s23.236 11.804 23.015 26.2c.02 14.375-10.148 26.18-23.015 26.18m85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2c0 14.375-10.148 26.18-23.015 26.18"/></svg>
            </Link>
        </div> */}
      </div>
    </div>
  );
}
