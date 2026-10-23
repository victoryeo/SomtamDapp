import "@rainbow-me/rainbowkit/styles.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { AssetProvider } from "@/lib/providers/AssetContext";
import Providers from "./providers";
import "../css/globals.css";

export const metadata: Metadata = {
  title: "Somtam Dapp",
  description: "Mint, redeem, and move SomtamCoin from one clean dashboard.",
};

const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = headers().get("cookie");

  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers cookie={cookie}>
          <AssetProvider>{children}</AssetProvider>
        </Providers>
      </body>
    </html>
  );
}
