"use client";

import { useAccount, useBalance, useEnsName } from "wagmi";
import { AtSign, Coins, Network, Wallet } from "lucide-react";
import { formatUnits } from "viem";
import { middleEllipsis } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const statCardClass =
  "glass-card overflow-hidden transition-colors hover:border-primary/30";

export default function Profile() {
  const { address, chain, isConnecting } = useAccount();

  const { data, isLoading: isBalanceLoading } = useBalance({
    address,
  });

  const { data: ens, isLoading: isEnsLoading } = useEnsName({
    address,
  });

  return (
    <div className="grid w-full grid-cols-2 gap-3 lg:grid-cols-4">
      <Card className={statCardClass}>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Wallet className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Wallet
            </p>
            {address ? (
              <p className="truncate text-sm font-medium">
                {middleEllipsis(address, 6)}
              </p>
            ) : isConnecting ? (
              <Skeleton className="mt-1 h-4 w-20" />
            ) : (
              <p className="truncate text-sm font-medium text-muted-foreground">
                Not connected
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className={statCardClass}>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Network className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Network
            </p>
            <p className="truncate text-sm font-medium">
              {chain?.name ?? "Not connected"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className={statCardClass}>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-300">
            <Coins className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              ETH Balance
            </p>
            {isBalanceLoading ? (
              <Skeleton className="mt-1 h-4 w-16" />
            ) : (
              <p className="truncate text-sm font-medium">
                {data
                  ? `${Number(formatUnits(data.value, data.decimals)).toFixed(4)} ${data.symbol}`
                  : "--"}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className={statCardClass}>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-400/10 text-violet-300">
            <AtSign className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              ENS Name
            </p>
            {isEnsLoading ? (
              <Skeleton className="mt-1 h-4 w-20" />
            ) : (
              <p className="truncate text-sm font-medium">{ens || "--"}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
