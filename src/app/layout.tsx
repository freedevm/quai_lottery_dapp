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
  title: "Eth Lottery",
  description: "Ethereum | Jackpot | Lottery",
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
