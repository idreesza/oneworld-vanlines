import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight, BadgeCheck, Check, ChevronRight, Clock, MapPin, MessageCircle, Phone,
  ShieldCheck, Star, Truck, Users, X, FileText, PhoneCall, PackageCheck,
} from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import SeoHead from "@/components/SeoHead";
import QuoteForm from "@/components/home/QuoteForm";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const PHONE = "(660) 667-7770";
const TEL = "tel:6606677770";
const WHATSAPP = "https://wa.me/16606677770";

const services = [
  { slug: "residential", img: "/services/residential-moving.png", title: "Home Moves", desc: "Houses and townhomes across DFW and Greater Austin, wrapped and padded room by room." },
  { slug: "apartment", img: "/services/apartment-moving.png", title: "Apartment Moves", desc: "Elevators, stairs and tight parking handled. Studios to 3-bedroom units." },
  { slug: "long-distance", img: "/services/long-distance-moving.png", title: "Long-Distance", desc: "A dedicated truck for your belongings only, with a set delivery window." },
  { slug: "commercial", img: "/services/commercial-moving.png", title: "Office & Commercial", desc: "After-hours and weekend moves so your business keeps running." },
  { slug: "packing", img: "/services/packing-services.png", title: "Packing Services", desc: "Full or partial packing. Fragile items hand-wrapped with professional materials." },
  { slug: "specialty", img: "/services/specialty-piano.png", title: "Pianos & Specialty", desc: "Pianos, safes, hot tubs, antiques and art moved by trained specialists." },
];

const steps = [
  { icon: FileText, title: "Tell us about your move", desc: "Takes about a minute: where you're going, when, and how big your home is." },
  { icon: PhoneCall, title: "Get your price within 1 hour", desc: "A coordinator calls you with a clear price range. No in-home sales visit needed." },
  { icon: PackageCheck, title: "We handle the heavy lifting", desc: "Our own crew arrives on time, protects your home, and keeps you updated on WhatsApp." },
];

const comparison = [
  { label: "Who moves you", us: "Our own employed, background-checked crew", them: "Whoever the broker finds cheapest" },
  { label: "Your price", us: "Realistic range shown before you book", them: "Low-ball quote that grows on move day" },
  { label: "Your truck", us: "Our trucks, never shared on long-distance", them: "Often consolidated with other loads" },
  { label: "Communication", us: "One coordinator + WhatsApp updates", them: "Call center, then a stranger shows up" },
];

const testimonials = [
  { name: "Rachel T.", location: "Carrollton → Plano", text: "OneWorld handled our 4-bedroom home move without a single scratch. The crew was professional, fast, and respectful of our space. Best moving experience we've ever had." },
  { name: "Carlos M.", location: "Arlington, TX", text: "Very transparent pricing — what they quoted is exactly what I paid. They moved a baby grand piano without a single issue. These guys know what they're doing." },
  { name: "Lisa & Tom K.", location: "Irving → Austin", text: "A full long-distance move. OneWorld assigned us a dedicated coordinator who checked in at every stage. Worth every penny." },
  { name: "Priya S.", location: "Austin, TX", text: "Last-minute move, called on a Wednesday, they were there Friday morning. Packed everything perfectly. The WhatsApp updates were reassuring." },
  { name: "James R.", location: "McKinney → Dallas", text: "Moved my office on a tight deadline. The team finished 2 hours faster than quoted. Zero downtime for our business." },
  { name: "Marcus D.", location: "Frisco, TX", text: "From the quote to the last box, completely smooth. They wrapped all our furniture carefully and reassembled everything at the new house." },
];

const photos = [
  { src: "/gallery/oneworld-van-lines-blue-blanket-wall-to-wall-straps-truck-interior-mesquite-tx-dfw-movers.jpeg", alt: "Furniture wrapped in blue moving blankets and strapped wall to wall inside a truck", caption: "Mesquite" },
  { src: "/gallery/oneworld-van-lines-staircase-blue-carpet-runner-floor-protection-move-day-mckinney-tx-dfw.jpeg", alt: "Staircase covered with blue carpet runner for floor protection on move day", caption: "McKinney" },
  { src: "/gallery/oneworld-van-lines-dish-pack-fragile-kraft-wrapped-truck-loading-cedar-park-austin-tx.jpeg", alt: "Dish-pack boxes of fragile items loaded into a truck", caption: "Cedar Park" },
  { src: "/gallery/oneworld-van-lines-living-room-plastic-wrapped-recliners-mattresses-armoire-flower-mound-tx-dfw.jpeg", alt: "Living room furniture plastic-wrapped and staged for the move", caption: "Flower Mound" },
];

