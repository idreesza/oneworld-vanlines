import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Link, useLocation } from "wouter";
import { ArrowRight, CheckCircle2, Shield, Star, Award, MapPin, Phone, Clock, Truck, Package, ChevronRight, Users, TrendingUp, ThumbsUp } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const heroSchema = z.object({
  moveFromAddress: z.string().min(3, "Enter city or zip"),
  moveToAddress: z.string().min(3, "Enter city or zip"),
  phone: z.string().min(10, "Enter a valid phone number"),
});

const testimonials = [
  { name: "Rachel T.", location: "Carrollton, TX", rating: 5, text: "OneWorld handled our 4-bedroom home move from Carrollton to Plano without a single scratch. The crew was professional, fast, and respectful of our space. Best moving experience we've ever had." },
  { name: "Marcus D.", location: "Frisco, TX", rating: 5, text: "From the initial quote to the last box unloaded, the process was completely smooth. They wrapped all our furniture carefully and reassembled everything at the new house. Highly recommend." },
  { name: "Lisa & Tom K.", location: "Irving, TX", rating: 5, text: "We moved from Irving to Austin — a full long-distance move. OneWorld assigned us a dedicated coordinator who checked in at every stage. Worth every penny." },
  { name: "James R.", location: "McKinney, TX", rating: 5, text: "Moved my office from McKinney to downtown Dallas on a tight deadline. The team completed the job 2 hours faster than quoted. Zero downtime for our business." },
  { name: "Priya S.", location: "Austin, TX", rating: 5, text: "Last-minute move, called on a Wednesday, they were there Friday morning. Packed everything perfectly. The WhatsApp updates throughout the move were reassuring." },
  { name: "Carlos M.", location: "Arlington, TX", rating: 5, text: "Very transparent pricing — what they quoted is exactly what I paid. They moved a baby grand piano without a single issue. These guys know what they're doing." },
];

const howItWorks = [
  { step: "01", title: "Get Your Price Range", desc: "Fill out the quick form or use our calculator. We generate a real estimate based on your inventory — not a generic quote that changes on move day." },
  { step: "02", title: "Confirm & Schedule", desc: "A relocation coordinator calls you within 1 hour to review details, answer questions, and lock in your move date and crew." },
  { step: "03", title: "We Handle Everything", desc: "Our crew arrives on time, works efficiently, and communicates with you through every step. You're updated in real time via WhatsApp." },
];

const serviceCards = [
  { slug: "residential", icon: Truck, title: "Residential Moving", desc: "Homes, condos, and apartments across Carrollton, DFW, and Austin." },
  { slug: "commercial", icon: Package, title: "Commercial & Office", desc: "Minimal downtime, after-hours options, and dedicated project management." },
  { slug: "long-distance", icon: MapPin, title: "Long-Distance", desc: "Dedicated trucks, GPS tracking, and fixed delivery windows. No sharing loads." },
  { slug: "packing", icon: CheckCircle2, title: "Packing Services", desc: "Full or partial packing with premium materials. Fragile items hand-wrapped." },
  { slug: "specialty", icon: Shield, title: "Specialty Items", desc: "Pianos, safes, antiques, fine art handled by trained specialists." },
  { slug: "storage", icon: Award, title: "Storage Solutions", desc: "Climate-controlled storage when your timeline doesn't perfectly align." },
];

const cities = [
  { name: "Carrollton", slug: "carrollton", isHQ: true },
  { name: "Plano", slug: "plano" },
  { name: "Frisco", slug: "frisco" },
  { name: "McKinney", slug: "mckinney" },
  { name: "Allen", slug: "allen" },
  { name: "Irving", slug: "irving" },
  { name: "Dallas", slug: "dallas" },
  { name: "Fort Worth", slug: "fort-worth" },
  { name: "Arlington", slug: "arlington" },
  { name: "Austin", slug: "austin" },
];

const HERO_PHOTOS = [
  "/gallery/moving-truck-fleet-one-world-van-lines-texas.jpg",
  "/gallery/oneworld-van-lines-blanket-plastic-wrap-fully-packed-truck-irving-tx-dfw-movers.jpg",
  "/gallery/professional-furniture-wrapping-dfw-movers.jpg",
];

