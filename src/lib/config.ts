"use client";

import { http, createStorage, cookieStorage } from "wagmi";
import { sepolia, bscTestnet, blastSepolia, anvil } from "wagmi/chains";
import { baseSepolia } from "wagmi/chains";
import { Chain, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { unichain_sepolia } from "./unichain.config";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;
console.log("projectId:", projectId);
const supportedChains: Chain[] = [
  sepolia,
  bscTestnet,
  blastSepolia,
  anvil,
  unichain_sepolia,
  baseSepolia,
];
console.log(`http://${process.env.NEXT_PUBLIC_ANVIL_IP}:8545`);

export const config = getDefaultConfig({
  appName: "frontend",
  projectId: projectId,
  chains: supportedChains as any,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  syncConnectedChain: true,
  //transports: supportedChains.reduce((obj, chain) => ({ ...obj, [chain.id]: http() }), {})
  transports: {
    [sepolia.id]: http(),
    [bscTestnet.id]: http(),
    [blastSepolia.id]: http(),
    [baseSepolia.id]: http(),
    [anvil.id]: http(),
    [unichain_sepolia.id]: http(
      `https://unichain-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`
    ),
  },
});
