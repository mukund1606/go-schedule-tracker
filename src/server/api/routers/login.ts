import { cookies } from "next/headers";

import { publicProcedure } from "@/server/api/trpc";

import { lucia } from "@/server/auth";
import { verify } from "@node-rs/argon2";

import { userTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";

import { LoginSchema } from "@/types";
import { TRPCError } from "@trpc/server";

export const loginRoute = publicProcedure
  .input(LoginSchema)
  .mutation(async ({ input, ctx }) => {
    const { username, password } = input;

    const existingUser = await ctx.db.query.userTable.findFirst({
      where: eq(userTable.username, username.toLowerCase()),
    });
    if (!existingUser) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Incorrect username or password",
      });
    }

    const validPassword = await verify(existingUser.password_hash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    if (!validPassword) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Incorrect username or password",
      });
    }
    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return {
      message: "Login successful",
    };
  });
