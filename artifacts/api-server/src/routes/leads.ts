import { Router } from "express";
import { db } from "@workspace/db";
import { leadsTable, leadNotesTable } from "@workspace/db";
import { eq, desc, ilike, and, or } from "drizzle-orm";
import {
  CreateLeadBody,
  UpdateLeadBody,
  AddLeadNoteBody,
  AssignLeadBody,
  ListLeadsQueryParams,
} from "@workspace/api-zod";
import { sendLeadNotification } from "../lib/email";

const router = Router();

router.get("/leads", async (req, res) => {
  try {
    const query = ListLeadsQueryParams.parse(req.query);
    const conditions = [];
    if (query.status) conditions.push(eq(leadsTable.status, query.status));
    if (query.source) conditions.push(eq(leadsTable.source, query.source));
    if (query.assignedWorkerId) conditions.push(eq(leadsTable.assignedWorkerId, query.assignedWorkerId));
    if (query.search) {
      conditions.push(
        or(
          ilike(leadsTable.fullName, `%${query.search}%`),
          ilike(leadsTable.email, `%${query.search}%`),
          ilike(leadsTable.phone, `%${query.search}%`),
        )
      );
    }

    const allLeads = await db.select().from(leadsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(leadsTable.createdAt));

    const total = allLeads.length;
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;
    const leads = allLeads.slice(offset, offset + limit);

    const leadsWithNotes = await Promise.all(
      leads.map(async (lead) => {
        const notes = await db.select().from(leadNotesTable)
          .where(eq(leadNotesTable.leadId, lead.id))
          .orderBy(desc(leadNotesTable.createdAt));
        return {
          ...lead,
          estimatedCubicFeet: lead.estimatedCubicFeet ? Number(lead.estimatedCubicFeet) : null,
          priceLow: lead.priceLow ? Number(lead.priceLow) : null,
          priceHigh: lead.priceHigh ? Number(lead.priceHigh) : null,
          notes,
        };
      })
    );

    return res.json({ leads: leadsWithNotes, total, page, limit });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/leads", async (req, res) => {
  try {
    const body = CreateLeadBody.parse(req.body);
    const [lead] = await db.insert(leadsTable).values({
      fullName: body.fullName,
      phone: body.phone,
      email: body.email,
      moveFromAddress: body.moveFromAddress,
      moveToAddress: body.moveToAddress,
      moveFromZip: body.moveFromZip,
      moveToZip: body.moveToZip,
      moveDate: body.moveDate,
      flexibleDates: body.flexibleDates,
      houseSize: body.houseSize,
      bedroomCount: body.bedroomCount,
      moveType: body.moveType,
      additionalNotes: body.additionalNotes,
      source: body.source ?? "website_form",
      status: "new",
      estimatedCubicFeet: body.estimatedCubicFeet?.toString(),
      priceLow: body.priceLow?.toString(),
      priceHigh: body.priceHigh?.toString(),
    }).returning();

    // Fire-and-forget email notification to sales team
    sendLeadNotification({
      fullName: lead.fullName,
      phone: lead.phone,
      email: lead.email,
      moveFromZip: lead.moveFromZip,
      moveToZip: lead.moveToZip,
      moveDate: lead.moveDate,
      bedroomCount: lead.bedroomCount,
      moveType: lead.moveType,
      additionalNotes: lead.additionalNotes,
      source: lead.source,
      estimatedCubicFeet: lead.estimatedCubicFeet ? Number(lead.estimatedCubicFeet) : null,
      priceLow: lead.priceLow ? Number(lead.priceLow) : null,
      priceHigh: lead.priceHigh ? Number(lead.priceHigh) : null,
    }).catch((err) => req.log.error({ err }, "Email notification failed silently"));

    return res.status(201).json({
      ...lead,
      notes: [],
      priceLow: lead.priceLow ? Number(lead.priceLow) : null,
      priceHigh: lead.priceHigh ? Number(lead.priceHigh) : null,
      estimatedCubicFeet: lead.estimatedCubicFeet ? Number(lead.estimatedCubicFeet) : null,
    });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/leads/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [lead] = await db.select().from(leadsTable).where(eq(leadsTable.id, id));
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    const notes = await db.select().from(leadNotesTable).where(eq(leadNotesTable.leadId, id)).orderBy(desc(leadNotesTable.createdAt));
    return res.json({ ...lead, notes, priceLow: lead.priceLow ? Number(lead.priceLow) : null, priceHigh: lead.priceHigh ? Number(lead.priceHigh) : null, estimatedCubicFeet: lead.estimatedCubicFeet ? Number(lead.estimatedCubicFeet) : null });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/leads/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const body = UpdateLeadBody.parse(req.body);
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (body.status !== undefined) updates.status = body.status;
    if (body.assignedWorkerId !== undefined) updates.assignedWorkerId = body.assignedWorkerId;
    if (body.paymentStatus !== undefined) updates.paymentStatus = body.paymentStatus;
    if (body.priceLow !== undefined) updates.priceLow = body.priceLow.toString();
    if (body.priceHigh !== undefined) updates.priceHigh = body.priceHigh.toString();
    if (body.moveDate !== undefined) updates.moveDate = body.moveDate;
    if (body.additionalNotes !== undefined) updates.additionalNotes = body.additionalNotes;
    const [lead] = await db.update(leadsTable).set(updates).where(eq(leadsTable.id, id)).returning();
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    const notes = await db.select().from(leadNotesTable).where(eq(leadNotesTable.leadId, id));
    return res.json({ ...lead, notes, priceLow: lead.priceLow ? Number(lead.priceLow) : null, priceHigh: lead.priceHigh ? Number(lead.priceHigh) : null, estimatedCubicFeet: lead.estimatedCubicFeet ? Number(lead.estimatedCubicFeet) : null });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/leads/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(leadNotesTable).where(eq(leadNotesTable.leadId, id));
    await db.delete(leadsTable).where(eq(leadsTable.id, id));
    return res.status(204).send();
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/leads/:id/notes", async (req, res) => {
  try {
    const leadId = Number(req.params.id);
    const body = AddLeadNoteBody.parse(req.body);
    const [note] = await db.insert(leadNotesTable).values({ leadId, content: body.content }).returning();
    return res.status(201).json(note);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/leads/:id/assign", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const body = AssignLeadBody.parse(req.body);
    const [lead] = await db.update(leadsTable)
      .set({ assignedWorkerId: body.workerId, updatedAt: new Date() })
      .where(eq(leadsTable.id, id))
      .returning();
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    const notes = await db.select().from(leadNotesTable).where(eq(leadNotesTable.leadId, id));
    return res.json({ ...lead, notes, priceLow: lead.priceLow ? Number(lead.priceLow) : null, priceHigh: lead.priceHigh ? Number(lead.priceHigh) : null, estimatedCubicFeet: lead.estimatedCubicFeet ? Number(lead.estimatedCubicFeet) : null });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
