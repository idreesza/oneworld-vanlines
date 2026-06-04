import { useListPricingRules, getListPricingRulesQueryKey, useUpdatePricingRules } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

type PricingRules = {
  basePricePerCubicFoot: number;
  localMultiplierLow: number;
  localMultiplierHigh: number;
  midRangeMultiplierLow: number;
  midRangeMultiplierHigh: number;
  longDistanceMultiplierLow: number;
  longDistanceMultiplierHigh: number;
  packingServiceFlatFee: number;
  stairsSurchargePercent: number;
  flexibleDiscountPercent: number;
  boxCubicFeet: number;
  bedroomCubicFeetEstimates: Record<string, number>;
};

const FIELDS: Array<{ key: keyof Omit<PricingRules, "bedroomCubicFeetEstimates">; label: string; desc: string }> = [
  { key: "basePricePerCubicFoot", label: "Base Price / Cubic Foot ($)", desc: "Starting price per cubic foot before multipliers" },
  { key: "localMultiplierLow", label: "Local Rate Low", desc: "Low-end multiplier for local moves" },
  { key: "localMultiplierHigh", label: "Local Rate High", desc: "High-end multiplier for local moves" },
  { key: "midRangeMultiplierLow", label: "Mid-Range Rate Low", desc: "Low-end multiplier for mid-range moves" },
  { key: "midRangeMultiplierHigh", label: "Mid-Range Rate High", desc: "High-end multiplier for mid-range moves" },
  { key: "longDistanceMultiplierLow", label: "Long Distance Low", desc: "Low-end multiplier for long-distance moves" },
  { key: "longDistanceMultiplierHigh", label: "Long Distance High", desc: "High-end multiplier for long-distance moves" },
  { key: "packingServiceFlatFee", label: "Packing Service Fee ($)", desc: "Flat fee added for full packing service" },
  { key: "stairsSurchargePercent", label: "Stairs Surcharge (%)", desc: "Percentage increase for stairs access" },
  { key: "flexibleDiscountPercent", label: "Flexible Date Discount (%)", desc: "Percentage discount for flexible date moves" },
  { key: "boxCubicFeet", label: "Box Cubic Feet", desc: "Cubic feet estimated per box" },
];

export default function PricingRules() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: rules, isLoading } = useListPricingRules({ query: { queryKey: getListPricingRulesQueryKey() } });
  const updateRules = useUpdatePricingRules();
  const [form, setForm] = useState<PricingRules | null>(null);

  useEffect(() => { if (rules) setForm(rules as PricingRules); }, [rules]);

  const handleSave = () => {
    if (!form) return;
    updateRules.mutate({ data: form as Parameters<typeof updateRules.mutate>[0]["data"] }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListPricingRulesQueryKey() }); toast({ title: "Pricing updated successfully" }); },
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold">Pricing Rules</h2>
          <Button onClick={handleSave} disabled={updateRules.isPending || !form}>{updateRules.isPending ? "Saving..." : "Save Changes"}</Button>
        </div>

        {isLoading || !form ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[...Array(8)].map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}</div>
        ) : (
          <>
            <Card>
              <CardHeader><CardTitle>Pricing Multipliers & Fees</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {FIELDS.map(field => (
                    <div key={field.key}>
                      <label className="text-sm font-medium mb-1 block">{field.label}</label>
                      <p className="text-xs text-muted-foreground mb-2">{field.desc}</p>
                      <Input
                        type="number"
                        step="0.01"
                        value={form[field.key] as number}
                        onChange={e => setForm(f => f ? { ...f, [field.key]: Number(e.target.value) } : f)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Bedroom Cubic Feet Estimates</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(form.bedroomCubicFeetEstimates).map(([beds, cf]) => (
                    <div key={beds}>
                      <label className="text-sm font-medium mb-1 block">{beds === "0" ? "Studio" : `${beds} Bedroom${beds !== "1" ? "s" : ""}`}</label>
                      <Input
                        type="number"
                        value={cf}
                        onChange={e => setForm(f => f ? { ...f, bedroomCubicFeetEstimates: { ...f.bedroomCubicFeetEstimates, [beds]: Number(e.target.value) } } : f)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
