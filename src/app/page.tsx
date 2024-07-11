"use client";

import { Suspense } from "react";
import HomePage from "./Home";

export default function Home() {
  return (
    <>
      <Suspense>
        <HomePage />
      </Suspense>
    </>
  );
}
