import Link from "next/link";

import React from "react";

import { validateRequest } from "@/server/auth/validate-request";

import { MenuIcon } from "lucide-react";
import SignOutButton from "./SignOut";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export default async function Navbar() {
  const { user } = await validateRequest();

  return (
    <nav className="sticky top-0 flex w-full items-center justify-between border-b bg-background/80 p-4 px-4 md:px-6 lg:px-8 xl:px-12">
      <Link href="/" className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Schedule Tracker</h1>
      </Link>
      <div>
        {user ? (
          <>
            <div className="hidden items-center gap-2 md:flex">
              <>
                <Link href="/manage">
                  <Button variant="outline">Manage</Button>
                </Link>
                <SignOutButton />
              </>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-fit w-fit p-2 md:hidden"
                >
                  <MenuIcon />
                </Button>
              </SheetTrigger>
              <SheetContent className="flex flex-col gap-2">
                <Link href="/manage" className="mt-6 w-full">
                  <Button variant="outline" className="w-full">
                    Manage
                  </Button>
                </Link>
                <SignOutButton className="w-full" />
              </SheetContent>
            </Sheet>
          </>
        ) : null}
      </div>
    </nav>
  );
}
