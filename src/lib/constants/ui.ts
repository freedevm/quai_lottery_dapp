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
    title: `Card Mint | ${appTitle}`,
    path: "/NFTMint",
  },
};

export const cards = [
  { name: "diamond", price: 0.5, ticket: 60 },
  { name: "platinum", price: 0.4, ticket: 40 },
  { name: "gold", price: 0.3, ticket: 30 },
  { name: "silver", price: 0.2, ticket: 20 },
  { name: "bronze", price: 0.1, ticket: 10 },
  { name: "iron", price: 0.05, ticket: 5 },
]
