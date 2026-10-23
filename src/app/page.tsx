import { Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { Badge } from "@/components/ui/badge";
import Profile from "./components/profile";

type HomeProps = {
  searchParams?: {
    tab?: string;
  };
};

export default function Home({ searchParams }: HomeProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="outline"
              className="mb-5 gap-1.5 border-primary/30 bg-primary/10 px-3 py-1 text-primary"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Somtam Coin
            </Badge>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
              Mint, redeem, and move{" "}
              <span className="hero-glow bg-gradient-to-r from-primary via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                Somtam
              </span>{" "}
              with ease.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-balance text-sm leading-relaxed text-muted-foreground sm:text-base">
              One dashboard for your collateral, balances, and token transfers.
            </p>
          </div>

          <div className="mx-auto mt-10 w-full max-w-4xl">
            <Profile />
          </div>

          <div className="mx-auto mt-10 w-full max-w-2xl">
            <DashboardTabs defaultTab={searchParams?.tab} />
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-6 text-center text-xs text-muted-foreground">
        Somtam Dapp · Built on Unichain
      </footer>
    </div>
  );
}
