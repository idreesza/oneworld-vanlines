import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const documentsTable = pgTable("documents", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id"),
  jobId: integer("job_id"),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  documentType: text("document_type").notNull().default("other"),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const insertDocumentSchema = createInsertSchema(documentsTable).omit({ id: true, uploadedAt: true });
export type Document = typeof documentsTable.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
