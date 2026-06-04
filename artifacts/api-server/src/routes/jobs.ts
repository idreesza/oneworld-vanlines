import { Router } from "express";
import { db } from "@workspace/db";
import { jobsTable, leadsTable, workersTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import { CreateJobBody, ListJobsQueryParams, GetJobParams, UpdateJobStatusBody } from "@workspace/api-zod";

const router = Router();

router.get("/jobs", async (req, res) => {
  try {
    const query = ListJobsQueryParams.parse(req.query);
    const conditions = [];
    if (query.status) conditions.push(eq(jobsTable.status, query.status));
    if (query.workerId) conditions.push(eq(jobsTable.workerId, query.workerId));

    const jobs = await db.select().from(jobsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(jobsTable.createdAt));

    const enriched = await Promise.all(jobs.map(async (job) => {
      const worker = job.workerId ? (await db.select().from(workersTable).where(eq(workersTable.id, job.workerId)))[0] : null;
      return { ...job, workerName: worker?.name ?? null, priceLow: job.priceLow ? Number(job.priceLow) : null, priceHigh: job.priceHigh ? Number(job.priceHigh) : null };
    }));

    return res.json(enriched);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/jobs", async (req, res) => {
  try {
    const body = CreateJobBody.parse(req.body);
    const [lead] = await db.select().from(leadsTable).where(eq(leadsTable.id, body.leadId));
    if (!lead) return res.status(404).json({ error: "Lead not found" });

    const [job] = await db.insert(jobsTable).values({
      leadId: body.leadId,
      workerId: body.workerId,
      customerName: lead.fullName,
      customerPhone: lead.phone,
      pickupAddress: lead.moveFromAddress ?? "",
      dropoffAddress: lead.moveToAddress ?? "",
      moveDate: body.moveDate ?? lead.moveDate ?? new Date().toISOString().split("T")[0],
      status: "scheduled",
      notes: body.notes,
      priceLow: lead.priceLow,
      priceHigh: lead.priceHigh,
    }).returning();

    const worker = body.workerId ? (await db.select().from(workersTable).where(eq(workersTable.id, body.workerId)))[0] : null;
    return res.status(201).json({ ...job, workerName: worker?.name ?? null, priceLow: job.priceLow ? Number(job.priceLow) : null, priceHigh: job.priceHigh ? Number(job.priceHigh) : null });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/jobs/:id", async (req, res) => {
  try {
    const params = GetJobParams.parse({ id: Number(req.params.id) });
    const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, params.id));
    if (!job) return res.status(404).json({ error: "Job not found" });
    const worker = job.workerId ? (await db.select().from(workersTable).where(eq(workersTable.id, job.workerId)))[0] : null;
    return res.json({ ...job, workerName: worker?.name ?? null, priceLow: job.priceLow ? Number(job.priceLow) : null, priceHigh: job.priceHigh ? Number(job.priceHigh) : null });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/jobs/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const body = UpdateJobStatusBody.parse(req.body);
    const [job] = await db.update(jobsTable)
      .set({ status: body.status, notes: body.notes, updatedAt: new Date() })
      .where(eq(jobsTable.id, id))
      .returning();
    if (!job) return res.status(404).json({ error: "Job not found" });
    const worker = job.workerId ? (await db.select().from(workersTable).where(eq(workersTable.id, job.workerId)))[0] : null;
    return res.json({ ...job, workerName: worker?.name ?? null, priceLow: job.priceLow ? Number(job.priceLow) : null, priceHigh: job.priceHigh ? Number(job.priceHigh) : null });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
