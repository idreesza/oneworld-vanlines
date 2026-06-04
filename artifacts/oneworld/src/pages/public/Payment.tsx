import PublicLayout from "@/components/layout/PublicLayout";
import { CheckCircle2, Shield } from "lucide-react";

const methods = [
  { name: "Cash", desc: "Always accepted. No processing fees." },
  { name: "Zelle", desc: "Instant bank transfer. No fees, highly recommended." },
  { name: "ACH / Bank Transfer", desc: "Direct bank-to-bank transfer for large payments." },
  { name: "Credit / Debit Card", desc: "Visa, Mastercard, Amex, Discover. Processing fee may apply. Requires ID verification." },
];

export default function Payment() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4">Payment Methods</h1>
          <p className="text-muted-foreground text-lg">Flexible, transparent payment options with no hidden fees.</p>
        </div>

        <div className="space-y-4 mb-12">
          {methods.map(method => (
            <div key={method.name} className="flex items-start gap-4 p-5 border border-border rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-medium mb-1">{method.name}</div>
                <div className="text-muted-foreground text-sm">{method.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-secondary/40 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="font-serif font-bold text-lg">ID Verification for Card Payments</h3>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            For credit and debit card payments over $500, we require a brief identity verification step — a photo of a government-issued ID. This protects both parties and ensures the cardholder has authorized the charge. Your ID is used for verification only and is not stored permanently.
          </p>
        </div>

        <div className="bg-primary text-primary-foreground rounded-xl p-6 text-center">
          <h3 className="font-serif font-bold text-xl mb-2">Payment is due on or before delivery</h3>
          <p className="text-primary-foreground/70 text-sm">No payment is required until your move is complete. For large moves, a deposit may be requested at booking.</p>
        </div>
      </div>
    </PublicLayout>
  );
}
