// @ts-nocheck

"use client";
import { truncateAddress } from "@/lib/utils/format";
import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";

export default function ConnectButton() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();

  return (
    <div className="flex gap-1 items-center px-2 text-green-500 uppercase">
      <span style={{ color: "#FFF" }}>
        <FontAwesomeIcon icon={faWallet} />
      </span>
      {isConnected ?
        <span
          className="text-xs px-3 py-1 rounded-lg font-semibold text-[#FFF]"
          onClick={() => open({ view: "Account" })}
        >
          {truncateAddress(address)}
        </span> :
        <span
          className="text-xs py-1 rounded-lg font-semibold text-[#FFF]"
          onClick={() => open()}
        >
          connect wallet
        </span>
      }
    </div>
  );
}
