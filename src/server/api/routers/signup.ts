import { cookies } from "next/headers";

import { publicProcedure } from "@/server/api/trpc";

import { lucia } from "@/server/auth";
import { hash } from "@node-rs/argon2";

import { userTable } from "@/server/db/schema";

import { LoginSchema } from "@/types";
import { generateIdFromEntropySize } from "lucia";

export const signupRoute = publicProcedure
  .input(LoginSchema)
  .mutation(async ({ input, ctx }) => {
    const { username, password } = input;

    const passwordHash = await hash(password, {
      // recommended minimum parameters
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    const userId = generateIdFromEntropySize(10); // 16 characters long

    await ctx.db.insert(userTable).values({
      id: userId,
      username: username,
      password_hash: passwordHash,
    });
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return {
      message: "Sign Up Successful",
    };
  });
