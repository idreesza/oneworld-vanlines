import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import PublicLayout from "@/components/layout/PublicLayout";
import { Shield, Clock, Award, Users, MapPin, Phone, Truck, Star, CheckCircle2 } from "lucide-react";

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);

  return count;
}

function AnimatedStat({
  target,
  suffix,
  label,
  isDecimal,
  delay = 0,
}: {
  target: number;
  suffix?: string;
  label: string;
  isDecimal?: boolean;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [inView, delay]);

  const count = useCountUp(isDecimal ? target * 10 : target, 2000, started);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay / 1000, duration: 0.5 }}
      className="text-center"
    >
      <div className="text-3xl font-serif font-bold mb-1 tabular-nums">
        {isDecimal
          ? `${(count / 10).toFixed(1)} / 5`
          : `${count.toLocaleString()}${suffix ?? ""}`}
      </div>
      <div className="text-primary-foreground/60 text-sm">{label}</div>
    </motion.div>
  );
}

const values = [
  { icon: Shield, title: "Accountability", desc: "Every move has a dedicated coordinator. Every item tracked. Every promise kept — or we make it right." },
  { icon: Clock, title: "Punctuality", desc: "We show up on time, every time. Your schedule is not a suggestion — it's a commitment we take seriously." },
  { icon: Award, title: "Quality", desc: "Premium materials, trained crews, careful handling. The standard doesn't drop on move 5,430 any more than it did on move 1." },
  { icon: Users, title: "Community", desc: "We live here. Carrollton, DFW, Austin — these are our communities. We treat every customer like a neighbor." },
];

export default function About() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-medium uppercase tracking-widest text-secondary mb-4">Our Story</p>
          <h1 className="text-5xl font-serif font-bold mb-6 max-w-2xl">Built in Carrollton. Built for Texas.</h1>
          <p className="text-primary-foreground/70 text-xl max-w-2xl leading-relaxed">
            OneWorld Van Lines was founded with one conviction: moving should feel like working with people who genuinely care. We started in Carrollton, TX, and grew into one of DFW's most trusted moving companies — one move at a time.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-3xl font-serif font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>OneWorld Van Lines was founded in Carrollton, TX by a team that saw a clear problem in the moving industry: too many companies over-promised and under-delivered. Customers were getting bait-and-switch pricing, unreliable crews, and zero accountability.</p>
              <p>With over 45 years of combined experience in the moving and logistics industry, our leadership team decided to build something different — a direct carrier, not a broker, where every crew member is our employee, every truck is ours, and every move carries our name.</p>
              <p>We started with local moves across Carrollton, Plano, and the northern DFW suburbs over 15 years ago. Word spread quickly. We expanded throughout the entire DFW Metroplex, added a dedicated Austin service area, and began handling long-distance moves across Texas and neighboring states.</p>
              <p>Today, over 5,430 families and businesses have trusted us with their most valuable possessions. That number still means something to us.</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-primary text-primary-foreground rounded-2xl p-10 mb-6">
              <div className="grid grid-cols-2 gap-8">
                <AnimatedStat target={5430} suffix="+" label="Moves Completed" delay={0} />
                <AnimatedStat target={49} suffix="" label="Average Rating" isDecimal delay={150} />
                <AnimatedStat target={40} suffix="+" label="Cities Served" delay={300} />
                <AnimatedStat target={15} suffix="+" label="Years in Business" delay={450} />
              </div>
            </div>
            <div className="bg-secondary/40 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">Headquarters</div>
                  <div className="text-muted-foreground text-sm">Carrollton, TX 75006</div>
                </div>
              </div>
              <div className="flex items-start gap-3 mb-3">
                <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">(660) 667-7770</div>
                  <div className="text-muted-foreground text-sm">Mon–Sun, 7am–8pm CST</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">Licensed Direct Carrier</div>
                  <div className="text-muted-foreground text-sm">TXDOT Motor Carrier · Fully Insured</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-serif font-bold mb-12 text-center">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div key={value.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 border border-border rounded-xl hover:shadow-sm transition-shadow">
                  <div className="w-10 h-10 bg-secondary flex items-center justify-center rounded-lg mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-serif font-bold text-lg mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* What makes us different */}
        <div className="bg-muted/40 rounded-2xl p-10 mb-20">
          <h2 className="text-3xl font-serif font-bold mb-8 text-center">Direct Carrier. Not a Broker.</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: "Our employees, not contractors", desc: "Every crew member is hired, trained, and background-checked by us. No day-labor surprises on your moving day." },
              { title: "Our trucks, our equipment", desc: "We maintain our own fleet. Your belongings aren't being loaded into a rented U-Haul driven by a subcontractor." },
              { title: "Transparent pricing", desc: "We show you a price range based on your actual inventory — not a bait quote that doubles when the crew arrives." },
              { title: "One coordinator, start to finish", desc: "You'll have one point of contact who knows your move and answers the phone when you call." },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium mb-1">{item.title}</div>
                  <div className="text-muted-foreground text-sm">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary text-primary-foreground rounded-2xl p-10 text-center">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />)}
          </div>
          <h2 className="text-3xl font-serif font-bold mb-4">Ready to experience the difference?</h2>
          <p className="text-primary-foreground/70 mb-8">Call us at (660) 667-7770 or get a free price range estimate online.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/calculator"><button className="px-8 py-3 bg-secondary text-secondary-foreground rounded font-semibold hover:bg-secondary/90 transition-colors">Get a Free Quote</button></Link>
            <a href="tel:6606677770"><button className="px-8 py-3 border border-primary-foreground/30 text-primary-foreground rounded font-semibold hover:bg-primary-foreground/10 transition-colors">(660) 667-7770</button></a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
