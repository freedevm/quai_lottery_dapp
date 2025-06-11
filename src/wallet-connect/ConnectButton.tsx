// ConnectButton.tsx
"use client";

import { useContext } from "react";
import { AppContext } from "@/lib/providers/AppContextProvider";
import { truncateAddress } from "@/lib/utils/format";
import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ConnectButton() {
  const { data, connectWallet } = useContext(AppContext);

  return (
    <div className="flex gap-1 items-center px-2 uppercase">
      <span>
        <FontAwesomeIcon icon={faWallet} />
      </span>
      {data.isWalletConnected && data.userAddress ? (
        <span className="text-xs px-3 py-1 rounded-lg font-semibold">
          {truncateAddress(data.userAddress)}
        </span>
      ) : (
        <span
          className="text-xs py-1 rounded-lg font-semibold cursor-pointer"
          onClick={connectWallet}
        >
          connect wallet
        </span>
      )}
    </div>
  );
}