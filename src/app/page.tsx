"use client";

import Image from "next/image";
import { ConnectBtn } from "./components/connectButton";
import Profile from "./components/profile";
import { Navbar } from "@/lib/ui/navbar";
import { FieldDashboard } from "@/lib/ui/fieldDashboard";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <ConnectBtn />
      </div>
      <Navbar/>
      <FieldDashboard />
      <Profile />
    </main>
  );
}