const faqs = [
  { q: "How fast will I get my price?", a: "Within 1 hour during business hours (7am–8pm CST, 7 days a week). A move coordinator calls you, confirms the details, and gives you a clear price range. Prefer to see numbers right now? Use our instant moving calculator." },
  { q: "Are there hidden fees?", a: "No. We show you a realistic low and high before you book, including fuel and any stairs or packing add-ons, so there are no surprises on move day." },
  { q: "Are you a broker?", a: "No. One World Van Lines is a licensed, bonded and insured direct carrier (USDOT 2388619 · MC 820945). The company that quotes you is the company that moves you, with our own trucks and employees." },
  { q: "How much does a local move cost?", a: "Local moves are billed hourly, starting at $169/hr for 2 movers and a truck. Most 1–2 bedroom moves in DFW take 3–6 hours. Your coordinator will give you a range based on your exact home." },
  { q: "How far in advance should I book?", a: "2–4 weeks is ideal, especially at the end of the month and in summer. We often handle last-minute moves too, so ask even if your date is close." },
  { q: "Do you move outside DFW and Austin?", a: "Yes. We're based in Carrollton and serve all of DFW and Greater Austin for local moves, and handle long-distance moves across Texas and out of state." },
];

const cities = ["Carrollton", "Dallas", "Plano", "Frisco", "McKinney", "Allen", "Irving", "Fort Worth", "Arlington", "Austin", "Round Rock", "Cedar Park"];

function Stars({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <span className="flex" aria-label="5 out of 5 stars">
      {[...Array(5)].map((_, i) => <Star key={i} className={`${className} fill-amber-400 text-amber-400`} aria-hidden />)}
    </span>
  );
}

