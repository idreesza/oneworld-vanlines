import { pgTable, serial, text, integer, boolean, numeric, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const leadsTable = pgTable("leads", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  moveFromAddress: text("move_from_address"),
  moveToAddress: text("move_to_address"),
  moveFromZip: text("move_from_zip"),
  moveToZip: text("move_to_zip"),
  moveDate: text("move_date"),
  flexibleDates: boolean("flexible_dates").default(false),
  houseSize: text("house_size"),
  bedroomCount: integer("bedroom_count"),
  moveType: text("move_type"),
  additionalNotes: text("additional_notes"),
  status: text("status").notNull().default("new"),
  source: text("source").notNull().default("website_form"),
  assignedWorkerId: integer("assigned_worker_id"),
  estimatedCubicFeet: numeric("estimated_cubic_feet"),
  priceLow: numeric("price_low"),
  priceHigh: numeric("price_high"),
  paymentStatus: text("payment_status"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const leadNotesTable = pgTable("lead_notes", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLeadSchema = createInsertSchema(leadsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertLeadNoteSchema = createInsertSchema(leadNotesTable).omit({ id: true, createdAt: true });

export type Lead = typeof leadsTable.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type LeadNote = typeof leadNotesTable.$inferSelect;
export type InsertLeadNote = z.infer<typeof insertLeadNoteSchema>;
