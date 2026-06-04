import { Link } from "wouter";
import { motion } from "framer-motion";
import PublicLayout from "@/components/layout/PublicLayout";
import { ArrowRight } from "lucide-react";

const services = [
  {
    slug: "residential",
    title: "Residential Moving",
    desc: "Full-service home moving across DFW and Austin. From studios to estates, we handle every detail with care and precision.",
    image: "/services/residential-moving.png",
    tag: "Most Popular",
  },
  {
    slug: "apartment",
    title: "Apartment Moving",
    desc: "Expert apartment moves with elevator coordination, parking permits, and careful stairwell handling in any high-rise or complex.",
    image: "/services/apartment-moving.png",
    tag: null,
  },
  {
    slug: "commercial",
    title: "Commercial & Office",
    desc: "Office relocations, corporate moves, and business transitions with minimal downtime. After-hours options available.",
    image: "/services/commercial-moving.png",
    tag: "After-Hours Available",
  },
  {
    slug: "local",
    title: "Local Moving",
    desc: "Fast, reliable local moves throughout DFW and Austin metro areas. Same-day availability based on schedule.",
    image: "/services/local-moving.png",
    tag: null,
  },
  {
    slug: "long-distance",
    title: "Long-Distance Moving",
    desc: "Interstate and cross-country moves with full GPS tracking, dedicated trucks, and fixed delivery windows. No shared loads.",
    image: "/services/long-distance-moving.png",
    tag: "Dedicated Truck",
  },
  {
    slug: "packing",
    title: "Packing Services",
    desc: "Professional packing and unpacking with premium materials. Full or partial service. Priced at $1 per cubic foot — transparent, fair.",
    image: "/services/packing-services.png",
    tag: "$1/cu ft",
  },
  {
    slug: "storage",
    title: "Storage Solutions",
    desc: "Secure, climate-controlled storage for short or long-term needs when your timeline doesn't align with your move date.",
    image: "/services/storage-solutions.png",
    tag: "Climate-Controlled",
  },
];

const specialtyService = {
  slug: "specialty",
  title: "Specialty Item Moving",
  desc: "Pianos, safes, antiques, fine art, and oversized items handled by trained specialists with the right equipment.",
  tag: "White-Glove",
  panels: [
    { image: "/services/specialty-safe.png", label: "Safes" },
    { image: "/services/specialty-piano.png", label: "Pianos" },
    { image: "/services/specialty-hottub.png", label: "Hot Tubs" },
  ],
};

export default function Services() {
  return (
    <PublicLayout>
      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-secondary mb-4">What We Offer</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Moving Services Built for Texas</h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            Whether you're moving across the street or across the state, OneWorld Van Lines delivers the same premium, accountable service with licensed crews and owned trucks.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/services/${service.slug}`}>
                <div className="group border border-border rounded-xl overflow-hidden hover:border-primary hover:shadow-lg transition-all cursor-pointer h-full flex flex-col">
                  {/* Photo */}
                  <div className="relative h-44 overflow-hidden bg-muted">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                    {service.tag && (
                      <span className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">
                        {service.tag}
                      </span>
                    )}
                  </div>
                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-serif font-bold text-lg mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1">{service.desc}</p>
                    <div className="flex items-center gap-1 text-primary text-sm font-medium mt-4">
                      Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Specialty — triptych card */}
          <motion.div
            key={specialtyService.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: services.length * 0.05 }}
          >
            <Link href={`/services/${specialtyService.slug}`}>
              <div className="group border border-border rounded-xl overflow-hidden hover:border-primary hover:shadow-lg transition-all cursor-pointer h-full flex flex-col">
                {/* Triptych photo strip */}
                <div className="relative h-44 overflow-hidden bg-muted flex">
                  {specialtyService.panels.map((panel, idx) => (
                    <div key={idx} className="relative flex-1 overflow-hidden">
                      <img
                        src={panel.image}
                        alt={panel.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
                      <span className="absolute bottom-2 left-0 right-0 text-center text-white text-[10px] font-bold uppercase tracking-widest">
                        {panel.label}
                      </span>
                      {idx < specialtyService.panels.length - 1 && (
                        <div className="absolute top-0 right-0 bottom-0 w-px bg-white/30" />
                      )}
                    </div>
                  ))}
                  {specialtyService.tag && (
                    <span className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full z-10">
                      {specialtyService.tag}
                    </span>
                  )}
                </div>
                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-serif font-bold text-lg mb-2 group-hover:text-primary transition-colors">{specialtyService.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">{specialtyService.desc}</p>
                  <div className="flex items-center gap-1 text-primary text-sm font-medium mt-4">
                    Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* CTA */}
        <div className="mt-20 bg-primary text-primary-foreground rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Not sure what you need?</h2>
          <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">
            Use our calculator for a price range, or call us directly. We'll help you plan the right move.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/calculator">
              <button className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 transition-colors">
                Get a Price Range
              </button>
            </Link>
            <a href="tel:6606677770" className="px-8 py-3 border border-primary-foreground/30 text-primary-foreground rounded-lg font-semibold hover:bg-primary-foreground/10 transition-colors">
              Call (660) 667-7770
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
