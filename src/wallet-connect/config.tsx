import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { cookieStorage, createStorage } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

import env from "@/lib/config/general";

// Get projectId at https://cloud.walletconnect.com
export const projectId = env.WALLET_CONNECT_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  name: "Ethereum Lottery",
  description: "Ethereum Mega Jackpot",
  url: env.WALLET_CONNECT_ORIGIN!, // origin must match your domain & subdomain
  icons: ["https://ipfs.io/ipfs/bafybeidm6vl3azmfjth4lbhpfctw7zxxwxg7dpt76vx5dvusmzquwc3gnm"],
};

// Create wagmiConfig
const chains = [mainnet, sepolia] as const;

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  // ...wagmiOptions // Optional - Override createConfig parameters
});
