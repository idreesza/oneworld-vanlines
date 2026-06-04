import { Router } from "express";
import { db } from "@workspace/db";
import { leadsTable, jobsTable, workersTable, estimatesTable } from "@workspace/db";
import { eq, desc, gte, count, sql } from "drizzle-orm";

const router = Router();

router.get("/dashboard/stats", async (req, res) => {
  try {
    const [{ totalLeads }] = await db.select({ totalLeads: count() }).from(leadsTable);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [{ newLeadsToday }] = await db.select({ newLeadsToday: count() }).from(leadsTable).where(gte(leadsTable.createdAt, today));
    const activeStatuses = ["scheduled", "on_the_way", "arrived", "picked_up", "in_transit"];
    const activeJobsResult = await db.select({ count: count() }).from(jobsTable)
      .where(sql`${jobsTable.status} = ANY(ARRAY['scheduled','on_the_way','arrived','picked_up','in_transit'])`);
    const [{ activeJobs }] = [{ activeJobs: Number(activeJobsResult[0]?.count ?? 0) }];
    const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
    const [{ completedJobsThisMonth }] = await db.select({ completedJobsThisMonth: count() }).from(jobsTable)
      .where(sql`${jobsTable.status} = 'completed' AND ${jobsTable.updatedAt} >= ${monthStart}`);
    const [{ totalWorkers }] = await db.select({ totalWorkers: count() }).from(workersTable).where(eq(workersTable.status, "active"));
    const completedLeads = await db.select({ priceHigh: leadsTable.priceHigh }).from(leadsTable).where(eq(leadsTable.status, "completed"));
    const revenueThisMonth = completedLeads.reduce((sum, l) => sum + (l.priceHigh ? Number(l.priceHigh) : 0), 0);
    const allLeads = await db.select({ status: leadsTable.status }).from(leadsTable);
    const converted = allLeads.filter(l => l.status === "completed" || l.status === "scheduled").length;
    const conversionRate = allLeads.length > 0 ? (converted / allLeads.length) * 100 : 0;
    const estimates = await db.select({ priceLow: estimatesTable.priceLow, priceHigh: estimatesTable.priceHigh }).from(estimatesTable);
    const avgEstimateValue = estimates.length > 0
      ? estimates.reduce((sum, e) => sum + ((Number(e.priceLow) + Number(e.priceHigh)) / 2), 0) / estimates.length
      : 0;

    return res.json({
      totalLeads: Number(totalLeads),
      newLeadsToday: Number(newLeadsToday),
      activeJobs,
      completedJobsThisMonth: Number(completedJobsThisMonth),
      totalWorkers: Number(totalWorkers),
      revenueThisMonth,
      conversionRate,
      avgEstimateValue,
    });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/dashboard/recent-leads", async (req, res) => {
  try {
    const limit = Number(req.query.limit ?? 10);
    const leads = await db.select().from(leadsTable).orderBy(desc(leadsTable.createdAt)).limit(limit);
    return res.json(leads.map(l => ({
      ...l,
      notes: [],
      priceLow: l.priceLow ? Number(l.priceLow) : null,
      priceHigh: l.priceHigh ? Number(l.priceHigh) : null,
      estimatedCubicFeet: l.estimatedCubicFeet ? Number(l.estimatedCubicFeet) : null,
    })));
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/dashboard/lead-sources", async (req, res) => {
  try {
    const leads = await db.select({ source: leadsTable.source }).from(leadsTable);
    const counts: Record<string, number> = {};
    leads.forEach(l => { counts[l.source] = (counts[l.source] ?? 0) + 1; });
    return res.json(Object.entries(counts).map(([source, count]) => ({ source, count })));
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/dashboard/job-status-breakdown", async (req, res) => {
  try {
    const jobs = await db.select({ status: jobsTable.status }).from(jobsTable);
    const counts: Record<string, number> = {};
    jobs.forEach(j => { counts[j.status] = (counts[j.status] ?? 0) + 1; });
    return res.json(Object.entries(counts).map(([status, count]) => ({ status, count })));
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
