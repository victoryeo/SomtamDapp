"use client";

import { useState } from "react";
import {
  Droplets,
  LayoutDashboard,
  PlusCircle,
  RefreshCcw,
  Send,
} from "lucide-react";
import { FieldDashboard } from "@/lib/ui/fieldDashboard";
import { FieldMint } from "@/lib/ui/fieldMint";
import { FieldRedeem } from "@/lib/ui/fieldRedeem";
import { FieldFaucet } from "@/lib/ui/fieldFaucet";
import { FieldTransfer } from "@/lib/ui/fieldTransfer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  { value: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { value: "mint", label: "Mint", icon: PlusCircle },
  { value: "redeem", label: "Redeem", icon: RefreshCcw },
  { value: "faucet", label: "Faucet", icon: Droplets },
  { value: "transfer", label: "Transfer", icon: Send },
] as const;

type TabValue = (typeof tabs)[number]["value"];

const isTabValue = (value?: string): value is TabValue =>
  tabs.some((tab) => tab.value === value);

type DashboardTabsProps = {
  defaultTab?: string;
};

export function DashboardTabs({ defaultTab }: DashboardTabsProps) {
  const initialTab: TabValue = isTabValue(defaultTab)
    ? defaultTab
    : "dashboard";
  const [value, setValue] = useState<TabValue>(initialTab);

  return (
    <Tabs
      value={value}
      onValueChange={(next) => setValue(next as TabValue)}
      className="w-full"
    >
      <TabsList className="grid h-auto w-full grid-cols-5 gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="gap-2 rounded-lg px-2 py-2 text-xs text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow sm:text-sm"
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sr-only sm:hidden">{tab.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      <div className="mt-6">
        <TabsContent
          value="dashboard"
          className="animate-fade-in focus-visible:outline-none"
        >
          <FieldDashboard />
        </TabsContent>
        <TabsContent
          value="mint"
          className="animate-fade-in focus-visible:outline-none"
        >
          <FieldMint />
        </TabsContent>
        <TabsContent
          value="redeem"
          className="animate-fade-in focus-visible:outline-none"
        >
          <FieldRedeem />
        </TabsContent>
        <TabsContent
          value="faucet"
          className="animate-fade-in focus-visible:outline-none"
        >
          <FieldFaucet />
        </TabsContent>
        <TabsContent
          value="transfer"
          className="animate-fade-in focus-visible:outline-none"
        >
          <FieldTransfer />
        </TabsContent>
      </div>
    </Tabs>
  );
}
