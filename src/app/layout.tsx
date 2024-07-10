import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";

import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { HydrateClient } from "@/trpc/server";

import { cn } from "@/lib/utils";

import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Go Schedule Tracker",
  manifest: "/manifest.json",
  authors: [{ name: "Mukund Mittal", url: "https://www.mukund.page" }],
  creator: "Mukund Mittal",
  icons: [
    {
      rel: "icon",
      url: "/logo.png",
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "dark min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <TRPCReactProvider>
          <HydrateClient>
            <Navbar />
            <div className="flex min-h-[calc(100dvh-78px)] w-full flex-col gap-2">
              {children}
            </div>
            <Toaster richColors closeButton />
          </HydrateClient>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
