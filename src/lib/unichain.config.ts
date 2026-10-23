import { defineChain } from "viem";

export const unichain_sepolia = defineChain({
  id: 1301,
  name: "Unichain Sepolia Testnet",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://sepolia.unichain.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://sepolia.uniscan.xyz",
    },
  },
});
