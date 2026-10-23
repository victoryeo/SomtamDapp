import Link from "next/link";
import { Salad } from "lucide-react";
import { ConnectBtn } from "@/app/components/connectButton";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-lg focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30 transition-colors group-hover:bg-primary/20">
            <Salad className="h-5 w-5 text-primary" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Somtam<span className="text-primary">Dapp</span>
          </span>
        </Link>
        <ConnectBtn />
      </div>
    </header>
  );
}
