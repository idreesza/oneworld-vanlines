import { motion } from "framer-motion";
import { Link } from "wouter";
import PublicLayout from "@/components/layout/PublicLayout";
import { MapPin, Star, ArrowRight } from "lucide-react";

type City = { name: string; slug: string; isHQ?: boolean };

const dfwCities: City[] = [
  { name: "Carrollton", slug: "carrollton", isHQ: true },
  { name: "Plano", slug: "plano" },
  { name: "Frisco", slug: "frisco" },
  { name: "McKinney", slug: "mckinney" },
  { name: "Allen", slug: "allen" },
  { name: "Richardson", slug: "richardson" },
  { name: "Irving", slug: "irving" },
  { name: "Arlington", slug: "arlington" },
  { name: "Dallas", slug: "dallas" },
  { name: "Fort Worth", slug: "fort-worth" },
  { name: "Grand Prairie", slug: "grand-prairie" },
  { name: "Garland", slug: "garland" },
  { name: "Mesquite", slug: "mesquite" },
  { name: "Denton", slug: "denton" },
  { name: "Lewisville", slug: "lewisville" },
  { name: "Flower Mound", slug: "flower-mound" },
  { name: "Grapevine", slug: "grapevine" },
  { name: "Southlake", slug: "southlake" },
  { name: "Colleyville", slug: "colleyville" },
  { name: "Coppell", slug: "coppell" },
  { name: "Keller", slug: "keller" },
  { name: "Euless", slug: "euless" },
  { name: "Bedford", slug: "bedford" },
  { name: "Hurst", slug: "hurst" },
  { name: "Mansfield", slug: "mansfield" },
  { name: "DeSoto", slug: "desoto" },
  { name: "Cedar Hill", slug: "cedar-hill" },
  { name: "Duncanville", slug: "duncanville" },
];

const austinCities: City[] = [
  { name: "Austin", slug: "austin" },
  { name: "Round Rock", slug: "round-rock" },
  { name: "Cedar Park", slug: "cedar-park" },
  { name: "Pflugerville", slug: "pflugerville" },
  { name: "Georgetown", slug: "georgetown" },
  { name: "Kyle", slug: "kyle" },
  { name: "Buda", slug: "buda" },
  { name: "Leander", slug: "leander" },
  { name: "Manor", slug: "manor" },
  { name: "Bastrop", slug: "bastrop" },
  { name: "San Marcos", slug: "san-marcos" },
  { name: "New Braunfels", slug: "new-braunfels" },
  { name: "Lakeway", slug: "lakeway" },
  { name: "Bee Cave", slug: "bee-cave" },
  { name: "Dripping Springs", slug: "dripping-springs" },
  { name: "Wimberley", slug: "wimberley" },
];

const featuredCities = [
  { name: "Carrollton", slug: "carrollton", desc: "Our headquarters. We know every neighborhood, street, and building here.", isHQ: true },
  { name: "Plano", slug: "plano", desc: "Heavy demand area — same-day crews often available for local Plano moves." },
  { name: "Frisco", slug: "frisco", desc: "One of Texas's fastest-growing cities. We move dozens of families here every month." },
  { name: "McKinney", slug: "mckinney", desc: "Trusted mover for McKinney's booming residential community since day one." },
  { name: "Irving", slug: "irving", desc: "Commercial and residential moves throughout Las Colinas and all of Irving." },
  { name: "Austin", slug: "austin", desc: "Full Greater Austin service — local and as a long-distance destination from DFW." },
];

export default function Areas() {
  return (
    <PublicLayout>
      <section className="bg-primary text-primary-foreground py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-secondary mb-4">Where We Operate</p>
          <h1 className="text-5xl font-serif font-bold mb-4">Service Areas</h1>
          <p className="text-primary-foreground/70 text-xl max-w-2xl mx-auto">
            Headquartered in Carrollton, TX — serving every corner of the DFW Metroplex and Greater Austin with licensed, insured crews.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* HQ Callout */}
        <div className="bg-secondary/30 border border-secondary/50 rounded-2xl p-8 mb-16 flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shrink-0">
            <MapPin className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-serif font-bold">Carrollton, TX — Our Home Base</h2>
              <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded">HQ</span>
            </div>
            <p className="text-muted-foreground">OneWorld Van Lines is based in Carrollton, TX 75006. Our office, trucks, and crew all operate from here. We know DFW and Greater Austin like home — because it is.</p>
          </div>
          <Link href="/locations/carrollton" className="ml-auto shrink-0">
            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap">
              Carrollton Page <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* Featured Cities */}
        <h2 className="text-3xl font-serif font-bold mb-8">Featured Service Cities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {featuredCities.map((city, i) => (
            <motion.div key={city.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <Link href={`/locations/${city.slug}`}>
                <div className="group border border-border rounded-xl p-6 hover:border-primary hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-serif font-bold text-lg">{city.name}</span>
                    {city.isHQ && <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">HQ</span>}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{city.desc}</p>
                  <div className="flex items-center gap-1 text-primary text-sm font-medium mt-4">
                    View moving info <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* All Cities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {[
            { area: "Dallas / Fort Worth Metroplex", cities: dfwCities, color: "bg-blue-50 border-blue-100" },
            { area: "Greater Austin", cities: austinCities, color: "bg-amber-50 border-amber-100" },
          ].map(({ area, cities, color }) => (
            <div key={area} className={`rounded-xl border ${color} p-8`}>
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-serif font-bold">{area}</h2>
              </div>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                {cities.map(city => (
                  <Link key={city.slug} href={`/locations/${city.slug}`}>
                    <div className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors py-0.5 cursor-pointer group">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${city.isHQ ? "bg-primary" : "bg-muted-foreground/40 group-hover:bg-primary"} transition-colors`} />
                      {city.name}{city.isHQ ? " ★" : ""}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-primary text-primary-foreground rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Don't see your city?</h2>
          <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">
            We serve dozens of additional communities across North Texas and Central Texas, including long-distance routes to neighboring states. Call to confirm your route.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:6606677770" className="inline-block bg-secondary text-secondary-foreground px-8 py-3 rounded font-semibold hover:bg-secondary/90 transition-colors">(660) 667-7770</a>
            <Link href="/calculator"><button className="px-8 py-3 border border-primary-foreground/30 text-primary-foreground rounded font-semibold hover:bg-primary-foreground/10 transition-colors">Get a Quote Online</button></Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
