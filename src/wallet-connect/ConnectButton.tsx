// ConnectButton.tsx
"use client";

import { useContext, useState } from "react";
import { AppContext } from "@/lib/providers/AppContextProvider";
import { truncateAddress } from "@/lib/utils/format";
import { faWallet, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ConnectButton() {
  const { data, connectWallet, disconnectWallet } = useContext(AppContext);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex gap-1 items-center px-2 uppercase">
      <span>
        <FontAwesomeIcon icon={faWallet} />
      </span>
      {data.isWalletConnected && data.userAddress ? (
        <div
          className="relative flex items-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span className="text-xs px-3 py-1 rounded-lg font-semibold">
            {truncateAddress(data.userAddress)}
          </span>
          {isHovered && (
            <button
              className="ml-2 text-xs p-1 hover:text-red-500 transition-colors"
              onClick={disconnectWallet}
              title="Disconnect Wallet"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
            </button>
          )}
        </div>
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