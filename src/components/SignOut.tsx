import { lucia } from "@/server/auth";
import { validateRequest } from "@/server/auth/validate-request";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";

export default async function SignOutButton({
  className,
}: {
  className?: string;
}) {
  return (
    <form action={logout}>
      <Button className={className}>Sign Out</Button>
    </form>
  );
}

async function logout() {
  "use server";
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/login");
}
