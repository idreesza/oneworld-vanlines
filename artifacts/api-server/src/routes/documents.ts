import { Router } from "express";
import { db } from "@workspace/db";
import { documentsTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import { CreateDocumentBody, ListDocumentsQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/documents", async (req, res) => {
  try {
    const query = ListDocumentsQueryParams.parse(req.query);
    const conditions = [];
    if (query.leadId) conditions.push(eq(documentsTable.leadId, query.leadId));
    if (query.jobId) conditions.push(eq(documentsTable.jobId, query.jobId));
    const docs = await db.select().from(documentsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(documentsTable.uploadedAt));
    return res.json(docs);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/documents", async (req, res) => {
  try {
    const body = CreateDocumentBody.parse(req.body);
    const [doc] = await db.insert(documentsTable).values(body).returning();
    return res.status(201).json(doc);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/documents/:id", async (req, res) => {
  try {
    await db.delete(documentsTable).where(eq(documentsTable.id, Number(req.params.id)));
    return res.status(204).send();
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
