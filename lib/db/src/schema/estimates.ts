import { pgTable, serial, integer, boolean, text, numeric, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const estimatesTable = pgTable("estimates", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id"),
  bedroomCount: integer("bedroom_count").notNull(),
  boxCount: integer("box_count").notNull().default(0),
  hasPackingService: boolean("has_packing_service").default(false),
  hasStairs: boolean("has_stairs").default(false),
  distanceZone: text("distance_zone").default("local"),
  isFlexibleDates: boolean("is_flexible_dates").default(false),
  specialItems: json("special_items").$type<Array<{ name: string; cubicFeet: number; quantity: number }>>().default([]),
  inventoryItems: json("inventory_items").$type<Array<{ name: string; category: string; cubicFeet: number; quantity: number }>>().default([]),
  totalCubicFeet: numeric("total_cubic_feet").notNull(),
  priceLow: numeric("price_low").notNull(),
  priceHigh: numeric("price_high").notNull(),
  priceExplanation: text("price_explanation").notNull(),
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEstimateSchema = createInsertSchema(estimatesTable).omit({ id: true, createdAt: true });
export type Estimate = typeof estimatesTable.$inferSelect;
export type InsertEstimate = z.infer<typeof insertEstimateSchema>;
