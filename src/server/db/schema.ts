// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  pgEnum,
  pgTableCreator,
  smallserial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `go-schedule-tracker_${name}`,
);

export const userTable = createTable("user", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  password_hash: text("password_hash").notNull(),
});

export const sessionTable = createTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const courseEnum = pgEnum("course", ["CSE", "DA"]);

export const scheduleTable = createTable("schedule", {
  id: smallserial("id").primaryKey(),
  course: courseEnum("course").notNull().default("CSE"),
  subjectName: text("subject_name").notNull(),
  workToDo: text("duration").notNull(),
  description: text("description").notNull(),
  date: timestamp("date", {
    withTimezone: false,
    mode: "string",
  }).notNull(),
});
