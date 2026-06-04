import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const workersTable = pgTable("workers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  role: text("role").notNull().default("mover"),
  status: text("status").notNull().default("active"),
  clerkUserId: text("clerk_user_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWorkerSchema = createInsertSchema(workersTable).omit({ id: true, createdAt: true });
export type Worker = typeof workersTable.$inferSelect;
export type InsertWorker = z.infer<typeof insertWorkerSchema>;
