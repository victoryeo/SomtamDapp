"use client";

import {
  useConnectModal,
  useAccountModal,
  useChainModal,
} from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { ChevronDown, Loader2, Network, Wallet } from "lucide-react";
import { emojiAvatarForAddress } from "@/lib/emojiAvatarForAddress";
import { middleEllipsis } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const ConnectBtn = () => {
  const { isConnecting, address, isConnected, chain } = useAccount();
  const { color: backgroundColor, emoji } = emojiAvatarForAddress(
    address ?? ""
  );

  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const { disconnect } = useDisconnect();

  if (!isConnected) {
    return (
      <Button
        size="lg"
        onClick={async () => {
          if (isConnected) {
            disconnect();
          }
          openConnectModal?.();
        }}
        disabled={isConnecting}
        className="gap-2 rounded-full"
      >
        {isConnecting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Wallet className="h-4 w-4" />
        )}
        {isConnecting ? "Connecting..." : "Connect wallet"}
      </Button>
    );
  }

  if (isConnected && !chain) {
    return (
      <Button
        variant="destructive"
        onClick={openChainModal}
        className="rounded-full"
      >
        Wrong network
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={openChainModal}
        className="hidden gap-2 rounded-full border-white/10 bg-white/[0.03] sm:flex"
      >
        <Network className="h-4 w-4 text-primary" />
        {chain?.name}
      </Button>
      <button
        type="button"
        onClick={openAccountModal}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1 pl-1 pr-3 text-sm font-medium transition-colors hover:bg-white/[0.06] focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <Avatar className="h-7 w-7 ring-1 ring-white/10">
          <AvatarFallback
            className="text-sm"
            style={{ backgroundColor }}
          >
            {emoji}
          </AvatarFallback>
        </Avatar>
        <span className="hidden sm:block">
          {middleEllipsis(address as string, 5)}
        </span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>
    </div>
  );
};
