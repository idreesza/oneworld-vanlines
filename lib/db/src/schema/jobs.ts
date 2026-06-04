import { pgTable, serial, text, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const jobsTable = pgTable("jobs", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull(),
  workerId: integer("worker_id"),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  pickupAddress: text("pickup_address").notNull(),
  dropoffAddress: text("dropoff_address").notNull(),
  moveDate: text("move_date").notNull(),
  status: text("status").notNull().default("scheduled"),
  notes: text("notes"),
  priceLow: numeric("price_low"),
  priceHigh: numeric("price_high"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertJobSchema = createInsertSchema(jobsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type Job = typeof jobsTable.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
