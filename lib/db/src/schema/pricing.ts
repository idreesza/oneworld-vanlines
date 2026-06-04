import { pgTable, serial, text, numeric, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const pricingRulesTable = pgTable("pricing_rules", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: json("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPricingRuleSchema = createInsertSchema(pricingRulesTable).omit({ id: true, updatedAt: true });
export type PricingRule = typeof pricingRulesTable.$inferSelect;
export type InsertPricingRule = z.infer<typeof insertPricingRuleSchema>;
