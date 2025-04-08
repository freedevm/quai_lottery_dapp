import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { cookieStorage, createStorage } from "wagmi";
import { optimism, arbitrum } from "wagmi/chains";

import env from "@/lib/config/general";

// Get projectId at https://cloud.walletconnect.com
export const projectId = env.WALLET_CONNECT_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  name: "Sports Gambit",
  description: "Sports Gambit",
  url: env.WALLET_CONNECT_ORIGIN!, // origin must match your domain & subdomain
  icons: ["https://sportsgambit.io/wallet-icon.png"],
};

// Create wagmiConfig
const chains = [optimism, arbitrum] as const;
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