function Eyebrow({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return <p className={`text-xs font-bold uppercase tracking-[0.18em] mb-3 ${dark ? "text-amber-400" : "text-amber-600"}`}>{children}</p>;
}

function scrollToQuote() {
  const el = document.getElementById("quote");
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(() => (document.getElementById("hero-from") as HTMLInputElement | null)?.focus({ preventScroll: true }), 500);
}

function QuoteButton({ children = "Get my free quote", className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={scrollToQuote}
      className={`inline-flex items-center justify-center gap-2 h-13 px-7 py-3.5 rounded-lg bg-[hsl(38,92%,50%)] text-slate-950 font-bold hover:bg-[hsl(38,92%,45%)] transition shadow-lg shadow-amber-500/20 ${className}`}
    >
      {children} <ArrowRight className="w-5 h-5" />
    </button>
  );
}

const fadeUp = { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" }, transition: { duration: 0.45 } };

export default function Home() {
  // Mobile sticky CTA bar: show once the hero form has scrolled out of view.
  const heroRef = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(false);
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <PublicLayout raiseWhatsApp={showBar}>
      <SeoHead
        title="One World Van Lines | Licensed DFW & Austin Movers — Free Quote in 1 Hour"
        description="Family-owned, licensed moving company in Carrollton, TX. Local, long-distance, apartment and office moves across Dallas–Fort Worth and Austin. Get a free quote in under an hour."
        canonical="/"
      />

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-[hsl(222,47%,9%)] text-white">
        <img src="/hero-truck.jpg" alt="" aria-hidden className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40" loading="eager" fetchPriority="high" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[hsl(222,47%,9%)] via-[hsl(222,47%,9%)]/90 to-[hsl(222,47%,9%)]/40" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-14 lg:pt-20 lg:pb-24 grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/15 px-3 py-1.5 text-xs font-semibold mb-6">
              <Stars className="w-3.5 h-3.5" />
              <span>4.9 rating · 5,430+ moves completed</span>
            </div>

            <h1 className="font-serif text-[2.4rem] leading-[1.08] sm:text-5xl lg:text-[3.6rem] font-bold tracking-tight mb-5">
              Texas movers who show up on time,{" "}
              <span className="text-amber-400">at the price we quoted.</span>
            </h1>

            <p className="text-lg text-white/75 leading-relaxed max-w-xl mb-7">
              Family-owned and based in Carrollton since 2013. Local and long-distance moves across Dallas–Fort Worth and Austin,
              done by our own crews in our own trucks.
            </p>

            <ul className="hidden sm:grid gap-3 mb-8 text-[15px]">
              {[
                "Free quote with a real price range, called back within 1 hour",
                "No brokers, no subcontractors, no hidden fees",
                "Licensed, bonded & insured · USDOT 2388619 · MC 820945",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-amber-400/15 text-amber-400 flex items-center justify-center shrink-0"><Check className="w-3.5 h-3.5" strokeWidth={3} /></span>
                  <span className="text-white/90">{t}</span>
                </li>
              ))}
            </ul>

            <div className="hidden lg:flex items-center gap-5 text-sm">
              <a href={TEL} className="flex items-center gap-3 group">
                <span className="w-11 h-11 rounded-full bg-white/10 ring-1 ring-white/20 flex items-center justify-center group-hover:bg-white/20 transition"><Phone className="w-5 h-5" /></span>
                <span>
                  <span className="block text-white/60 text-xs">Prefer to talk? 7 days, 7am–8pm</span>
                  <span className="block font-bold text-lg">{PHONE}</span>
                </span>
              </a>
            </div>
          </motion.div>

          <motion.div
            ref={heroRef}
            id="quote"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="scroll-mt-28"
          >
            <div className="bg-white text-slate-900 rounded-2xl shadow-2xl shadow-black/40 p-5 sm:p-7">
              <div className="mb-5">
                <h2 className="font-serif text-2xl font-bold">Get your free moving quote</h2>
                <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Takes 60 seconds · No obligation</p>
              </div>
              <QuoteForm idPrefix="hero" />
            </div>
            <a href={TEL} className="lg:hidden mt-4 flex items-center justify-center gap-2 text-sm text-white/80">
              <Phone className="w-4 h-4" /> Or call <span className="font-bold text-white">{PHONE}</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ─── TRUST STRIP ─────────────────────────────────────── */}
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-6">
          {[
            { icon: Star, big: "4.9 / 5", small: "Customer rating" },
            { icon: Truck, big: "5,430+", small: "Moves completed" },
            { icon: Clock, big: "< 1 hour", small: "Quote callback" },
            { icon: ShieldCheck, big: "Since 2013", small: "Licensed & insured" },
          ].map(({ icon: Icon, big, small }) => (
            <div key={small} className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0"><Icon className="w-5 h-5 text-primary" /></span>
              <span>
                <span className="block font-serif text-xl font-bold leading-none">{big}</span>
                <span className="block text-xs text-muted-foreground mt-1">{small}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold">From quote to keys in three simple steps</h2>
          </motion.div>
          <ol className="grid md:grid-cols-3 gap-6">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <motion.li key={title} {...fadeUp} transition={{ duration: 0.45, delay: i * 0.1 }} className="relative bg-white rounded-2xl border border-border p-7">
                <span className="absolute top-6 right-6 font-serif text-5xl font-bold text-secondary select-none" aria-hidden>{i + 1}</span>
                <span className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center mb-5"><Icon className="w-6 h-6" /></span>
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{desc}</p>
              </motion.li>
            ))}
          </ol>
          <div className="text-center mt-10"><QuoteButton>Start step 1</QuoteButton></div>
        </div>
      </section>

      {/* ─── SERVICES ────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-muted/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div {...fadeUp} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div className="max-w-2xl">
              <Eyebrow>Moving services</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-bold">Whatever you're moving, we've done it before</h2>
            </div>
            <Link href="/services" className="inline-flex items-center gap-1 font-semibold text-primary hover:gap-2 transition-all">All services <ChevronRight className="w-4 h-4" /></Link>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div key={s.slug} {...fadeUp} transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}>
                <Link href={`/services/${s.slug}`} className="group block h-full bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all">
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    <img src={s.img} alt={s.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                    <p className="text-muted-foreground text-[15px] leading-relaxed mb-4">{s.desc}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DIRECT CARRIER VS BROKER ────────────────────────── */}
      <section className="py-20 lg:py-24 bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-12">
            <Eyebrow dark>Why it matters who moves you</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">We're the movers, not a middleman</h2>
            <p className="text-primary-foreground/70 text-lg">Many "moving companies" online are brokers who sell your job to whoever bids lowest. One World Van Lines is a licensed direct carrier.</p>
          </motion.div>

          <motion.div {...fadeUp} className="rounded-2xl overflow-hidden ring-1 ring-white/10">
            <div className="grid grid-cols-[1fr_1fr] md:grid-cols-[0.8fr_1fr_1fr] bg-white/5 text-sm font-bold">
              <div className="hidden md:block p-4" />
              <div className="p-4 bg-amber-400 text-slate-950 flex items-center gap-2"><BadgeCheck className="w-4 h-4" /> One World Van Lines</div>
              <div className="p-4 text-primary-foreground/60">Typical broker</div>
            </div>
            {comparison.map((row) => (
              <div key={row.label} className="grid grid-cols-[1fr_1fr] md:grid-cols-[0.8fr_1fr_1fr] border-t border-white/10 text-[15px]">
                <div className="col-span-2 md:col-span-1 px-4 pt-4 md:py-4 text-xs md:text-[15px] font-semibold uppercase md:normal-case tracking-wider md:tracking-normal text-primary-foreground/50 md:text-primary-foreground/80">{row.label}</div>
                <div className="p-4 flex items-start gap-2 bg-white/[0.04]"><Check className="w-4 h-4 mt-1 text-amber-400 shrink-0" strokeWidth={3} />{row.us}</div>
                <div className="p-4 flex items-start gap-2 text-primary-foreground/55"><X className="w-4 h-4 mt-1 shrink-0" />{row.them}</div>
              </div>
            ))}
          </motion.div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <QuoteButton />
            <a href={TEL} className="inline-flex items-center gap-2 h-13 px-6 py-3.5 rounded-lg ring-1 ring-white/25 font-semibold hover:bg-white/10 transition"><Phone className="w-4 h-4" /> {PHONE}</a>
          </div>
        </div>
      </section>

      {/* ─── REVIEWS ─────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12">
            <Eyebrow>Customer reviews</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Texas families trust us with their homes</h2>
            <div className="inline-flex items-center gap-2 text-muted-foreground"><Stars className="w-5 h-5" /><span className="font-semibold text-foreground">4.9 out of 5</span> across 5,430+ moves</div>
          </motion.div>
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-2">
            {testimonials.map((t, i) => (
              <motion.figure key={t.name} {...fadeUp} transition={{ duration: 0.45, delay: (i % 3) * 0.08 }} className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-auto bg-white rounded-2xl border border-border p-6 flex flex-col">
                <Stars />
                <blockquote className="text-foreground/85 leading-relaxed mt-4 mb-6 flex-1">"{t.text}"</blockquote>
                <figcaption className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-serif font-bold">{t.name[0]}</span>
                  <span>
                    <span className="block font-semibold text-sm">{t.name}</span>
                    <span className="block text-xs text-muted-foreground">{t.location}</span>
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REAL WORK ───────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-muted/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
          <motion.div {...fadeUp}>
            <Eyebrow>Real moves, real crews</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold mb-5">Your home gets protected before anything gets lifted</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">Every photo here is from an actual One World Van Lines job: floors and stairs covered, furniture blanket-wrapped, every load strapped wall to wall.</p>
            <ul className="space-y-3 mb-8">
              {["Floor runners and door-frame pads on every move", "Furniture blanket-wrapped and plastic-sealed", "Disassembly and reassembly included", "Loads strapped tight so nothing shifts"].map((t) => (
                <li key={t} className="flex items-start gap-3"><Check className="w-5 h-5 mt-0.5 text-amber-600 shrink-0" strokeWidth={3} /><span>{t}</span></li>
              ))}
            </ul>
            <Link href="/gallery" className="inline-flex items-center gap-1 font-semibold text-primary hover:gap-2 transition-all">See the full gallery <ChevronRight className="w-4 h-4" /></Link>
          </motion.div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {photos.map((p, i) => (
              <motion.div key={p.src} {...fadeUp} transition={{ duration: 0.45, delay: i * 0.06 }} className={`relative rounded-2xl overflow-hidden bg-muted ${i % 2 ? "mt-8" : ""}`}>
                <img src={p.src} alt={p.alt} loading="lazy" className="aspect-[4/5] w-full object-cover" />
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur px-2.5 py-1 text-xs font-medium text-white"><MapPin className="w-3 h-3" />{p.caption}, TX</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4 md:px-8 grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16">
          <motion.div {...fadeUp}>
            <Eyebrow>Questions</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Before you book</h2>
            <p className="text-muted-foreground text-lg mb-6">Straight answers to what people ask us most. Anything else, just ask.</p>
            <div className="flex flex-col gap-3">
              <a href={TEL} className="flex items-center gap-3 font-semibold"><span className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"><Phone className="w-4 h-4" /></span>{PHONE}</a>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 font-semibold"><span className="w-10 h-10 rounded-full bg-[#25D366]/15 text-[#128C7E] flex items-center justify-center"><MessageCircle className="w-4 h-4" /></span>Message us on WhatsApp</a>
            </div>
          </motion.div>
          <Accordion type="single" collapsible defaultValue="q0" className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`q${i}`} className="border-border">
                <AccordionTrigger className="text-left text-[17px] font-semibold py-5 hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-[15px] leading-relaxed pb-5">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ─── FINAL CTA + SERVICE AREA ────────────────────────── */}
      <section className="py-20 lg:py-24 bg-[hsl(222,47%,9%)] text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp}>
            <Eyebrow dark>Ready when you are</Eyebrow>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-5">Get your price today. Book only if you love it.</h2>
            <p className="text-white/70 text-lg mb-8">Serving all of Dallas–Fort Worth and Greater Austin from our Carrollton headquarters.</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {cities.map((c) => (
                <Link key={c} href={`/locations/${c.toLowerCase().replace(/\s+/g, "-")}`} className="inline-flex items-center gap-1 rounded-full ring-1 ring-white/20 px-3 py-1.5 text-sm text-white/85 hover:bg-white/10 transition">
                  <MapPin className="w-3 h-3" />{c}
                </Link>
              ))}
              <Link href="/areas" className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-amber-400 hover:underline">All 40+ cities <ChevronRight className="w-4 h-4" /></Link>
            </div>
            <div className="flex items-center gap-4 text-sm text-white/60">
              <Users className="w-5 h-5" /> Family-owned · Carrollton, TX · USDOT 2388619
            </div>
          </motion.div>
          <motion.div {...fadeUp} className="bg-white text-slate-900 rounded-2xl shadow-2xl p-5 sm:p-7">
            <h3 className="font-serif text-2xl font-bold mb-5">Get your free moving quote</h3>
            <QuoteForm idPrefix="footer" />
          </motion.div>
        </div>
      </section>

      {/* ─── MOBILE STICKY CTA ───────────────────────────────── */}
      <div
        className={`md:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur border-t border-border px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] grid grid-cols-[auto_1fr] gap-2 transition-transform duration-300 ${showBar ? "translate-y-0" : "translate-y-full"}`}
        aria-hidden={!showBar}
      >
        <a href={TEL} tabIndex={showBar ? 0 : -1} className="h-12 px-5 rounded-lg border border-slate-300 font-semibold flex items-center justify-center gap-2"><Phone className="w-4 h-4" /> Call</a>
        <button type="button" tabIndex={showBar ? 0 : -1} onClick={scrollToQuote} className="h-12 rounded-lg bg-[hsl(38,92%,50%)] text-slate-950 font-bold flex items-center justify-center gap-2">Get free quote <ArrowRight className="w-4 h-4" /></button>
      </div>
    </PublicLayout>
  );
}
