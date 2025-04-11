import { BasicSearchParams, PageData, PageName } from "../types/ui";

export const appTitle = "ETH Lottery";

export const pages: { [key in PageName]: PageData } = {
  home: {
    name: "home",
    title: `Home | ${appTitle}`,
    path: "/Home",
  },
  nftMint: {
    name: "nftMint",
    title: `NFTMint | ${appTitle}`,
    path: "/NFTMint",
  },
  nftBoost: {
    name: "nftBoost",
    title: `NFTBoost | ${appTitle}`,
    path: "/NFTBoost",
  },
  jackpot: {
    name: "jackpot",
    title: `Jackpot | ${appTitle}`,
    path: "/Jackpot",
  },
};

export const cards = [
  { name: "diamond", price: 0.5 },
  { name: "platinum", price: 0.4 },
  { name: "gold", price: 0.3 },
  { name: "silver", price: 0.2 },
  { name: "bronze", price: 0.1 },
  { name: "iron", price: 0.05 },
]
