import { Router } from "express";
import { db } from "@workspace/db";
import { faqsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { CreateFaqBody, ListFaqsQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/faqs", async (req, res) => {
  try {
    const query = ListFaqsQueryParams.parse(req.query);
    const faqs = await db.select().from(faqsTable)
      .where(query.category ? eq(faqsTable.category, query.category) : undefined)
      .orderBy(asc(faqsTable.sortOrder), asc(faqsTable.id));
    return res.json(faqs);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/faqs", async (req, res) => {
  try {
    const body = CreateFaqBody.parse(req.body);
    const [faq] = await db.insert(faqsTable).values(body).returning();
    return res.status(201).json(faq);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/faqs/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const body = CreateFaqBody.parse(req.body);
    const [faq] = await db.update(faqsTable).set(body).where(eq(faqsTable.id, id)).returning();
    if (!faq) return res.status(404).json({ error: "FAQ not found" });
    return res.json(faq);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/faqs/:id", async (req, res) => {
  try {
    await db.delete(faqsTable).where(eq(faqsTable.id, Number(req.params.id)));
    return res.status(204).send();
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
