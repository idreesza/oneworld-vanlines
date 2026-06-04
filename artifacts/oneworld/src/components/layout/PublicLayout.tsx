import { Link } from "wouter";
import { UserButton, useUser } from "@clerk/react";
import { MessageCircle, Menu, X, Phone, ArrowRight, Clock, Facebook } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Calculator", href: "/calculator" },
    { label: "Areas", href: "/areas" },
    { label: "Gallery", href: "/gallery" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground font-sans overflow-x-hidden">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4 md:px-8 text-xs font-medium flex justify-between items-center gap-4">
        <div className="hidden md:flex items-center gap-6">
          <a href="tel:6606677770" className="flex items-center gap-1.5 hover:text-secondary transition-colors">
            <Phone className="w-3 h-3" /> (660) 667-7770
          </a>
          <span className="flex items-center gap-1.5 text-primary-foreground/60">
            <Clock className="w-3 h-3" /> Mon–Sun 7am–8pm CST
          </span>
        </div>
        <div className="flex items-center gap-4 ml-auto min-w-0">
          <span className="text-primary-foreground/60 hidden sm:inline">oneworldvanlines.net · Carrollton, TX · DFW & Austin</span>
          <span className="text-primary-foreground/60 sm:hidden">Carrollton, TX</span>
          <Link href={isSignedIn ? "/admin" : "/sign-in"} className="hover:text-secondary transition-colors underline-offset-2 hover:underline">
            {isSignedIn ? "Portal" : "Sign In"}
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-background/97 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="h-14 w-14 rounded-full overflow-hidden shadow-sm shrink-0">
              <img src="/logo.jpg" alt="OneWorld Van Lines" className="h-full w-full object-cover scale-125 group-hover:opacity-90 transition-opacity" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-serif font-bold text-xl tracking-tight">One World</span>
              <span className="font-serif font-bold text-xl tracking-tight">Van Lines</span>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-7">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden xl:flex items-center gap-3">
            <a href="tel:6606677770" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              <Phone className="w-4 h-4" /> (660) 667-7770
            </a>
            {isSignedIn && <UserButton />}
            <Button asChild className="font-semibold">
              <Link href="/calculator">Get a Quote <ArrowRight className="w-4 h-4 ml-1.5" /></Link>
            </Button>
          </div>

          <button className="xl:hidden p-2 text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="xl:hidden bg-background border-t border-border px-4 py-6 space-y-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="block px-3 py-2.5 text-base font-medium text-foreground hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-border flex flex-col gap-3">
              <a href="tel:6606677770" className="flex items-center gap-2 px-3 py-2.5 text-base font-medium text-foreground">
                <Phone className="w-5 h-5" /> (660) 667-7770
              </a>
              {isSignedIn && <div className="px-3"><UserButton /></div>}
              <Button asChild className="mx-3" onClick={() => setMobileMenuOpen(false)}>
                <Link href="/calculator">Get a Free Quote <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground pt-16 pb-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-10 mb-12">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-14 w-14 rounded-full overflow-hidden shadow-md shrink-0">
                <img src="/logo.jpg" alt="OneWorld Van Lines" className="h-full w-full object-cover scale-125" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-serif font-bold text-lg tracking-tight text-primary-foreground">One World</span>
                <span className="font-serif font-bold text-lg tracking-tight text-primary-foreground">Van Lines</span>
              </div>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed mb-4 max-w-xs">
              Premium moving and logistics services headquartered in Carrollton, TX. Serving the DFW Metroplex and Greater Austin with licensed, insured crews.
            </p>
            <div className="text-xs text-primary-foreground/40 mb-2">
              <a href="https://oneworldvanlines.net" className="hover:text-white transition-colors">oneworldvanlines.net</a>
            </div>
            <div className="space-y-2 text-sm text-primary-foreground/70">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                <a href="tel:6606677770" className="hover:text-white">(660) 667-7770</a>
              </div>
              <div className="flex items-start gap-2">
                <MessageCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <a href="https://wa.me/16606677770" className="hover:text-white">WhatsApp Us</a>
              </div>
              <div className="flex items-start gap-2">
                <Facebook className="w-4 h-4 mt-0.5 shrink-0" />
                <a href="https://www.facebook.com/61576829608339/" target="_blank" rel="noopener noreferrer" className="hover:text-white">Follow us on Facebook</a>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Mon–Sun · 7am–8pm CST</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-base mb-4 text-secondary">Services</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              {[["Residential Moving", "/services/residential"], ["Apartment Moving", "/services/apartment"], ["Commercial Moving", "/services/commercial"], ["Long-Distance", "/services/long-distance"], ["Packing Services", "/services/packing"], ["Storage Solutions", "/services/storage"], ["Specialty Items", "/services/specialty"]].map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-base mb-4 text-secondary">DFW Cities</h4>
            <ul className="space-y-1.5 text-sm text-primary-foreground/70">
              {[
                ["Carrollton (HQ)", "/locations/carrollton"],
                ["Dallas", "/locations/dallas"],
                ["Plano", "/locations/plano"],
                ["Frisco", "/locations/frisco"],
                ["McKinney", "/locations/mckinney"],
                ["Allen", "/locations/allen"],
                ["Richardson", "/locations/richardson"],
                ["Irving", "/locations/irving"],
                ["Arlington", "/locations/arlington"],
                ["Fort Worth", "/locations/fort-worth"],
                ["Grand Prairie", "/locations/grand-prairie"],
                ["Garland", "/locations/garland"],
                ["Mesquite", "/locations/mesquite"],
                ["Denton", "/locations/denton"],
                ["Lewisville", "/locations/lewisville"],
                ["Flower Mound", "/locations/flower-mound"],
                ["Grapevine", "/locations/grapevine"],
                ["Southlake", "/locations/southlake"],
                ["Euless", "/locations/euless"],
                ["Bedford", "/locations/bedford"],
                ["Mansfield", "/locations/mansfield"],
              ].map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-base mb-4 text-secondary">Greater Austin</h4>
            <ul className="space-y-1.5 text-sm text-primary-foreground/70">
              {[
                ["Austin", "/locations/austin"],
                ["Round Rock", "/locations/round-rock"],
                ["Cedar Park", "/locations/cedar-park"],
                ["Pflugerville", "/locations/pflugerville"],
                ["Georgetown", "/locations/georgetown"],
                ["Kyle", "/locations/kyle"],
                ["Buda", "/locations/buda"],
                ["Leander", "/locations/leander"],
              ].map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-base mb-4 text-secondary">Company</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              {[["About Us", "/about"], ["Service Areas", "/areas"], ["Moving Calculator", "/calculator"], ["FAQ", "/faq"], ["Blog", "/blog"], ["Moving Checklist", "/moving-checklist"], ["Contact", "/contact"], ["Payment Methods", "/payment"]].map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
            <h4 className="font-serif font-semibold text-base mt-6 mb-3 text-secondary">Legal</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              {[["Privacy Policy", "/privacy"], ["Terms & Conditions", "/terms"], ["Cookie Policy", "/legal/cookies"]].map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/40">
          <span>&copy; {new Date().getFullYear()} One World Van Lines. All rights reserved.</span>
          <span className="text-center">2305 Belt Line Rd #120B, Carrollton, TX 75006 · <a href="tel:6606677770" className="hover:text-white transition-colors">(660) 667-7770</a> · <a href="mailto:Sales@oneworldvanlines.net" className="hover:text-white transition-colors">Sales@oneworldvanlines.net</a></span>
          <span>USDOT 2388619 · MC 820945 · Licensed &amp; Insured in TX</span>
        </div>
      </footer>

      {/* WhatsApp */}
      <a href="https://wa.me/16606677770" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-xl flex items-center justify-center hover:bg-[#20bd5a] hover:scale-110 transition-all z-50 group"
        aria-label="Chat on WhatsApp">
        <MessageCircle className="w-6 h-6" />
        <span className="absolute right-16 bg-foreground text-background text-xs px-3 py-1.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
}
