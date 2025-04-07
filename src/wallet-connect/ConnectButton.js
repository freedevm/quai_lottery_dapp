import { truncateAddress } from "@/lib/utils/format";
import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";

export default function ConnectButton() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();

  return (
    <>
      {isConnected ? (
        <div className="flex gap-2 items-center px-2 text-green-500">
          <span style={{ color: "#bcff00" }}>
            <FontAwesomeIcon icon={faWallet} />
          </span>
          <span
            className="text-xs px-3 py-0 rounded-lg font-semibold text-[#ddd]"
            onClick={() => open({ view: "Account" })}
          >
            {truncateAddress(address)}
          </span>
        </div>
      ) : (
        <button
          onClick={() => open()}
          className="bg-[--primary-color] text-black text-xs px-3 py-1 font-semibold"
        >
          Connect Wallet
        </button>
      )}
    </>
  );
}
