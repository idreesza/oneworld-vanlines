import { useState } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { Link } from "wouter";
import { CheckCircle2, Circle, Printer, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type CheckItem = { id: string; text: string; done: boolean };
type Phase = { title: string; weeks: string; items: CheckItem[] };

const initialPhases: Phase[] = [
  {
    title: "8 Weeks Before Moving",
    weeks: "8 weeks out",
    items: [
      { id: "a1", text: "Choose a reputable, licensed moving company and book your date", done: false },
      { id: "a2", text: "Give written notice to your landlord (if renting)", done: false },
      { id: "a3", text: "Start decluttering — donate, sell, or discard what you won't move", done: false },
      { id: "a4", text: "Create a home inventory spreadsheet for insurance purposes", done: false },
      { id: "a5", text: "Research your new neighborhood: schools, utilities, HOA rules", done: false },
      { id: "a6", text: "Begin collecting packing supplies (boxes, tape, bubble wrap)", done: false },
    ],
  },
  {
    title: "6 Weeks Before Moving",
    weeks: "6 weeks out",
    items: [
      { id: "b1", text: "Book travel arrangements if moving long-distance (flights, hotel)", done: false },
      { id: "b2", text: "Forward your mail with USPS Change of Address", done: false },
      { id: "b3", text: "Notify employer of new address", done: false },
      { id: "b4", text: "Transfer school records if you have children", done: false },
      { id: "b5", text: "Research new doctors, dentists, and veterinarians at your destination", done: false },
      { id: "b6", text: "Start packing non-essential rooms (garage, attic, guest rooms)", done: false },
    ],
  },
  {
    title: "4 Weeks Before Moving",
    weeks: "4 weeks out",
    items: [
      { id: "c1", text: "Confirm your move date and details with OneWorld Van Lines", done: false },
      { id: "c2", text: "Notify banks, credit cards, and financial institutions of address change", done: false },
      { id: "c3", text: "Update subscriptions: Amazon, streaming, magazines, delivery services", done: false },
      { id: "c4", text: "Arrange transfer or termination of utilities at current address", done: false },
      { id: "c5", text: "Set up utilities at new address (electricity, gas, water, internet)", done: false },
      { id: "c6", text: "Pack books, seasonal items, and items you rarely use", done: false },
      { id: "c7", text: "Make arrangements for pets and children on moving day", done: false },
    ],
  },
  {
    title: "2 Weeks Before Moving",
    weeks: "2 weeks out",
    items: [
      { id: "d1", text: "Confirm elevator reservation and parking permit with building management", done: false },
      { id: "d2", text: "Defrost refrigerator and freezer if moving appliances", done: false },
      { id: "d3", text: "Return borrowed items; collect items you've lent out", done: false },
      { id: "d4", text: "Pack clothing except what you'll need for the next 2 weeks", done: false },
      { id: "d5", text: "Label all boxes clearly: room + brief description of contents", done: false },
      { id: "d6", text: "Dispose of hazardous materials: propane, paint, chemicals (cannot be moved)", done: false },
    ],
  },
  {
    title: "Moving Week",
    weeks: "1 week out",
    items: [
      { id: "e1", text: "Pack an essentials bag: phone charger, toiletries, medications, change of clothes", done: false },
      { id: "e2", text: "Pack valuables separately to transport yourself (jewelry, documents, cash)", done: false },
      { id: "e3", text: "Photograph every room before packing for insurance reference", done: false },
      { id: "e4", text: "Confirm move-in time with your new building or landlord", done: false },
      { id: "e5", text: "Charge all electronics and back up important data", done: false },
      { id: "e6", text: "Prepare payment for your movers (cash, Zelle, or card)", done: false },
    ],
  },
  {
    title: "Moving Day",
    weeks: "The big day",
    items: [
      { id: "f1", text: "Be present when the crew arrives — do a walkthrough together", done: false },
      { id: "f2", text: "Protect floors and doorways (your crew will handle this)", done: false },
      { id: "f3", text: "Keep children and pets out of the work area for safety", done: false },
      { id: "f4", text: "Do a final room-by-room walkthrough before the truck leaves", done: false },
      { id: "f5", text: "Check all closets, attic spaces, cabinets, and the garage", done: false },
      { id: "f6", text: "Return all keys, fobs, and access cards to your landlord", done: false },
      { id: "f7", text: "Take final photos of the empty unit for move-out documentation", done: false },
    ],
  },
  {
    title: "After the Move",
    weeks: "First week",
    items: [
      { id: "g1", text: "Unpack essentials first: bedroom, bathroom, kitchen", done: false },
      { id: "g2", text: "Check that all boxes were delivered — verify against inventory list", done: false },
      { id: "g3", text: "Update your driver's license and vehicle registration with new address", done: false },
      { id: "g4", text: "Register to vote at your new address", done: false },
      { id: "g5", text: "Introduce yourself to neighbors (especially important in Texas)", done: false },
      { id: "g6", text: "Set up your home security system if applicable", done: false },
    ],
  },
];

export default function MovingChecklist() {
  const [phases, setPhases] = useState<Phase[]>(initialPhases);

  const toggle = (phaseIdx: number, itemId: string) => {
    setPhases(prev => prev.map((p, pi) => pi !== phaseIdx ? p : {
      ...p,
      items: p.items.map(item => item.id === itemId ? { ...item, done: !item.done } : item),
    }));
  };

  const totalItems = phases.reduce((sum, p) => sum + p.items.length, 0);
  const doneItems = phases.reduce((sum, p) => sum + p.items.filter(i => i.done).length, 0);
  const progress = Math.round((doneItems / totalItems) * 100);

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">Free Tool</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">The Complete Moving Checklist</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Every task you need to track — from 8 weeks out to after you've unpacked. Check them off as you go.</p>
        </div>

        {/* Progress */}
        <div className="bg-secondary/30 rounded-xl p-6 mb-10">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">{doneItems} of {totalItems} tasks complete</span>
            <span className="text-2xl font-serif font-bold text-primary">{progress}%</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          {progress === 100 && (
            <div className="mt-4 text-center text-green-600 font-semibold">All done! You're ready to move.</div>
          )}
        </div>

        <div className="space-y-10">
          {phases.map((phase, pi) => {
            const phaseDone = phase.items.filter(i => i.done).length;
            return (
              <motion.div key={phase.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-serif font-bold">{phase.title}</h2>
                    <span className="text-sm text-muted-foreground">{phase.weeks} · {phaseDone}/{phase.items.length} done</span>
                  </div>
                  {phaseDone === phase.items.length && (
                    <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" /> Complete
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {phase.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => toggle(pi, item.id)}
                      className={`w-full flex items-center gap-3 p-4 rounded-lg border text-left transition-all ${item.done ? "bg-green-50 border-green-200" : "bg-background border-border hover:border-primary/40"}`}
                    >
                      {item.done
                        ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        : <Circle className="w-5 h-5 text-muted-foreground/40 shrink-0" />
                      }
                      <span className={`text-sm ${item.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{item.text}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 bg-primary text-primary-foreground rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Ready to book your move?</h2>
          <p className="text-primary-foreground/70 mb-6">Get a free price range from OneWorld Van Lines — based in Carrollton, serving all of DFW and Austin.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/calculator"><button className="px-8 py-3 bg-secondary text-secondary-foreground rounded font-semibold hover:bg-secondary/90 transition-colors flex items-center gap-2">Get a Quote <ArrowRight className="w-4 h-4" /></button></Link>
            <a href="tel:6606677770"><button className="px-8 py-3 border border-primary-foreground/30 text-primary-foreground rounded font-semibold hover:bg-primary-foreground/10 transition-colors">(660) 667-7770</button></a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
