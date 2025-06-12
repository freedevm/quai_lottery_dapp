import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Investors | QUAI Lottery",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}
