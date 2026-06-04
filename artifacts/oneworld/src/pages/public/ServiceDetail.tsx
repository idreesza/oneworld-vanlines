import { useParams, Link } from "wouter";
import PublicLayout from "@/components/layout/PublicLayout";
import SeoHead from "@/components/SeoHead";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const serviceData: Record<string, { title: string; description: string; features: string[]; faqs: Array<{q: string; a: string}> }> = {
  residential: {
    title: "Residential Moving",
    description: "Moving your home is one of life's most significant events. OneWorld Van Lines treats every residential move with the care, precision, and professionalism it deserves. Our trained crews handle everything from delicate heirlooms to heavy appliances — with full accountability at every step.",
    features: ["Full or partial packing services", "Furniture disassembly and reassembly", "Padded moving blankets for all furniture", "Floor and doorway protection", "GPS-tracked trucks", "Move coordinator assigned to your job", "Same-day and weekend availability"],
    faqs: [
      { q: "How far in advance should I book?", a: "We recommend booking 1–2 weeks ahead for local moves and 3–4 weeks for long-distance moves, especially during busy seasons (May–September)." },
      { q: "Do you move appliances?", a: "Yes. We move washers, dryers, refrigerators, and other large appliances. If installation is needed, we can coordinate with local plumbers or electricians." },
    ],
  },
  apartment: {
    title: "Apartment Moving",
    description: "Apartment moves require precise coordination — elevator reservations, parking permits, narrow hallways, and strict building schedules. Our crews are experienced with DFW and Austin high-rises, garden apartments, and everything in between.",
    features: ["Elevator reservation coordination", "Parking permit assistance", "Narrow hallway and stairwell expertise", "Flexible scheduling around building rules", "No surprise fees for elevator time"],
    faqs: [
      { q: "Do you coordinate with my building's management?", a: "Yes. We handle elevator reservations and communicate with building management on your behalf to ensure a smooth move-out and move-in." },
      { q: "What if my building has strict move-in hours?", a: "We schedule around your building's rules. Just let your coordinator know the allowed window and we'll plan accordingly." },
    ],
  },
  commercial: {
    title: "Commercial Moving",
    description: "Business downtime costs money. Our commercial moving team specializes in efficient, carefully planned office and business relocations that minimize disruption and get your team operational again as fast as possible.",
    features: ["After-hours and weekend moves", "IT equipment packing and handling", "Furniture system disassembly", "Dedicated project manager", "Storage solutions during transition", "Phased moves for large offices"],
    faqs: [
      { q: "Can you move our servers and IT equipment?", a: "We offer careful IT equipment handling and packing. For server rack removal and setup, we recommend coordinating with your IT team for disconnection and reconnection." },
      { q: "How do you minimize downtime?", a: "We plan in phases, work outside business hours when needed, and assign a dedicated project manager who coordinates directly with your office manager." },
    ],
  },
  local: {
    title: "Local Moving",
    description: "Local moves in DFW and Austin deserve the same level of professionalism as long-distance. We don't rush, we don't cut corners, and we show up on time — every time. Hourly or flat-rate pricing available.",
    features: ["Same-day availability", "Hourly and flat-rate options", "Experienced local crews", "Climate-aware scheduling", "Short-notice moves accommodated"],
    faqs: [
      { q: "Is there a minimum number of hours?", a: "Our local moves have a 2-hour minimum. Most studio and 1-bedroom moves complete in 2–4 hours; 3–4 bedroom homes typically take 5–8 hours." },
      { q: "Do you serve all DFW cities?", a: "Yes. We serve Dallas, Fort Worth, Plano, Frisco, McKinney, Allen, Richardson, Irving, Arlington, Garland, and all surrounding cities." },
    ],
  },
  "long-distance": {
    title: "Long-Distance Moving",
    description: "Interstate moves and cross-country relocations require a different level of planning and trust. OneWorld Van Lines provides dedicated trucks, real-time GPS tracking, and a single point of contact throughout your long-distance move.",
    features: ["Dedicated truck (no shared loads)", "GPS tracking via customer portal", "Binding estimates available", "Full valuation protection", "Delivery window guarantees", "Packing services included or optional"],
    faqs: [
      { q: "How long does a long-distance move take?", a: "Texas to neighboring states typically takes 2–4 days. Cross-country moves can take 5–10 days. We provide a firm delivery window at booking." },
      { q: "Do you share trucks with other customers?", a: "No. Your belongings travel in a dedicated truck with the same crew throughout the move. No mixing loads, no stops at other homes." },
    ],
  },
  packing: {
    title: "Packing Services",
    description: "Professional packing saves time, reduces stress, and significantly lowers the risk of damage. Our packers are trained to protect even the most fragile belongings using premium materials and proven techniques.",
    features: ["Full-home packing service", "Room-by-room partial packing", "Specialty packing for fragile items", "Custom crating for art and antiques", "Wardrobe boxes included", "Unpacking service available"],
    faqs: [
      { q: "How much does packing service cost?", a: "Full packing starts at a flat fee based on home size, typically $350–$800. Partial packing (kitchen only, fragile items) is quoted separately." },
      { q: "Do I need to provide packing supplies?", a: "No. We bring all boxes, paper, bubble wrap, tape, and specialty materials. You don't need to source anything." },
    ],
  },
  storage: {
    title: "Storage Solutions",
    description: "Sometimes your timeline doesn't line up perfectly. Our storage options provide secure, climate-controlled holding for your belongings during a gap between move-out and move-in dates.",
    features: ["Climate-controlled facilities", "Short and long-term options", "Inventory tracking", "Easy access during storage period", "Seamless delivery from storage to new home"],
    faqs: [
      { q: "Can you move items directly into storage?", a: "Yes. We can move from your home to storage and then deliver to your new address when you're ready — all in one coordinated service." },
      { q: "Is my furniture insured while in storage?", a: "Yes. All items in storage are covered under our valuation plan. We inventory everything before storage begins." },
    ],
  },
  specialty: {
    title: "Specialty Item Moving",
    description: "Some items require more than a standard moving crew. Pianos, safes, pool tables, fine art, and oversized furniture need specialized equipment and trained specialists. We handle these with the care they demand.",
    features: ["Piano moving (upright and grand)", "Safe and vault moving", "Pool table disassembly and reassembly", "Antique and fine art handling", "Custom crating available", "White-glove delivery"],
    faqs: [
      { q: "Do you need to disassemble my piano?", a: "Upright pianos move intact with piano dollies and skid boards. Grand pianos require partial disassembly (lid, legs, pedal lyre) by our specialists." },
      { q: "How do you move a safe?", a: "We use specialized equipment including heavy-duty dollies and stair walkers. Weight and access are assessed before the move to ensure the right equipment is on site." },
    ],
  },
};

