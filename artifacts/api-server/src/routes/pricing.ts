import { Router } from "express";
import { db } from "@workspace/db";
import { pricingRulesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const DEFAULT_PRICING = {
  basePricePerCubicFoot: 3.5,
  localMultiplierLow: 1.0,
  localMultiplierHigh: 1.4,
  midRangeMultiplierLow: 1.4,
  midRangeMultiplierHigh: 1.9,
  longDistanceMultiplierLow: 1.9,
  longDistanceMultiplierHigh: 2.8,
  packingServiceFlatFee: 450,
  stairsSurchargePercent: 10,
  flexibleDiscountPercent: 5,
  bedroomCubicFeetEstimates: { "1": 300, "2": 600, "3": 900, "4": 1200, "5+": 1600 },
  boxCubicFeet: 1.5,
};

router.get("/pricing/rules", async (req, res) => {
  try {
    const [row] = await db.select().from(pricingRulesTable).where(eq(pricingRulesTable.key, "default"));
    return res.json(row?.value ?? DEFAULT_PRICING);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/pricing/rules", async (req, res) => {
  try {
    const rules = req.body;
    await db.insert(pricingRulesTable)
      .values({ key: "default", value: rules })
      .onConflictDoUpdate({ target: pricingRulesTable.key, set: { value: rules, updatedAt: new Date() } });
    return res.json(rules);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
