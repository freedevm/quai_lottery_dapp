import "react-toastify/dist/ReactToastify.css";

import "./globals.css";

import type { Metadata } from "next";
import { headers } from "next/headers";
import { ToastContainer } from "react-toastify";
import { cookieToInitialState } from "wagmi";

import { AppContextProvider } from "@/lib/providers/AppContextProvider";
import { poppins } from "@/lib/utils/fonts";
import Web3ModalProvider from "@/wallet-connect/Web3ModalProvider";
import { config } from "@/wallet-connect/config";
import { NextUIProvider } from "@nextui-org/react";

export const metadata: Metadata = {
  title: "Ethereum Lottery - Win Big with Crypto Jackpots",
  description:
    "Join Ethereum Lottery for a chance to win massive crypto jackpots. Secure, transparent, and powered by blockchain technology.",
  keywords: ["Ethereum", "lottery", "jackpot", "Ethereum lottery", "crypto lottery"],
  openGraph: {
    title: "Ethereum Lottery - Win Big with Crypto Jackpots",
    description:
      "Participate in Ethereum Lottery to win huge crypto prizes with secure blockchain technology.",
    url: "https://ethereumlottery.org/", // Replace with your domain
    siteName: "Ethereum Lottery",
    images: [
      {
        url: "https://ipfs.io/ipfs/bafybeieo32jaqudin6s3sdahoikwllon2t5h62ueyfrcg7ceuz6mxjbpd4", // Replace with a relevant image URL
        width: 1200,
        height: 500,
        alt: "Ethereum Lottery Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));

  return (
    <html lang="en">
      <body className={poppins.className}>
        <Web3ModalProvider initialState={initialState}>
          <NextUIProvider>
            <AppContextProvider>
              {children}
            </AppContextProvider>
          </NextUIProvider>
        </Web3ModalProvider>
        <ToastContainer theme="dark" />
      </body>
    </html>
  );
}
