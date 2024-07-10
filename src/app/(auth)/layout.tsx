import { redirect } from "next/navigation";

import { validateRequest } from "@/server/auth/validate-request";

export default async function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user } = await validateRequest();
  if (!user) {
    redirect("/");
  }
  return <>{children}</>;
}
