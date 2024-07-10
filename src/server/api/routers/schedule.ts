import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { scheduleTable } from "@/server/db/schema";
import { CreateScheduleSchema } from "@/types";
import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import { eq } from "drizzle-orm";

export const scheduleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getSchedule: publicProcedure
    .input(
      z.object({
        date: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        const schedules = await ctx.db.query.scheduleTable.findMany({
          where: eq(scheduleTable.date, input.date),
        });
        return schedules;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
        });
      }
    }),
  getAllSchedules: protectedProcedure.query(async ({ ctx }) => {
    try {
      const schedules = await ctx.db.query.scheduleTable.findMany();
      schedules.sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix());
      return schedules;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
      });
    }
  }),
  deleteSchedule: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const schedule = await ctx.db.query.scheduleTable.findFirst({
          where: eq(scheduleTable.id, input.id),
        });
        if (!schedule) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Schedule not found",
          });
        }
        await ctx.db
          .delete(scheduleTable)
          .where(eq(scheduleTable.id, input.id));
        return { message: "Schedule deleted successfully" };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
        });
      }
    }),
  addSchedule: protectedProcedure
    .input(CreateScheduleSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.db.insert(scheduleTable).values({
          ...input,
        });
        return { message: "Schedule added successfully" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
        });
      }
    }),
});
