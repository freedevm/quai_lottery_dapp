import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage, injected } from "wagmi";
import env from "@/lib/config/general";

// Get projectId at https://cloud.walletconnect.com
export const projectId = env.WALLET_CONNECT_PROJECT_ID;
if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  name: "Quai Lottery",
  description: "Quai Mega Jackpot",
  url: env.WALLET_CONNECT_ORIGIN!,
  icons: ["https://ipfs.io/ipfs/bafybeiaq5jsajyddcvi5ym5kjjmgjgsyzhs3hmuuwgu2ufsz2nngypiaby"],
};

// Define Quai Network chains (example; adjust based on Quai docs)
const quaiCyprus1 = {
  id: 9, // Verify chain ID from Quai docs
  name: "Quai Cyprus-1",
  network: "quai-cyprus-1",
  nativeCurrency: { name: "Quai", symbol: "Quai", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.quai.network/cyprus1"] }, public: { http: ["https://rpc.quai.network/cyprus1"] } },
  blockExplorers: { default: { name: "Quai Explorer", url: "https://quaiscan.io" } },
} as const;

const orchard = {
  id: 15000, // Verify chain ID from Quai docs
  name: "Orchard Testnet",
  network: "quai-orchard-1",
  nativeCurrency: { name: "Quai", symbol: "Quai", decimals: 18 },
  rpcUrls: { default: { http: ["https://orchard.rpc.quai.network/cyprus1"] }, public: { http: ["https://orchard.rpc.quai.network/cyprus1"] } },
  blockExplorers: { default: { name: "Orchard Quai Explorer", url: "https://orchard.quaiscan.io/" } },
} as const;

const quaiChains = [quaiCyprus1, orchard] as const;

// Customize injected connector to prioritize Pelagus Wallet
const pelagusConnector = injected({
  target: () => ({
    id: "pelagus",
    name: "Pelagus Wallet",
    provider: window.pelagus, // Assumes Pelagus injects window.ethereum
  }),
  shimDisconnect: true,
});

// ✅ Main fix: use default config with custom connector
export const config = defaultWagmiConfig({
  chains: quaiChains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({ storage: cookieStorage }),
  connectors: [pelagusConnector],
});