export default function Home() {
  const [, navigate] = useLocation();

  const form = useForm<z.infer<typeof heroSchema>>({
    resolver: zodResolver(heroSchema),
    defaultValues: { moveFromAddress: "", moveToAddress: "", phone: "" },
  });

  function onSubmit(values: z.infer<typeof heroSchema>) {
    const qs = new URLSearchParams({
      from: values.moveFromAddress,
      to: values.moveToAddress,
      phone: values.phone,
    }).toString();
    navigate(`/calculator?${qs}`);
  }

  return (
    <PublicLayout>
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT — headline + form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/8 text-primary text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              Carrollton, TX · DFW &amp; Austin Since 2013
            </div>

            {/* Headline */}
            <h1 className="font-serif leading-tight mb-5">
              <span className="block text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                Texas family owned.
              </span>
              <span className="block text-4xl md:text-5xl lg:text-6xl font-bold mt-1">
                <span className="text-[hsl(38,92%,50%)]">There's only one</span>
              </span>
              <span className="block mt-1">
                <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-md text-3xl md:text-4xl lg:text-5xl font-bold whitespace-nowrap">
                  One World Van Lines
                </span>
              </span>
              <span className="block text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-1">
                in DFW.
              </span>
            </h1>

            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-7 max-w-lg">
              Premium residential &amp; commercial moving across the DFW Metroplex and Greater Austin. Precise planning, careful handling, zero hidden fees — backed by 5,430+ completed moves.
            </p>

            {/* ─── QUOTE FORM ─── */}
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Moving out address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      <Input
                        className="pl-9 h-12 border-border focus:border-primary"
                        placeholder="City or zip code"
                        {...form.register("moveFromAddress")}
                      />
                    </div>
                    {form.formState.errors.moveFromAddress && (
                      <p className="text-xs text-red-500 mt-1">{form.formState.errors.moveFromAddress.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Moving in address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      <Input
                        className="pl-9 h-12 border-border focus:border-primary"
                        placeholder="City or zip code"
                        {...form.register("moveToAddress")}
                      />
                    </div>
                    {form.formState.errors.moveToAddress && (
                      <p className="text-xs text-red-500 mt-1">{form.formState.errors.moveToAddress.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Your phone number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      className="pl-9 h-12 border-border focus:border-primary"
                      placeholder="(214) 555-0100"
                      type="tel"
                      {...form.register("phone")}
                    />
                  </div>
                  {form.formState.errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{form.formState.errors.phone.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full h-13 py-3.5 bg-primary text-primary-foreground font-bold text-base rounded-lg hover:bg-primary/90 active:scale-[.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                  GET YOUR QUOTE <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-xs text-muted-foreground text-center">
                  No obligation · We respond within 1 hour · Or call{" "}
                  <a href="tel:6606677770" className="text-primary font-medium hover:underline">(660) 667-7770</a>
                </p>
              </form>

            {/* Review Badges */}
            <div className="mt-6 pt-6 border-t border-border flex flex-wrap items-center gap-x-5 gap-y-3">
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-sm font-semibold text-foreground ml-1">Based on 5,430+ reviews on</span>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="font-bold text-[#4285F4] tracking-tight text-sm">
                  G<span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span>
                </span>
                <span className="font-bold text-[#d32323] text-sm">yelp</span>
                <span className="font-bold text-[#003087] text-sm border border-[#003087] px-1.5 py-0.5 rounded text-xs">BBB</span>
                <span className="font-bold text-[#FF6D2D] text-sm">Angi</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — hero truck photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="order-1 lg:order-2 relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg mx-auto">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="/hero-truck.jpg"
                  alt="One World Van Lines branded moving truck in front of Texas State Capitol"
                  className="w-full h-auto object-cover"
                  loading="eager"
                />
              </div>
              {/* Overlay badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3 shadow-lg">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">Licensed · Bonded · Insured</p>
                  <p className="text-xs text-muted-foreground">USDOT 2388619 · MC 820945</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-bold text-primary text-sm">4.9 ★</p>
                  <p className="text-xs text-muted-foreground">5,430+ moves</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-secondary py-8 border-y border-secondary-foreground/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { number: "5,430+", label: "Moves Completed" },
              { number: "4.9 / 5", label: "Customer Rating" },
              { number: "< 1 hr", label: "Quote Response Time" },
              { number: "15+", label: "Years in Business" },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-3xl font-serif font-bold text-primary">{stat.number}</div>
                <div className="text-sm text-secondary-foreground/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-3">Simple Process</p>
            <h2 className="text-4xl font-serif font-bold">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-border" />
            {howItWorks.map((step, i) => (
              <motion.div key={step.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="text-center">
                <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-6 font-serif text-3xl font-bold relative z-10">
                  {step.step}
                </div>
                <h3 className="text-xl font-serif font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-3">What We Offer</p>
            <h2 className="text-4xl font-serif font-bold">Comprehensive Moving Services</h2>
            <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">Every service is backed by our trained crews, premium materials, and full accountability — from Carrollton to anywhere in Texas.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCards.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.div key={service.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <Link href={`/services/${service.slug}`}>
                    <div className="group bg-background border border-border rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all cursor-pointer h-full flex flex-col">
                      <div className="w-12 h-12 bg-secondary/60 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-serif font-bold text-lg mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed flex-1">{service.desc}</p>
                      <div className="flex items-center gap-1 text-primary text-sm font-medium mt-4">
                        Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link href="/services"><Button variant="outline" size="lg">View All Services</Button></Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-secondary mb-3">Why One World Van Lines</p>
              <h2 className="text-4xl font-serif font-bold mb-6">The Dallas Movers That Actually Show Up — Licensed, Bonded &amp; Insured</h2>
              <p className="text-primary-foreground/70 leading-relaxed mb-8">We're not a broker. We don't sell your move to the cheapest available crew. One World Van Lines is a licensed, bonded, and insured direct carrier — the same crew that gives your quote handles your move, with our trucks, on your timeline.</p>
              <div className="space-y-4">
                {[
                  { icon: Users, title: "Our People, Our Trucks", desc: "No third-party contractors. Every crew member is trained, background-checked, and employed by us." },
                  { icon: TrendingUp, title: "Transparent Price Ranges", desc: "We show you a realistic low and high before you book — not a bait price that jumps on move day." },
                  { icon: ThumbsUp, title: "Real-Time Communication", desc: "Get WhatsApp updates at every stage: crew departure, arrival, pickup completion, and delivery." },
                  { icon: Clock, title: "On-Time or We Make It Right", desc: "We show up when we say we will. If we're late without notice, we credit the delay." },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <div className="font-medium mb-0.5">{item.title}</div>
                        <div className="text-primary-foreground/60 text-sm">{item.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Years in Business", value: "15+" },
                { label: "Cities Covered", value: "40+" },
                { label: "Moves Completed", value: "5,430+" },
                { label: "Average Rating", value: "4.9/5" },
              ].map(item => (
                <div key={item.label} className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-6 text-center">
                  <div className="text-4xl font-serif font-bold text-secondary mb-2">{item.value}</div>
                  <div className="text-primary-foreground/60 text-sm">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-3">Customer Reviews</p>
            <h2 className="text-4xl font-serif font-bold">What Our Customers Say</h2>
            <div className="flex items-center justify-center gap-1 mt-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
              <span className="ml-2 text-muted-foreground font-medium">4.9 out of 5 from 5,430+ moves</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="bg-muted/40 border border-border rounded-xl p-6 flex flex-col">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-serif font-bold text-sm">{t.name[0]}</div>
                  <div>
                    <div className="font-medium text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities We Serve */}
      <section className="py-20 bg-muted/30 border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-3">Local Expertise</p>
            <h2 className="text-3xl font-serif font-bold">Cities We Serve</h2>
            <p className="text-muted-foreground mt-3">Headquartered in Carrollton — serving all of DFW and Greater Austin.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {cities.map(city => (
              <Link key={city.slug} href={`/locations/${city.slug}`}>
                <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-all hover:shadow-md cursor-pointer ${city.isHQ ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:border-primary hover:text-primary"}`}>
                  <MapPin className="w-3.5 h-3.5" />
                  {city.name}{city.isHQ ? " (HQ)" : ""}
                </div>
              </Link>
            ))}
            <Link href="/areas">
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-dashed border-muted-foreground/40 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-all cursor-pointer">
                View All 40+ Cities <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-secondary/30 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif font-bold mb-4">Ready to Plan Your Move?</h2>
          <p className="text-muted-foreground text-lg mb-8">Get a real price range in 2 minutes — or call us directly. We're available 7am to 8pm CST, seven days a week.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/calculator"><Button size="lg" className="px-10 text-base">Use the Calculator <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
            <a href="tel:6606677770"><Button size="lg" variant="outline" className="px-10 text-base"><Phone className="w-4 h-4 mr-2" /> (660) 667-7770</Button></a>
          </div>
          <p className="text-sm text-muted-foreground mt-6">Based in Carrollton, TX · Serving all of DFW &amp; Greater Austin · Licensed, Bonded &amp; Insured</p>
        </div>
      </section>
    </PublicLayout>
  );
}