const serviceMeta: Record<string, { title: string; desc: string }> = {
  residential: { title: "Residential Movers in DFW & Austin | One World Van Lines", desc: "Professional residential moving services across DFW and Greater Austin. Licensed, insured, no hidden fees. Full packing, furniture protection, GPS-tracked trucks. Call (660) 667-7770." },
  apartment: { title: "Apartment Movers Dallas TX | One World Van Lines", desc: "Expert apartment and high-rise moving in DFW and Austin. Elevator coordination, COI paperwork, narrow hallway experience. Licensed & insured. Call (660) 667-7770." },
  commercial: { title: "Commercial & Office Movers Dallas TX | One World Van Lines", desc: "After-hours commercial moving with minimal downtime. Office relocations across DFW and Austin — IT equipment, furniture systems, phased moves. Call (660) 667-7770." },
  local: { title: "Local Movers Dallas & DFW TX | One World Van Lines", desc: "Local moving company in Dallas-Fort Worth and Austin. Same-day availability, hourly and flat-rate pricing, experienced crews. Licensed & insured. Call (660) 667-7770." },
  "long-distance": { title: "Long-Distance Movers Texas | One World Van Lines", desc: "Dedicated long-distance moving trucks from Texas. No shared loads, GPS tracking, binding estimates. DFW to Austin, nationwide. USDOT 2388619. Call (660) 667-7770." },
  packing: { title: "Professional Packing Services DFW & Austin | One World Van Lines", desc: "Full and partial packing services in Dallas-Fort Worth and Austin. Premium materials, fragile item specialists, wardrobe boxes included. Call (660) 667-7770." },
  storage: { title: "Moving & Storage Solutions DFW TX | One World Van Lines", desc: "Climate-controlled storage during your move in DFW and Austin. Short and long-term options, inventory tracking, seamless pickup and delivery. Call (660) 667-7770." },
  specialty: { title: "Piano & Specialty Item Movers DFW TX | One World Van Lines", desc: "Piano moving, safe relocation, pool table moving, and fine art handling in Dallas-Fort Worth and Austin. Trained specialists, custom crating. Call (660) 667-7770." },
};

export default function ServiceDetail() {
  const { type } = useParams<{ type: string }>();
  const service = serviceData[type ?? ""] ?? serviceData.residential;
  const meta = serviceMeta[type ?? ""] ?? serviceMeta.residential;
  const canonical = `/services/${type ?? "residential"}`;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.description,
    "provider": {
      "@type": "MovingCompany",
      "name": "One World Van Lines",
      "telephone": "+1-660-667-7770",
      "url": "https://oneworldvanlines.net",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "2305 Belt Line Rd #120B",
        "addressLocality": "Carrollton",
        "addressRegion": "TX",
        "postalCode": "75006",
        "addressCountry": "US"
      }
    },
    "areaServed": "Dallas-Fort Worth Metroplex and Greater Austin, TX",
    "url": `https://oneworldvanlines.net${canonical}`
  };

  const faqSchema = service.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": service.faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  } : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://oneworldvanlines.net/" },
      { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://oneworldvanlines.net/services" },
      { "@type": "ListItem", "position": 3, "name": service.title, "item": `https://oneworldvanlines.net${canonical}` }
    ]
  };

  const schemas = [serviceSchema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])];

  return (
    <PublicLayout>
      <SeoHead title={meta.title} description={meta.desc} canonical={canonical} schema={schemas} />
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="mb-4">
          <Link href="/services" className="text-muted-foreground text-sm hover:text-primary transition-colors">
            ← All Services
          </Link>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">{service.title}</h1>
        <p className="text-xl text-muted-foreground leading-relaxed mb-12">{service.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-serif font-bold mb-6">What's Included</h2>
            <ul className="space-y-3">
              {service.features.map(f => (
                <li key={f} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold mb-6">Common Questions</h2>
            <div className="space-y-6">
              {service.faqs.map(faq => (
                <div key={faq.q}>
                  <h4 className="font-medium mb-2">{faq.q}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-primary text-primary-foreground rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-2">Ready to get started?</h3>
            <p className="text-primary-foreground/70">Get a price range in 2 minutes or call us directly.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/calculator">
              <button className="px-6 py-3 bg-secondary text-secondary-foreground rounded font-semibold hover:bg-secondary/90 transition-colors flex items-center gap-2">
                Get a Quote <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <a href="tel:6606677770" className="px-6 py-3 border border-primary-foreground/30 rounded font-semibold hover:bg-primary-foreground/10 transition-colors">
              Call Us
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
