import { useListFaqs, getListFaqsQueryKey } from "@workspace/api-client-react";
import PublicLayout from "@/components/layout/PublicLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const CATEGORIES = ["All", "Pricing", "Moving Day", "Packing", "Insurance", "Payment"];

export default function Faq() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { data: faqs, isLoading } = useListFaqs(
    selectedCategory !== "All" ? { category: selectedCategory } : {},
    { query: { queryKey: getListFaqsQueryKey({ category: selectedCategory !== "All" ? selectedCategory : undefined }) } }
  );

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">Get Answers</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground text-lg">Everything you need to know about planning your move with OneWorld Van Lines.</p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded" />)}
          </div>
        ) : (
          <Accordion type="multiple" className="space-y-2">
            {(faqs ?? []).map(faq => (
              <AccordionItem key={faq.id} value={String(faq.id)} className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-medium hover:no-underline py-5">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        <div className="mt-16 bg-secondary/40 rounded-xl p-8 text-center">
          <h2 className="font-serif font-bold text-xl mb-2">Still have questions?</h2>
          <p className="text-muted-foreground text-sm mb-4">Call or text us directly — we answer during business hours (7am–8pm CST).</p>
          <a href="tel:6606677770" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded font-semibold hover:bg-primary/90 transition-colors">
            Call (660) 667-7770
          </a>
        </div>
      </div>
    </PublicLayout>
  );
}
