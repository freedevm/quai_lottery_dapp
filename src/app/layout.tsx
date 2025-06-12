// App.tsx
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import { AppContextProvider } from "@/lib/providers/AppContextProvider";
import { poppins } from "@/lib/utils/fonts";
import { NextUIProvider } from "@nextui-org/react";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "Quai Lottery - Win Big with Crypto Jackpots",
  description:
    "Join Quai Lottery for a chance to win massive crypto jackpots. Secure, transparent, and powered by blockchain technology.",
  keywords: ["Quai", "lottery", "jackpot", "Quai lottery", "crypto lottery"],
  openGraph: {
    title: "Quai Lottery - Win Big with Crypto Jackpots",
    description:
      "Participate in Quai Lottery to win huge crypto prizes with secure blockchain technology.",
    url: "https://Quailottery.org/", // Update with your domain
    siteName: "Quai Lottery",
    images: [
      {
        url: "https://ipfs.io/ipfs/bafkreihdvaliveg2nxk253h4ydpkpp5oo332lhzpdj53qzzsjefxui4pue",
        width: 1200,
        height: 500,
        alt: "Quai Lottery Banner",
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
  return (
    <html lang="en">
      <body className={poppins.className}>
        <NextUIProvider>
          <AppContextProvider>
            {children}
            {/* {process.env.NEXT_PUBLIC_GA_ID && (
              <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
            )} */}
          </AppContextProvider>
        </NextUIProvider>
        <ToastContainer theme="dark" />
      </body>
    </html>
  );
}