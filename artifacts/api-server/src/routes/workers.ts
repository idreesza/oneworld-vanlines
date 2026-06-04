import { Router } from "express";
import { db } from "@workspace/db";
import { workersTable, jobsTable } from "@workspace/db";
import { eq, desc, count } from "drizzle-orm";
import { CreateWorkerBody, UpdateWorkerBody, GetWorkerParams, DeleteWorkerParams } from "@workspace/api-zod";

const router = Router();

router.get("/workers", async (req, res) => {
  try {
    const workers = await db.select().from(workersTable).orderBy(desc(workersTable.createdAt));
    const workersWithCounts = await Promise.all(
      workers.map(async (worker) => {
        const [result] = await db.select({ count: count() }).from(jobsTable).where(eq(jobsTable.workerId, worker.id));
        return { ...worker, assignedJobCount: Number(result?.count ?? 0) };
      })
    );
    return res.json(workersWithCounts);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/workers", async (req, res) => {
  try {
    const body = CreateWorkerBody.parse(req.body);
    const [worker] = await db.insert(workersTable).values(body).returning();
    return res.status(201).json({ ...worker, assignedJobCount: 0 });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/workers/:id", async (req, res) => {
  try {
    const params = GetWorkerParams.parse({ id: Number(req.params.id) });
    const [worker] = await db.select().from(workersTable).where(eq(workersTable.id, params.id));
    if (!worker) return res.status(404).json({ error: "Worker not found" });
    const [result] = await db.select({ count: count() }).from(jobsTable).where(eq(jobsTable.workerId, worker.id));
    return res.json({ ...worker, assignedJobCount: Number(result?.count ?? 0) });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/workers/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const body = UpdateWorkerBody.parse(req.body);
    const [worker] = await db.update(workersTable).set(body).where(eq(workersTable.id, id)).returning();
    if (!worker) return res.status(404).json({ error: "Worker not found" });
    const [result] = await db.select({ count: count() }).from(jobsTable).where(eq(jobsTable.workerId, worker.id));
    return res.json({ ...worker, assignedJobCount: Number(result?.count ?? 0) });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/workers/:id", async (req, res) => {
  try {
    const params = DeleteWorkerParams.parse({ id: Number(req.params.id) });
    await db.delete(workersTable).where(eq(workersTable.id, params.id));
    return res.status(204).send();
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/workers/:id/jobs", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const jobs = await db.select().from(jobsTable).where(eq(jobsTable.workerId, id)).orderBy(desc(jobsTable.createdAt));
    const worker = await db.select().from(workersTable).where(eq(workersTable.id, id));
    return res.json(jobs.map(j => ({
      ...j,
      workerName: worker[0]?.name ?? null,
      priceLow: j.priceLow ? Number(j.priceLow) : null,
      priceHigh: j.priceHigh ? Number(j.priceHigh) : null,
    })));
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
