import PublicLayout from "@/components/layout/PublicLayout";

export default function Terms() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-4 py-20 prose prose-slate">
        <h1 className="text-4xl font-serif font-bold mb-4">Terms and Conditions</h1>
        <p className="text-muted-foreground">Last updated: January 1, 2026</p>

        <h2>1. Services</h2>
        <p>OneWorld Van Lines provides moving and logistics services in Texas and surrounding states. All services are subject to availability and must be confirmed by a written or verbal agreement with our team.</p>

        <h2>2. Estimates</h2>
        <p>Price estimates provided online or by phone are non-binding estimates based on the information provided. Final pricing is confirmed after a pre-move inventory review. Binding quotes are available on request.</p>

        <h2>3. Payment</h2>
        <p>Payment is due on or before delivery of your belongings. We accept cash, Zelle, ACH, and credit/debit cards. Failure to make payment may result in storage of belongings at the customer's expense.</p>

        <h2>4. Liability and Valuation</h2>
        <p>All moves include basic valuation coverage at $0.60 per pound per article. Full replacement value protection is available for an additional fee. OneWorld Van Lines is not liable for items not disclosed prior to the move, pre-existing damage, or items packed by the owner.</p>

        <h2>5. Cancellation</h2>
        <p>Cancellations made more than 48 hours before the scheduled move are free of charge. Cancellations within 48 hours may incur a fee. No-shows are subject to a cancellation fee equal to 2 hours of labor.</p>

        <h2>6. Items We Cannot Move</h2>
        <p>We do not transport hazardous materials, flammable liquids, propane tanks, live plants, perishable food, illegal items, or currency. We reserve the right to refuse any item that poses a safety risk.</p>

        <h2>7. Governing Law</h2>
        <p>These terms are governed by the laws of the State of Texas. Any disputes shall be resolved in the courts of Dallas County, Texas.</p>

        <h2>8. Contact</h2>
        <p>Questions? Contact us at info@oneworldvanlines.com or (660) 667-7770.</p>
      </div>
    </PublicLayout>
  );
}
