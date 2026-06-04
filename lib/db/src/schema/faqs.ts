import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const faqsTable = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFaqSchema = createInsertSchema(faqsTable).omit({ id: true, createdAt: true });
export type Faq = typeof faqsTable.$inferSelect;
export type InsertFaq = z.infer<typeof insertFaqSchema>;
