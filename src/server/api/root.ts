import { loginRoute } from "@/server/api/routers/login";
import { scheduleRouter } from "@/server/api/routers/schedule";
import { signupRoute } from "@/server/api/routers/signup";

import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  schedule: scheduleRouter,
  login: loginRoute,
  signup: signupRoute,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export type AppRouterOutputTypes = inferRouterOutputs<AppRouter>;
export type AppRouterInputTypes = inferRouterInputs<AppRouter>;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
