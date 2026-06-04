import { Router } from "express";
import { db } from "@workspace/db";
import { estimatesTable, leadsTable, pricingRulesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { CreateEstimateBody, GetEstimateParams } from "@workspace/api-zod";

const router = Router();

const DEFAULT_PRICING = {
  basePricePerCubicFoot: 3.5,
  localMultiplierLow: 1.0,
  localMultiplierHigh: 1.4,
  midRangeMultiplierLow: 1.4,
  midRangeMultiplierHigh: 1.9,
  longDistanceMultiplierLow: 1.9,
  longDistanceMultiplierHigh: 2.8,
  packingServicePerCubicFoot: 1.0,
  unpackingServicePerCubicFoot: 1.0,
  stairsSurchargePercent: 0,
  flexibleDiscountPercent: 0,
  bedroomCubicFeetEstimates: { "0": 200, "1": 350, "2": 600, "3": 900, "4": 1300, "5+": 1800 },
  boxCubicFeet: 1.5,
};

async function getPricingRules() {
  const [row] = await db.select().from(pricingRulesTable).where(eq(pricingRulesTable.key, "default"));
  if (row && row.value) return row.value as typeof DEFAULT_PRICING;
  return DEFAULT_PRICING;
}

function calculateEstimate(body: { bedroomCount: number; boxCount: number; hasPackingService?: boolean; hasStairs?: boolean; distanceZone?: string; isFlexibleDates?: boolean; specialItems?: Array<{ cubicFeet: number; quantity: number }>; inventoryItems?: Array<{ cubicFeet: number; quantity: number }> }, pricing: typeof DEFAULT_PRICING) {
  const bedroomKey = body.bedroomCount >= 5 ? "5+" : String(body.bedroomCount);
  const bedroomCF = (pricing.bedroomCubicFeetEstimates as Record<string, number>)[bedroomKey] ?? 600;
  const boxCF = (body.boxCount ?? 0) * pricing.boxCubicFeet;
  const specialCF = (body.specialItems ?? []).reduce((sum, item) => sum + item.cubicFeet * item.quantity, 0);
  const inventoryCF = (body.inventoryItems ?? []).reduce((sum, item) => sum + item.cubicFeet * item.quantity, 0);
  const totalCubicFeet = bedroomCF + boxCF + specialCF + inventoryCF;

  const zone = body.distanceZone ?? "local";
  let lowMult = pricing.localMultiplierLow;
  let highMult = pricing.localMultiplierHigh;
  if (zone === "mid_range") { lowMult = pricing.midRangeMultiplierLow; highMult = pricing.midRangeMultiplierHigh; }
  if (zone === "long_distance") { lowMult = pricing.longDistanceMultiplierLow; highMult = pricing.longDistanceMultiplierHigh; }

  let priceLow = totalCubicFeet * pricing.basePricePerCubicFoot * lowMult;
  let priceHigh = totalCubicFeet * pricing.basePricePerCubicFoot * highMult;

  const packingCost = body.hasPackingService ? totalCubicFeet * (pricing.packingServicePerCubicFoot ?? 1.0) : 0;
  priceLow += packingCost;
  priceHigh += packingCost;

  const zoneLabel = zone === "local" ? "local" : zone === "mid_range" ? "mid-range" : "long-distance";
  const explanation = `Based on ${bedroomCF} cu ft for ${body.bedroomCount} bedroom(s), ${boxCF} cu ft for boxes, and ${(specialCF + inventoryCF).toFixed(0)} cu ft for inventory items. Total: ${totalCubicFeet.toFixed(0)} cu ft. Distance zone: ${zoneLabel}. Price range accounts for truck size, labor time, and date flexibility.`;

  return { totalCubicFeet, priceLow: Math.round(priceLow), priceHigh: Math.round(priceHigh), explanation };
}

router.post("/estimates", async (req, res) => {
  try {
    const body = CreateEstimateBody.parse(req.body);
    const pricing = await getPricingRules();
    const { totalCubicFeet, priceLow, priceHigh, explanation } = calculateEstimate(body, pricing);

    const [estimate] = await db.insert(estimatesTable).values({
      leadId: body.leadId,
      bedroomCount: body.bedroomCount,
      boxCount: body.boxCount ?? 0,
      hasPackingService: body.hasPackingService ?? false,
      hasStairs: body.hasStairs ?? false,
      distanceZone: body.distanceZone ?? "local",
      isFlexibleDates: body.isFlexibleDates ?? false,
      specialItems: (body.specialItems ?? []) as Array<{ name: string; cubicFeet: number; quantity: number }>,
      inventoryItems: (body.inventoryItems ?? []) as Array<{ name: string; category: string; cubicFeet: number; quantity: number }>,
      totalCubicFeet: totalCubicFeet.toString(),
      priceLow: priceLow.toString(),
      priceHigh: priceHigh.toString(),
      priceExplanation: explanation,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
    }).returning();

    if (body.leadId) {
      await db.update(leadsTable).set({
        estimatedCubicFeet: totalCubicFeet.toString(),
        priceLow: priceLow.toString(),
        priceHigh: priceHigh.toString(),
        source: "calculator",
        updatedAt: new Date(),
      }).where(eq(leadsTable.id, body.leadId));
    }

    return res.status(201).json({
      ...estimate,
      totalCubicFeet: Number(estimate.totalCubicFeet),
      priceLow: Number(estimate.priceLow),
      priceHigh: Number(estimate.priceHigh),
    });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/estimates", async (req, res) => {
  try {
    const estimates = await db.select().from(estimatesTable).orderBy(desc(estimatesTable.createdAt));
    return res.json(estimates.map(e => ({ ...e, totalCubicFeet: Number(e.totalCubicFeet), priceLow: Number(e.priceLow), priceHigh: Number(e.priceHigh) })));
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/estimates/:id", async (req, res) => {
  try {
    const params = GetEstimateParams.parse({ id: Number(req.params.id) });
    const [estimate] = await db.select().from(estimatesTable).where(eq(estimatesTable.id, params.id));
    if (!estimate) return res.status(404).json({ error: "Not found" });
    return res.json({ ...estimate, totalCubicFeet: Number(estimate.totalCubicFeet), priceLow: Number(estimate.priceLow), priceHigh: Number(estimate.priceHigh) });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
