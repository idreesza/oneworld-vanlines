import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateEstimate, useCreateLead } from "@workspace/api-client-react";
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle, ChevronRight, ChevronLeft, Phone, Zap, ClipboardList,
  Package, MapPin, Truck, RotateCcw, User, Mail, Calendar
} from "lucide-react";
import MoveDatePicker from "@/components/ui/MoveDatePicker";
import { useSearch } from "wouter";

// ─── BEDROOM PRESETS ──────────────────────────────────────────────────────────
const BEDROOM_DATA = [
  { bedrooms: 0, label: "Studio",      avgCuft: 350,  avgBoxes: 15, emoji: "🏠", desc: "~350 cu ft  ·  Small studio or efficiency" },
  { bedrooms: 1, label: "1 Bedroom",   avgCuft: 500,  avgBoxes: 20, emoji: "🏠", desc: "~500 cu ft  ·  One-bedroom apartment or condo" },
  { bedrooms: 2, label: "2 Bedrooms",  avgCuft: 750,  avgBoxes: 30, emoji: "🏡", desc: "~750 cu ft  ·  Two-bedroom home or apartment" },
  { bedrooms: 3, label: "3 Bedrooms",  avgCuft: 1200, avgBoxes: 45, emoji: "🏘️", desc: "~1,200 cu ft  ·  Three-bedroom family home" },
  { bedrooms: 4, label: "4 Bedrooms",  avgCuft: 1500, avgBoxes: 60, emoji: "🏰", desc: "~1,500 cu ft  ·  Large four-bedroom home" },
  { bedrooms: 5, label: "5+ Bedrooms", avgCuft: 1700, avgBoxes: 80, emoji: "🏰", desc: "~1,700+ cu ft  ·  Estate or large family home" },
];

// ─── ROOM INVENTORY ──────────────────────────────────────────────────────────
const ROOMS = [
  {
    name: "Living Room", emoji: "🛋️",
    items: [
      { name: "Sofa (3-seat)", emoji: "🛋️", cubicFeet: 50 },
      { name: "Loveseat", emoji: "🛋️", cubicFeet: 35 },
      { name: "Armchair / Recliner", emoji: "💺", cubicFeet: 22 },
      { name: "Coffee Table", emoji: "🪵", cubicFeet: 10 },
      { name: "TV Stand / Media Center", emoji: "📺", cubicFeet: 18 },
      { name: "Bookshelf (tall)", emoji: "📚", cubicFeet: 25 },
      { name: "Entertainment Center", emoji: "📺", cubicFeet: 35 },
      { name: "Side Table / End Table", emoji: "🪵", cubicFeet: 6 },
    ]
  },
  {
    name: "Bedrooms", emoji: "🛏️",
    items: [
      { name: "King Bed Frame + Mattress", emoji: "🛏️", cubicFeet: 80 },
      { name: "Queen Bed Frame + Mattress", emoji: "🛏️", cubicFeet: 60 },
      { name: "Full / Double Bed Frame", emoji: "🛏️", cubicFeet: 45 },
      { name: "Twin Bed Frame", emoji: "🛏️", cubicFeet: 35 },
      { name: "Dresser (tall)", emoji: "🗄️", cubicFeet: 40 },
      { name: "Dresser (wide / low)", emoji: "🗄️", cubicFeet: 32 },
      { name: "Nightstand", emoji: "🕯️", cubicFeet: 8 },
      { name: "Wardrobe / Armoire", emoji: "👔", cubicFeet: 60 },
      { name: "Chest of Drawers", emoji: "🗄️", cubicFeet: 28 },
      { name: "Vanity with Mirror", emoji: "🪞", cubicFeet: 25 },
    ]
  },
  {
    name: "Dining Room", emoji: "🍽️",
    items: [
      { name: "Dining Table (6-seat)", emoji: "🍽️", cubicFeet: 45 },
      { name: "Dining Table (4-seat)", emoji: "🍽️", cubicFeet: 30 },
      { name: "Dining Chair", emoji: "🪑", cubicFeet: 7 },
      { name: "China Cabinet / Hutch", emoji: "🥂", cubicFeet: 35 },
      { name: "Sideboard / Buffet", emoji: "🍷", cubicFeet: 25 },
      { name: "Bar Cart", emoji: "🥃", cubicFeet: 10 },
    ]
  },
  {
    name: "Kitchen & Appliances", emoji: "🧊",
    items: [
      { name: "Refrigerator (large)", emoji: "🧊", cubicFeet: 45 },
      { name: "Refrigerator (small / mini)", emoji: "🧊", cubicFeet: 25 },
      { name: "Washer", emoji: "🫧", cubicFeet: 30 },
      { name: "Dryer", emoji: "💨", cubicFeet: 30 },
      { name: "Dishwasher", emoji: "🍽️", cubicFeet: 20 },
      { name: "Microwave (countertop)", emoji: "📡", cubicFeet: 5 },
    ]
  },
  {
    name: "Office / Study", emoji: "🖥️",
    items: [
      { name: "Desk (large / L-shape)", emoji: "🖥️", cubicFeet: 40 },
      { name: "Desk (standard)", emoji: "🖥️", cubicFeet: 22 },
      { name: "Office Chair", emoji: "💺", cubicFeet: 15 },
      { name: "Filing Cabinet (4-drawer)", emoji: "📁", cubicFeet: 20 },
      { name: "Filing Cabinet (2-drawer)", emoji: "📁", cubicFeet: 10 },
      { name: "Bookshelf / Credenza", emoji: "📚", cubicFeet: 22 },
    ]
  },
  {
    name: "Specialty / Heavy Items", emoji: "🎹",
    items: [
      { name: "Piano (upright)", emoji: "🎹", cubicFeet: 120 },
      { name: "Piano (grand)", emoji: "🎹", cubicFeet: 200 },
      { name: "Gun Safe (large)", emoji: "🔒", cubicFeet: 20 },
      { name: "Pool Table", emoji: "🎱", cubicFeet: 150 },
      { name: "Hot Tub", emoji: "🛁", cubicFeet: 180 },
      { name: "Motorcycle", emoji: "🏍️", cubicFeet: 100 },
      { name: "Gym Equipment (full set)", emoji: "🏋️", cubicFeet: 80 },
      { name: "Treadmill / Elliptical", emoji: "🏃", cubicFeet: 35 },
      { name: "Large Art / Mirror", emoji: "🖼️", cubicFeet: 20 },
    ]
  },
];

// ─── MATERIALS ESTIMATOR DATA ─────────────────────────────────────────────────
// Industry averages sourced from U-Haul kits, Extra Space Storage, and MiniMoves research
const MATERIALS_BY_BR: Record<number, {
  smallBoxes: [number, number];
  mediumBoxes: [number, number];
  largeBoxes: [number, number];
  wardrobeBoxes: [number, number];
  dishPackBoxes: [number, number];
  tapeRolls: [number, number];
  packingPaperLbs: [number, number];
  bubbleWrapRolls: [number, number];
  mattressBags: number;
  supplyCostLow: number;
  supplyCostHigh: number;
}> = {
  0: { smallBoxes:[6,10], mediumBoxes:[2,4], largeBoxes:[1,2], wardrobeBoxes:[1,2], dishPackBoxes:[1,2], tapeRolls:[2,3], packingPaperLbs:[6,10], bubbleWrapRolls:[1,2], mattressBags:1, supplyCostLow:75, supplyCostHigh:150 },
  1: { smallBoxes:[10,15], mediumBoxes:[3,5], largeBoxes:[2,3], wardrobeBoxes:[2,3], dishPackBoxes:[3,5], tapeRolls:[3,5], packingPaperLbs:[10,15], bubbleWrapRolls:[1,2], mattressBags:1, supplyCostLow:75, supplyCostHigh:150 },
  2: { smallBoxes:[15,25], mediumBoxes:[5,10], largeBoxes:[2,5], wardrobeBoxes:[2,3], dishPackBoxes:[3,5], tapeRolls:[3,6], packingPaperLbs:[10,15], bubbleWrapRolls:[2,3], mattressBags:2, supplyCostLow:100, supplyCostHigh:200 },
  3: { smallBoxes:[25,45], mediumBoxes:[12,22], largeBoxes:[5,12], wardrobeBoxes:[3,6], dishPackBoxes:[5,8], tapeRolls:[5,8], packingPaperLbs:[15,25], bubbleWrapRolls:[3,4], mattressBags:3, supplyCostLow:250, supplyCostHigh:400 },
  4: { smallBoxes:[35,60], mediumBoxes:[15,28], largeBoxes:[8,14], wardrobeBoxes:[5,9], dishPackBoxes:[6,9], tapeRolls:[8,12], packingPaperLbs:[22,35], bubbleWrapRolls:[4,6], mattressBags:4, supplyCostLow:350, supplyCostHigh:600 },
  5: { smallBoxes:[50,75], mediumBoxes:[20,38], largeBoxes:[10,18], wardrobeBoxes:[8,12], dishPackBoxes:[8,12], tapeRolls:[12,16], packingPaperLbs:[30,45], bubbleWrapRolls:[5,8], mattressBags:5, supplyCostLow:500, supplyCostHigh:900 },
};

const SUPPLY_STORES = [
  { name: "U-Haul", tag: "Full kits + individual supplies", url: "https://www.uhaul.com/MovingSupplies/Boxes/", color: "bg-orange-50 border-orange-200", dot: "bg-orange-500" },
  { name: "Home Depot", tag: "Widest selection, buy any quantity", url: "https://www.homedepot.com/s/moving%20boxes", color: "bg-orange-50 border-orange-200", dot: "bg-orange-600" },
  { name: "Lowe's", tag: "Competitive pricing, nearby locations", url: "https://www.lowes.com/search?searchTerm=moving+boxes", color: "bg-blue-50 border-blue-200", dot: "bg-blue-600" },
  { name: "Walmart", tag: "Best budget option, order online too", url: "https://www.walmart.com/search?q=moving+boxes", color: "bg-blue-50 border-blue-100", dot: "bg-blue-500" },
];

function rng(lo: number, hi: number) { return `${lo}–${hi}`; }

function MaterialsGuide({ bedrooms }: { bedrooms: number }) {
  const [open, setOpen] = useState(false);
  const br = Math.min(bedrooms, 5);
  const m = MATERIALS_BY_BR[br];
  const totalBoxLow = m.smallBoxes[0] + m.mediumBoxes[0] + m.largeBoxes[0] + m.wardrobeBoxes[0] + m.dishPackBoxes[0];
  const totalBoxHigh = m.smallBoxes[1] + m.mediumBoxes[1] + m.largeBoxes[1] + m.wardrobeBoxes[1] + m.dishPackBoxes[1];

  return (
    <div className="rounded-xl border-2 border-dashed border-primary/30 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-primary/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">📦</span>
          <div>
            <div className="font-semibold text-sm">Packing Supplies You'll Need</div>
            <div className="text-xs text-muted-foreground">~{totalBoxLow}–{totalBoxHigh} boxes + materials · Est. ${m.supplyCostLow}–${m.supplyCostHigh}</div>
          </div>
        </div>
        <div className={`text-xs font-medium text-primary flex items-center gap-1 transition-transform ${open ? "rotate-180" : ""}`}>
          <ChevronRight className={`w-4 h-4 transition-transform ${open ? "rotate-90" : ""}`} />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 space-y-5 border-t border-dashed border-primary/20 pt-4">

              {/* Box breakdown */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Boxes Breakdown</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Small boxes", img: "/materials/small-box.jpg", sub: "Books, pantry, tools", qty: rng(...m.smallBoxes) },
                    { label: "Medium boxes", img: "/materials/medium-box.jpg", sub: "Clothes, shoes, linens", qty: rng(...m.mediumBoxes) },
                    { label: "Large boxes", img: "/materials/large-box.jpg", sub: "Pillows, board games", qty: rng(...m.largeBoxes) },
                    { label: "Wardrobe boxes", img: "/materials/wardrobe-box.webp", sub: "Hanging clothes (~2 ft each)", qty: rng(...m.wardrobeBoxes) },
                    { label: "Dish-pack boxes", img: "/materials/dish-pack.webp", sub: "Fragile / kitchen items", qty: rng(...m.dishPackBoxes) },
                    { label: "Mattress bags", img: "/materials/mattress-bag.jpg", sub: "One per mattress", qty: `${m.mattressBags}` },
                  ].map(r => (
                    <div key={r.label} className="flex items-start gap-3 p-2.5 bg-secondary/30 rounded-lg">
                      <img
                        src={r.img}
                        alt={r.label}
                        className="w-12 h-12 object-cover rounded-md shrink-0 border border-border/40"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate">{r.label}</div>
                        <div className="text-[10px] text-muted-foreground leading-tight">{r.sub}</div>
                        <div className="text-sm font-bold text-primary mt-0.5">{r.qty}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supplies */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Packing Supplies</p>
                <div className="space-y-1.5">
                  {[
                    { label: "Packing tape", qty: `${rng(...m.tapeRolls)} rolls` },
                    { label: "Packing paper", qty: `${rng(...m.packingPaperLbs)} lbs` },
                    { label: "Bubble wrap", qty: `${rng(...m.bubbleWrapRolls)} rolls` },
                    { label: "Markers (for labeling)", qty: "2–4" },
                    { label: "Box cutter", qty: "1–2" },
                  ].map(s => (
                    <div key={s.label} className="flex justify-between text-xs py-1 border-b border-border/40 last:border-0">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className="font-semibold">{s.qty}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost estimate */}
              <div className="bg-primary/8 rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground mb-1">Estimated supplies cost (buying new)</div>
                <div className="text-xl font-serif font-bold text-primary">${m.supplyCostLow} – ${m.supplyCostHigh}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Buy used/free boxes from Facebook Marketplace or Nextdoor to save 50–70%</div>
              </div>

              {/* Store suggestions */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Where to Buy Supplies Near You</p>
                <div className="grid grid-cols-2 gap-2">
                  {SUPPLY_STORES.map(store => (
                    <a
                      key={store.name}
                      href={store.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-start gap-2 p-2.5 rounded-lg border ${store.color} hover:opacity-80 transition-opacity`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${store.dot} shrink-0 mt-1`} />
                      <div>
                        <div className="text-xs font-bold">{store.name}</div>
                        <div className="text-[10px] text-muted-foreground leading-tight">{store.tag}</div>
                      </div>
                    </a>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 text-center">All 4 chains have multiple locations throughout DFW & Austin</p>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── PRICING ENGINE ───────────────────────────────────────────────────────────
const BOX_CUFT = 1.5;
const CUFT_TO_LBS = 7; // industry average: ~7 lbs per cubic foot

// ─── CREW OPTIONS — local & mid-range hourly ──────────────────────────────────
const CREW_OPTIONS = [
  { men: 2, rate: 169, minCharge: 507, label: "2 Men + Truck" },
  { men: 3, rate: 199, minCharge: 597, label: "3 Men + Truck" },
  { men: 4, rate: 229, minCharge: 687, label: "4 Men + Truck" },
];

// ─── LONG DISTANCE BANDS — cu ft-based ───────────────────────────────────────
const LONG_DIST_BANDS = [
  { id: "ld_300_500",   label: "300–500 mi",     rateLo: 4.00, rateHi: 5.50, noMax: false },
  { id: "ld_500_1000",  label: "500–1,000 mi",   rateLo: 5.50, rateHi: 6.50, noMax: false },
  { id: "ld_1000_1300", label: "1,000–1,300 mi", rateLo: 6.50, rateHi: 8.00, noMax: false },
  { id: "ld_1300plus",  label: "1,300+ mi",       rateLo: 7.50, rateHi: 9.00, noMax: true  },
];

// Fixed hour ranges per bedroom count — same for all crew sizes
const BEDROOM_HOURS: Record<number, [number, number]> = {
  0: [3,  5],   // Studio
  1: [4,  6],   // 1 BR
  2: [6, 10],   // 2 BR
  3: [8, 14],   // 3 BR
  4: [12, 18],  // 4 BR
  5: [18, 32],  // 5+ BR
};

// Hourly engine — local + mid-range
// Formula: max(minCharge, hours × rate) + 10% fuel + stairs + packing
function calcHourly(
  br: number,
  rate: number, minCharge: number,
  packing: boolean, unpacking: boolean, stairs: number,
) {
  const [hoursLo, hoursHi] = BEDROOM_HOURS[Math.min(br, 5)] ?? [6, 10];
  const laborLow  = Math.max(minCharge, hoursLo * rate);
  const laborHigh = Math.max(minCharge, hoursHi * rate);
  const fuelLow   = Math.round(laborLow  * 0.10);
  const fuelHigh  = Math.round(laborHigh * 0.10);
  const stairsCost = stairs * 75;
  const brData = BEDROOM_DATA.find(b => b.bedrooms === br) ?? BEDROOM_DATA[2];
  const cuft = brData.avgCuft;
  const lbs  = cuft * CUFT_TO_LBS;
  const packLow    = packing    ? Math.round(lbs * 0.15) : 0;
  const packHigh   = packing    ? Math.round(lbs * 0.21) : 0;
  const unpackLow  = unpacking  ? Math.round(lbs * 0.15) : 0;
  const unpackHigh = unpacking  ? Math.round(lbs * 0.21) : 0;
  const totalLow  = laborLow  + fuelLow  + stairsCost + packLow  + unpackLow;
  const totalHigh = laborHigh + fuelHigh + stairsCost + packHigh + unpackHigh;
  return {
    hoursLo, hoursHi, laborLow, laborHigh, fuelLow, fuelHigh,
    stairsCost, packLow, packHigh, unpackLow, unpackHigh,
    totalLow, totalHigh,
    cuft, totalCuft: cuft, noMax: false as const,
    moveLow: laborLow, moveHigh: laborHigh,
    hasTravelFee: true, travelLow: fuelLow, travelHigh: fuelHigh,
    packCost: packLow, unpackCost: unpackLow,
  };
}

// Cu-ft engine — long distance
// Formula: cuft × rate + 15% fuel + stairs + packing ($0.15–$0.21/lb)
function calcLongDist(
  totalCuft: number,
  band: typeof LONG_DIST_BANDS[0],
  packing: boolean, unpacking: boolean, stairs: number,
) {
  const lbs  = totalCuft * CUFT_TO_LBS;
  const moveLow  = Math.round(totalCuft * band.rateLo);
  const moveHigh = Math.round(totalCuft * band.rateHi);
  const fuelLow  = Math.round(moveLow  * 0.15);
  const fuelHigh = Math.round(moveHigh * 0.15);
  const stairsCost = stairs * 75;
  const packLow    = packing   ? Math.round(lbs * 0.15) : 0;
  const packHigh   = packing   ? Math.round(lbs * 0.21) : 0;
  const unpackLow  = unpacking ? Math.round(lbs * 0.15) : 0;
  const unpackHigh = unpacking ? Math.round(lbs * 0.21) : 0;
  const totalLow  = moveLow  + fuelLow  + stairsCost + packLow  + unpackLow;
  const totalHigh = moveHigh + fuelHigh + stairsCost + packHigh + unpackHigh;
  return {
    totalCuft, moveLow, moveHigh, fuelLow, fuelHigh,
    stairsCost, packLow, packHigh, unpackLow, unpackHigh,
    totalLow, totalHigh,
    noMax: band.noMax,
    packCost: packLow, unpackCost: unpackLow,
  };
}

type AccessType = "none" | "stairs" | "elevator" | "long_carry";

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Mode = "select" | "quick" | "detailed";

const contactSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Phone required"),
  moveDate: z.string().min(1, "Date required"),
  moveFromZip: z.string().min(5, "Zip required"),
  moveToZip: z.string().min(5, "Zip required"),
});

// ─── SHARED SUBCOMPONENTS ─────────────────────────────────────────────────────
function HourlyPriceSummary({ calc, crewOption }: {
  calc: ReturnType<typeof calcHourly>;
  crewOption: typeof CREW_OPTIONS[0];
}) {
  const rateLabel = `$${crewOption.rate}/hr`;
  return (
    <div className="space-y-3">
      <div className="bg-primary text-primary-foreground rounded-xl p-6">
        <p className="text-xs text-primary-foreground/60 uppercase tracking-widest mb-1">Live Estimate</p>
        <div className="text-4xl font-serif font-bold">
          ${calc.totalLow.toLocaleString()} – ${calc.totalHigh.toLocaleString()}
        </div>
        <p className="text-primary-foreground/60 text-xs mt-1">{crewOption.label} · {calc.hoursLo}–{calc.hoursHi} hrs estimated</p>
        <div className="mt-4 space-y-2 text-sm border-t border-primary-foreground/20 pt-3">
          <div className="flex justify-between text-primary-foreground/80">
            <span>Labor ({calc.hoursLo}–{calc.hoursHi} hrs)</span>
            <span>${calc.laborLow.toLocaleString()} – ${calc.laborHigh.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-primary-foreground/50 text-xs">
            <span>{crewOption.label}</span>
            <span>{rateLabel} · min ${crewOption.minCharge}</span>
          </div>
          <div className="flex justify-between text-yellow-300 text-xs">
            <span>Fuel Surcharge (10%)</span>
            <span>+${calc.fuelLow.toLocaleString()} – +${calc.fuelHigh.toLocaleString()}</span>
          </div>
          {calc.stairsCost > 0 && (
            <div className="flex justify-between text-yellow-300 text-xs">
              <span>Stairs / Long Carry</span>
              <span>+${calc.stairsCost.toLocaleString()}</span>
            </div>
          )}
          {calc.packLow > 0 && (
            <div className="flex justify-between text-secondary text-xs">
              <span>Full Packing</span>
              <span>+${calc.packLow.toLocaleString()} – +${calc.packHigh.toLocaleString()}</span>
            </div>
          )}
          {calc.unpackLow > 0 && (
            <div className="flex justify-between text-secondary text-xs">
              <span>Unpacking</span>
              <span>+${calc.unpackLow.toLocaleString()} – +${calc.unpackHigh.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 leading-relaxed">
        <span className="font-semibold">🏭 Warehouse-to-warehouse billing:</span> Time starts when our crew departs the warehouse and ends when they return. All hours include drive time to and from your location.
      </div>
    </div>
  );
}

function LongDistSummary({ calc, band, compact = false }: {
  calc: ReturnType<typeof calcLongDist>;
  band: typeof LONG_DIST_BANDS[0];
  compact?: boolean;
}) {
  return (
    <div className={`bg-primary text-primary-foreground rounded-xl ${compact ? "p-4" : "p-6"}`}>
      {!compact && <p className="text-xs text-primary-foreground/60 uppercase tracking-widest mb-3">Live Estimate</p>}
      <div className={`font-serif font-bold text-primary-foreground ${compact ? "text-2xl" : "text-4xl"}`}>
        {calc.noMax
          ? `$${calc.totalLow.toLocaleString()}+`
          : `$${calc.totalLow.toLocaleString()} – $${calc.totalHigh.toLocaleString()}`}
      </div>
      <p className="text-primary-foreground/60 text-xs mt-1">{Math.round(calc.totalCuft).toLocaleString()} cu ft · {band.label}</p>
      {!compact && (
        <div className="mt-4 space-y-2 text-sm border-t border-primary-foreground/20 pt-3">
          <div className="flex justify-between text-primary-foreground/80">
            <span>Freight ({Math.round(calc.totalCuft)} cu ft)</span>
            <span>{calc.noMax ? `$${calc.moveLow.toLocaleString()}+` : `$${calc.moveLow.toLocaleString()} – $${calc.moveHigh.toLocaleString()}`}</span>
          </div>
          <div className="flex justify-between text-primary-foreground/50 text-xs">
            <span>Rate</span>
            <span>${band.rateLo.toFixed(2)}–${band.rateHi.toFixed(2)}/cu ft</span>
          </div>
          <div className="flex justify-between text-yellow-300 text-xs">
            <span>Fuel Surcharge (15%)</span>
            <span>+${calc.fuelLow.toLocaleString()} – +${calc.fuelHigh.toLocaleString()}</span>
          </div>
          {calc.stairsCost > 0 && (
            <div className="flex justify-between text-yellow-300 text-xs">
              <span>Stairs / Long Carry</span>
              <span>+${calc.stairsCost.toLocaleString()}</span>
            </div>
          )}
          {calc.packLow > 0 && (
            <div className="flex justify-between text-secondary text-xs">
              <span>Packing</span>
              <span>+${calc.packLow.toLocaleString()} – +${calc.packHigh.toLocaleString()}</span>
            </div>
          )}
          {calc.unpackLow > 0 && (
            <div className="flex justify-between text-secondary text-xs">
              <span>Unpacking</span>
              <span>+${calc.unpackLow.toLocaleString()} – +${calc.unpackHigh.toLocaleString()}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AccessCard({ accessType, setAccessType, accessQty, setAccessQty, elevatorDedicated, setElevatorDedicated, compact = false }: {
  accessType: AccessType;
  setAccessType: (t: AccessType) => void;
  accessQty: number;
  setAccessQty: (n: number) => void;
  elevatorDedicated: boolean;
  setElevatorDedicated: (v: boolean) => void;
  compact?: boolean;
}) {
  const elevatorCost = accessType === "elevator" && !elevatorDedicated ? 75 : 0;
  const cost = accessType === "none" ? 0 : accessType === "elevator" ? elevatorCost : accessQty * 75;
  const TYPES: { id: AccessType; label: string; icon: string }[] = [
    { id: "stairs",     label: "Stairs",     icon: "🪜" },
    { id: "elevator",   label: "Elevator",   icon: "🛗" },
    { id: "long_carry", label: "Long Carry", icon: "📦" },
  ];
  const p = compact ? "p-4" : "p-5";
  return (
    <div className={`${p} rounded-xl border-2 border-border`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className={compact ? "font-medium" : "font-semibold"}>Stairs / Elevator / Long Carry</div>
          <div className="text-xs text-muted-foreground">Select what applies at either location</div>
        </div>
        {cost > 0 && <span className="text-sm font-bold text-primary">+${cost.toLocaleString()}</span>}
      </div>
      {/* Type selector */}
      <div className="flex gap-2 mb-3">
        {TYPES.map(t => (
          <button key={t.id} type="button"
            onClick={() => setAccessType(accessType === t.id ? "none" : t.id)}
            className={`flex-1 py-2 px-1 rounded-lg border-2 text-xs font-medium transition-all text-center ${accessType === t.id ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40 text-muted-foreground"}`}>
            <div className="text-base">{t.icon}</div>
            <div className="mt-0.5">{t.label}</div>
          </button>
        ))}
      </div>
      {/* Stairs dropdown */}
      {accessType === "stairs" && (
        <select value={accessQty} onChange={e => setAccessQty(Number(e.target.value))}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary">
          <option value={1}>1 flight (+$75)</option>
          <option value={2}>2 flights (+$150)</option>
          <option value={3}>3 flights (+$225)</option>
          <option value={4}>4 flights (+$300)</option>
          <option value={5}>5+ flights (+$375)</option>
        </select>
      )}
      {/* Long Carry dropdown — $75 per 75 ft */}
      {accessType === "long_carry" && (
        <select value={accessQty} onChange={e => setAccessQty(Number(e.target.value))}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary">
          <option value={1}>≤ 75 ft (+$75)</option>
          <option value={2}>≤ 150 ft (+$150)</option>
          <option value={3}>≤ 225 ft (+$225)</option>
          <option value={4}>≤ 300 ft (+$300)</option>
          <option value={5}>≤ 375 ft (+$375)</option>
        </select>
      )}
      {/* Elevator — dedicated toggle */}
      {accessType === "elevator" && (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Is the elevator dedicated for your move?</div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setElevatorDedicated(true)}
              className={`flex-1 py-1.5 rounded-lg border-2 text-xs font-medium transition-all ${elevatorDedicated ? "border-green-500 bg-green-50 text-green-700" : "border-border text-muted-foreground hover:border-primary/40"}`}>
              ✓ Yes — dedicated
            </button>
            <button type="button" onClick={() => setElevatorDedicated(false)}
              className={`flex-1 py-1.5 rounded-lg border-2 text-xs font-medium transition-all ${!elevatorDedicated ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
              Shared / Not reserved (+$75)
            </button>
          </div>
          {elevatorDedicated && (
            <div className="text-xs text-muted-foreground bg-secondary/30 rounded-lg px-3 py-2">
              🛗 No extra charge — dedicated elevator noted for the crew.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ItemCard({ name, emoji, cubicFeet, qty, onChange }: {
  name: string; emoji: string; cubicFeet: number; qty: number; onChange: (n: number) => void;
}) {
  return (
    <div className={`relative flex flex-col items-center p-3 rounded-xl border-2 transition-all cursor-pointer
      ${qty > 0 ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/40 bg-background"}`}>
      <div className="text-3xl mb-1">{emoji}</div>
      <p className="text-xs font-medium text-center leading-tight mb-1">{name}</p>
      <span className="text-[10px] text-muted-foreground mb-2">{cubicFeet} cu ft each</span>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onChange(qty - 1)}
          className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-sm font-bold hover:bg-muted transition-colors disabled:opacity-30"
          disabled={qty === 0}>−</button>
        <span className={`w-6 text-center text-sm font-bold ${qty > 0 ? "text-primary" : "text-muted-foreground"}`}>{qty}</span>
        <button type="button" onClick={() => onChange(qty + 1)}
          className="w-7 h-7 rounded-full border border-primary bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold hover:bg-primary/90 transition-colors">+</button>
      </div>
      {qty > 0 && (
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[10px] font-bold">{qty}</div>
      )}
    </div>
  );
}

function DistanceSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const opts = [
    { id: "local", label: "Local", sub: "Under 50 miles", emoji: "📍" },
    { id: "mid_range", label: "Mid-Range", sub: "50 – 300 miles", emoji: "🗺️" },
    { id: "long_distance", label: "Long Distance", sub: "300+ miles", emoji: "🚛" },
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
      {opts.map(o => (
        <button key={o.id} type="button" onClick={() => onChange(o.id)}
          className={`p-3 rounded-xl border-2 text-center transition-all ${value === o.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
          <div className="text-xl mb-1">{o.emoji}</div>
          <div className="text-xs font-bold">{o.label}</div>
          <div className="text-[10px] text-muted-foreground">{o.sub}</div>
        </button>
      ))}
    </div>
  );
}

// ─── RESULT VIEW ──────────────────────────────────────────────────────────────
function ResultView({ calc, name, mode, onReset }: {
  calc: any;
  name: string; mode: string; onReset: () => void;
}) {
  const distLabel = { local: "Local (<50 mi)", mid_range: "Mid-Range (50–300 mi)", long_distance: "Long Distance (300+ mi)" }[calc.distance as string] ?? calc.distance;
  const isHourly = !calc.isLongDist;
  const rateRange = isHourly && calc.crewRateLo
    ? (calc.crewRateLo === calc.crewRateHi ? `$${calc.crewRateLo}/hr` : `$${calc.crewRateLo}–$${calc.crewRateHi}/hr`)
    : null;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-serif font-bold mb-2">Your Estimate, {name.split(" ")[0]}!</h2>
        <p className="text-muted-foreground">A relocation coordinator will contact you within 1 hour to confirm details.</p>
      </div>

      <Card className="border-2 border-primary overflow-hidden mb-6">
        <div className="bg-primary text-primary-foreground p-8">
          <p className="text-xs uppercase tracking-widest text-primary-foreground/60 mb-2">
            {mode === "detailed" ? "Detailed Inventory Estimate" : "Quick Estimate"}
          </p>
          <div className="text-6xl font-serif font-bold mb-2">
            {calc.noMax
              ? `$${calc.totalLow.toLocaleString()}+`
              : `$${calc.totalLow.toLocaleString()} – $${calc.totalHigh.toLocaleString()}`}
          </div>
          <p className="text-primary-foreground/70 text-sm">
            {mode === "quick" && calc.crewLabel && isHourly
              ? `${calc.hoursLo}–${calc.hoursHi} hrs · ${calc.crewLabel} · ${rateRange}`
              : calc.bandLabel
                ? `${Math.round(calc.totalCuft).toLocaleString()} cu ft · ${calc.bandLabel}`
                : `${Math.round(calc.totalCuft).toLocaleString()} est. cu ft · ${distLabel}`}
          </p>
        </div>
        <CardContent className="p-6 space-y-3">
          <div className="flex justify-between text-sm py-2 border-b border-border">
            <span className="text-muted-foreground">
              {mode === "quick" && calc.crewLabel && isHourly
                ? `Labor (${calc.hoursLo}–${calc.hoursHi} hrs)`
                : "Moving Service"}
            </span>
            <span className="font-medium">{calc.noMax ? `$${calc.moveLow.toLocaleString()}+` : `$${calc.moveLow.toLocaleString()} – $${calc.moveHigh.toLocaleString()}`}</span>
          </div>
          {mode === "quick" && calc.crewLabel && isHourly && (
            <div className="flex justify-between text-xs text-muted-foreground pb-1 border-b border-border">
              <span>{calc.crewLabel}</span>
              <span>{rateRange}</span>
            </div>
          )}
          {calc.fuelLow > 0 && (
            <div className="flex justify-between text-sm py-2 border-b border-border">
              <span className="text-muted-foreground">
                {calc.isLongDist ? "Fuel Surcharge (15%)" : "Fuel Surcharge (10%)"}
              </span>
              <span className="font-medium text-amber-600">+${calc.fuelLow?.toLocaleString()} – +${calc.fuelHigh?.toLocaleString()}</span>
            </div>
          )}
          {calc.stairsCost > 0 && (
            <div className="flex justify-between text-sm py-2 border-b border-border">
              <span className="text-muted-foreground">Stairs/Long Carry</span>
              <span className="font-medium text-primary">+${calc.stairsCost.toLocaleString()}</span>
            </div>
          )}
          {calc.hasPacking && calc.packLow > 0 && (
            <div className="flex justify-between text-sm py-2 border-b border-border">
              <span className="text-muted-foreground">Full Packing Service ($0.15–$0.21/lb)</span>
              <span className="font-medium text-primary">+${calc.packLow.toLocaleString()} – +${calc.packHigh.toLocaleString()}</span>
            </div>
          )}
          {calc.hasUnpacking && calc.unpackLow > 0 && (
            <div className="flex justify-between text-sm py-2 border-b border-border">
              <span className="text-muted-foreground">Unpacking Service ($0.15–$0.21/lb)</span>
              <span className="font-medium text-primary">+${calc.unpackLow.toLocaleString()} – +${calc.unpackHigh.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between py-2">
            <span className="font-bold">Total Estimate</span>
            <span className="font-bold text-primary text-lg">{calc.noMax ? `$${calc.totalLow.toLocaleString()}+` : `$${calc.totalLow.toLocaleString()} – $${calc.totalHigh.toLocaleString()}`}</span>
          </div>
          {!calc.isLongDist && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
              <strong>🏭 Warehouse-to-warehouse billing:</strong> Time starts when our crew leaves our warehouse and ends when they return. All hours shown include drive time to and from your location.
            </div>
          )}
          <div className="bg-secondary/40 rounded-lg p-4 text-sm text-muted-foreground">
            <strong>Why a range?</strong> Final price depends on access conditions, actual truck fill, and labor time. Our range ensures no surprises on move day.
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <a href="tel:6606677770" className="flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors">
          <motion.span
            animate={{ rotate: [0, -15, 15, -15, 15, -8, 8, 0] }}
            transition={{ duration: 0.65, repeat: Infinity, repeatDelay: 2.8, ease: "easeInOut" }}
            className="inline-flex"
          >
            <Phone className="w-5 h-5" />
          </motion.span>
          Call to Customize
        </a>
        <a href="https://wa.me/16606677770" className="flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#20bd5a] transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          WhatsApp Us
        </a>
      </div>
      <button onClick={onReset} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-border text-sm font-semibold text-foreground bg-background hover:bg-muted transition-colors">
        <RotateCcw className="w-4 h-4" /> New Estimate
      </button>
    </motion.div>
  );
}

// ─── CONTACT FORM STEP ────────────────────────────────────────────────────────
function ContactStep({ onSubmit, isPending, defaults }: { onSubmit: (v: z.infer<typeof contactSchema>) => void; isPending: boolean; defaults?: { phone?: string; moveFromZip?: string; moveToZip?: string } }) {
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: defaults?.phone ?? "", moveDate: "", moveFromZip: defaults?.moveFromZip ?? "", moveToZip: defaults?.moveToZip ?? "" },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Row 1: Full Name | Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Full Name</FormLabel>
              <FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem><FormLabel className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone</FormLabel>
              <FormControl><Input placeholder="(214) 555-0100" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        {/* Row 2: Moving From | Moving To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="moveFromZip" render={({ field }) => (
            <FormItem><FormLabel>Moving From (Zip)</FormLabel><FormControl><Input placeholder="75006" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="moveToZip" render={({ field }) => (
            <FormItem><FormLabel>Moving To (Zip)</FormLabel><FormControl><Input placeholder="78701" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        {/* Row 3: Email | Moving Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem><FormLabel className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</FormLabel>
              <FormControl><Input type="email" placeholder="john@example.com" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="moveDate" render={({ field }) => (
            <FormItem>
              <FormControl>
                <MoveDatePicker
                  value={field.value}
                  onChange={field.onChange}
                  error={form.formState.errors.moveDate?.message}
                />
              </FormControl>
            </FormItem>
          )} />
        </div>
        <Button type="submit" size="lg" className="w-full text-base py-6 font-semibold" disabled={isPending}>
          {isPending ? "Sending..." : "Get My Full Estimate"} <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
        <p className="text-xs text-center text-muted-foreground">No obligation · Secure & confidential · We respond within 1 hour</p>
      </form>
    </Form>
  );
}

// ─── MAIN CALCULATOR ──────────────────────────────────────────────────────────
export default function Calculator() {
  const { toast } = useToast();
  const rawSearch = useSearch();
  const params = useMemo(() => new URLSearchParams(rawSearch), [rawSearch]);
  const prefillFrom = params.get("from") ?? "";
  const prefillTo = params.get("to") ?? "";
  const prefillPhone = params.get("phone") ?? "";

  const [mode, setMode] = useState<Mode>(() => (prefillFrom || prefillPhone) ? "quick" : "select");
  const [detailStep, setDetailStep] = useState(0);

  // Quick mode state
  const [quickBR, setQuickBR] = useState(2);
  const [quickBoxes, setQuickBoxes] = useState(30);
  const [quickDist, setQuickDist] = useState("local");
  const [quickCrew, setQuickCrew] = useState(2);
  const [quickLdBand, setQuickLdBand] = useState(LONG_DIST_BANDS[0].id);
  const [quickAccessType, setQuickAccessType] = useState<AccessType>("none");
  const [quickAccessQty, setQuickAccessQty] = useState(1);
  const [quickElevatorDedicated, setQuickElevatorDedicated] = useState(true);

  // Detailed mode state
  const [detailBR, setDetailBR] = useState(2);
  const [detailBoxes, setDetailBoxes] = useState(30);
  const [detailDist, setDetailDist] = useState("local");
  const [detailLdBand, setDetailLdBand] = useState(LONG_DIST_BANDS[0].id);
  const [detailAccessType, setDetailAccessType] = useState<AccessType>("none");
  const [detailAccessQty, setDetailAccessQty] = useState(1);
  const [detailElevatorDedicated, setDetailElevatorDedicated] = useState(true);
  const [inventory, setInventory] = useState<Record<string, number>>({});

  // Shared
  const [hasPacking, setHasPacking] = useState(false);
  const [hasUnpacking, setHasUnpacking] = useState(false);
  const [result, setResult] = useState<any>(null);

  const createEstimate = useCreateEstimate();
  const createLead = useCreateLead();

  // Auto-update boxes when bedrooms change
  useEffect(() => {
    const d = BEDROOM_DATA.find(b => b.bedrooms === quickBR);
    if (d) setQuickBoxes(d.avgBoxes);
  }, [quickBR]);

  useEffect(() => {
    const d = BEDROOM_DATA.find(b => b.bedrooms === detailBR);
    if (d) setDetailBoxes(d.avgBoxes);
  }, [detailBR]);

  const quickStairs = quickAccessType === "none" ? 0
    : quickAccessType === "elevator" ? (quickElevatorDedicated ? 0 : 1)
    : quickAccessQty;
  const detailStairs = detailAccessType === "none" ? 0
    : detailAccessType === "elevator" ? (detailElevatorDedicated ? 0 : 1)
    : detailAccessQty;

  const quickBRData = BEDROOM_DATA.find(b => b.bedrooms === quickBR) ?? BEDROOM_DATA[2];
  const quickCrewOption = CREW_OPTIONS.find(c => c.men === quickCrew) ?? CREW_OPTIONS[0];
  const quickHourlyCalc = calcHourly(
    quickBR,
    quickCrewOption.rate, quickCrewOption.minCharge,
    hasPacking, hasUnpacking, quickStairs,
  );
  const quickLdBandObj = LONG_DIST_BANDS.find(b => b.id === quickLdBand) ?? LONG_DIST_BANDS[0];
  const quickLdCalc = calcLongDist(
    quickBRData.avgCuft + quickBoxes * BOX_CUFT,
    quickLdBandObj, hasPacking, hasUnpacking, quickStairs,
  );

  const inventoryCuft = Object.entries(inventory).reduce((sum, [name, qty]) => {
    for (const room of ROOMS) {
      const item = room.items.find(i => i.name === name);
      if (item) return sum + item.cubicFeet * qty;
    }
    return sum;
  }, 0);
  const detailBRData = BEDROOM_DATA.find(b => b.bedrooms === detailBR) ?? BEDROOM_DATA[2];
  const baseForDetail = inventoryCuft > 0 ? inventoryCuft : detailBRData.avgCuft;
  const detailTotalCuft = baseForDetail + detailBoxes * BOX_CUFT;
  const detailLdBandObj = LONG_DIST_BANDS.find(b => b.id === detailLdBand) ?? LONG_DIST_BANDS[0];
  const detailHourlyCalc = calcHourly(
    detailBR,
    CREW_OPTIONS[0].rate, CREW_OPTIONS[0].minCharge,
    hasPacking, hasUnpacking, detailStairs,
  );
  const detailLdCalc = calcLongDist(
    detailTotalCuft, detailLdBandObj, hasPacking, hasUnpacking, detailStairs,
  );
  const detailCalc = detailDist === "long_distance" ? detailLdCalc : detailHourlyCalc;

  const totalDetailSteps = ROOMS.length + 3; // 0=basic, 1..6=rooms, 7=addons, 8=contact

  const handleSubmit = (values: z.infer<typeof contactSchema>, isQuick: boolean) => {
    const inventoryList = isQuick ? [] : Object.entries(inventory)
      .filter(([, qty]) => qty > 0)
      .flatMap(([name, qty]) => {
        for (const room of ROOMS) {
          const item = room.items.find(i => i.name === name);
          if (item) return [{ name: item.name, category: room.name, cubicFeet: item.cubicFeet, quantity: qty }];
        }
        return [];
      });

    const br = isQuick ? quickBR : detailBR;
    const boxes = isQuick ? quickBoxes : detailBoxes;
    const dist = isQuick ? quickDist : detailDist;
    const stairs = isQuick ? quickStairs : detailStairs;
    const isLongDist = dist === "long_distance";
    const displayCalc = isQuick
      ? (isLongDist ? quickLdCalc : quickHourlyCalc)
      : detailCalc;
    const brLabel = isQuick ? quickBRData.label : detailBRData.label;

    createEstimate.mutate({
      data: {
        bedroomCount: br,
        boxCount: boxes,
        hasPackingService: hasPacking,
        hasStairs: stairs > 0,
        distanceZone: dist as "local" | "mid_range" | "long_distance",
        isFlexibleDates: false,
        inventoryItems: inventoryList,
        specialItems: [],
        customerName: values.name,
        customerEmail: values.email,
        customerPhone: values.phone,
      }
    }, {
      onSuccess: () => {
        createLead.mutate({
          data: {
            fullName: values.name,
            phone: values.phone,
            email: values.email,
            moveFromZip: values.moveFromZip,
            moveToZip: values.moveToZip,
            moveDate: values.moveDate,
            bedroomCount: br,
            moveType: "residential",
            source: "calculator",
            estimatedCubicFeet: displayCalc.totalCuft,
            priceLow: displayCalc.totalLow,
            priceHigh: displayCalc.totalHigh,
          }
        }, { onSuccess: () => { }, onError: () => { } });

        setResult({
          ...displayCalc,
          hasPacking, hasUnpacking,
          bedroomLabel: brLabel,
          distance: dist,
          mode: isQuick ? "quick" : "detailed",
          itemCount: Object.values(inventory).filter(q => q > 0).length,
          name: values.name,
          isLongDist,
          bandLabel: isLongDist ? (isQuick ? quickLdBandObj.label : detailLdBandObj.label) : null,
          ...(isQuick && !isLongDist ? {
            hoursLo: quickHourlyCalc.hoursLo,
            hoursHi: quickHourlyCalc.hoursHi,
            crewLabel: quickCrewOption.label,
            crewRate: quickCrewOption.rate,
            fuelLow: quickHourlyCalc.fuelLow,
            fuelHigh: quickHourlyCalc.fuelHigh,
          } : {}),
        });
        toast({ title: "Estimate ready!", description: "A coordinator will contact you within 1 hour." });
      },
      onError: () => toast({ title: "Error", description: "Please try again or call (660) 667-7770.", variant: "destructive" }),
    });
  };

  const updateInventory = (name: string, qty: number) =>
    setInventory(prev => ({ ...prev, [name]: Math.max(0, qty) }));

  const resetAll = () => {
    setMode("select"); setDetailStep(0); setResult(null); setInventory({});
    setHasPacking(false); setHasUnpacking(false);
    setQuickBR(2); setQuickBoxes(30); setQuickDist("local"); setQuickCrew(2);
    setQuickLdBand(LONG_DIST_BANDS[0].id); setQuickAccessType("none"); setQuickAccessQty(1); setQuickElevatorDedicated(true);
    setDetailBR(2); setDetailBoxes(30); setDetailDist("local");
    setDetailLdBand(LONG_DIST_BANDS[0].id); setDetailAccessType("none"); setDetailAccessQty(1); setDetailElevatorDedicated(true);
  };

  const addonsStep = ROOMS.length + 1;
  const contactStep = ROOMS.length + 2;

  return (
    <PublicLayout>
      {/* Page Header */}
      <div className="bg-primary text-primary-foreground py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Truck className="w-4 h-4" /> Free Moving Cost Calculator
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Get Your Moving Estimate
          </h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            Quick hourly estimate or room-by-room accuracy — choose your path. Clear crew-based pricing, no hidden fees.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {/* ── RESULT ── */}
          {result ? (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ResultView calc={result} name={result.name ?? "there"} mode={result.mode} onReset={resetAll} />
            </motion.div>
          ) : mode === "select" ? (
            /* ── MODE SELECTOR ── */
            <motion.div key="select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {/* Quick Estimate Card */}
                <Card className="border-2 border-primary hover:shadow-xl transition-all cursor-pointer group"
                  onClick={() => setMode("quick")}>
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mx-auto mb-5">
                      <Zap className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold mb-2">Quick Estimate</h2>
                    <p className="text-muted-foreground text-sm mb-6">
                      Just tell us your home size and distance. We show the average cubic footage for your home type and give you an instant price range in under 60 seconds.
                    </p>
                    <div className="space-y-2 text-sm text-left mb-6">
                      {["Based on your number of bedrooms", "National average cubic footage by home type", "Instant price range, no signup needed"].map(t => (
                        <div key={t} className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> {t}
                        </div>
                      ))}
                    </div>
                    <Button className="w-full group-hover:bg-primary/90" size="lg">
                      Get Quick Estimate <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Detailed Estimate Card */}
                <Card className="border-2 border-secondary hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
                  onClick={() => { setMode("detailed"); setDetailStep(0); }}>
                  <div className="absolute top-3 right-3 bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">Most Accurate</div>
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-secondary text-secondary-foreground rounded-2xl flex items-center justify-center mx-auto mb-5">
                      <ClipboardList className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold mb-2">Detailed Estimate</h2>
                    <p className="text-muted-foreground text-sm mb-6">
                      Go room-by-room and select your actual furniture and appliances. Our calculator adds up the exact cubic footage for a highly accurate price range.
                    </p>
                    <div className="space-y-2 text-sm text-left mb-6">
                      {["Room-by-room item selection", "Icon-based visual inventory with cubic feet shown", "Accurate estimate based on your actual items"].map(t => (
                        <div key={t} className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" /> {t}
                        </div>
                      ))}
                    </div>
                    {/* Blue bill-shaped button as requested */}
                    <button className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold text-base hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md">
                      <ClipboardList className="w-5 h-5" />
                      Build Accurate Estimate
                    </button>
                  </CardContent>
                </Card>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-8">
                Not sure? <a href="tel:6606677770" className="text-primary font-medium hover:underline">(660) 667-7770</a> — we'll help you pick the right option.
              </p>
            </motion.div>
          ) : mode === "quick" ? (
            /* ── QUICK ESTIMATE ── */
            <motion.div key="quick" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <button onClick={resetAll} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <div className="w-2 h-2 bg-muted rounded-full" />
                <span className="text-sm font-medium text-primary">Quick Estimate</span>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* Bedroom selector */}
                  <div>
                    <h3 className="text-lg font-serif font-bold mb-1">How big is your home?</h3>
                    <p className="text-sm text-muted-foreground mb-4">We'll show the average cubic footage for your home type.</p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {BEDROOM_DATA.map(d => (
                        <button key={d.bedrooms} type="button" onClick={() => setQuickBR(d.bedrooms)}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${quickBR === d.bedrooms ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/30"}`}>
                          <div className="text-xl mb-1">{d.emoji}</div>
                          <div className="text-xs font-bold leading-tight">{d.label}</div>
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 p-3 bg-secondary/30 rounded-lg text-sm text-center text-muted-foreground">
                      {quickBRData.desc}
                    </div>
                  </div>

                  {/* Distance */}
                  <div>
                    <h3 className="text-lg font-serif font-bold mb-4">How far are you moving?</h3>
                    <DistanceSelector value={quickDist} onChange={setQuickDist} />
                  </div>

                  {/* Crew Selector — local/mid-range only */}
                  {quickDist !== "long_distance" && (
                  <div>
                    <h3 className="text-lg font-serif font-bold mb-1">Choose your crew size</h3>
                    <p className="text-sm text-muted-foreground mb-4">All crew sizes work the same estimated hours — more crew means more hands on the job. Choose based on your budget.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {CREW_OPTIONS.map(crew => {
                        const crewCalc = calcHourly(quickBR, crew.rate, crew.minCharge, hasPacking, hasUnpacking, quickStairs);
                        const isSelected = quickCrew === crew.men;
                        const rateLabel = `$${crew.rate}/hr`;
                        return (
                          <button key={crew.men} type="button" onClick={() => setQuickCrew(crew.men)}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${isSelected ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/40"}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                                {crew.men}
                              </div>
                              <span className="font-bold text-sm leading-tight">{crew.label}</span>
                            </div>
                            <div className="text-xl font-serif font-bold text-primary">{rateLabel}</div>
                            <div className="text-[11px] text-muted-foreground">min ${crew.minCharge.toLocaleString()}</div>
                            <div className="mt-2 space-y-0.5">
                              <div className="text-xs text-muted-foreground">⏱ ~{crewCalc.hoursLo}–{crewCalc.hoursHi} hrs for this move</div>
                              <div className="text-xs font-semibold text-primary">≈ ${crewCalc.totalLow.toLocaleString()}–${crewCalc.totalHigh.toLocaleString()}</div>
                              <div className="text-[10px] text-muted-foreground">Incl. 10% fuel surcharge</div>
                            </div>
                            {isSelected && <div className="mt-2 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block">Selected</div>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  )}

                  {/* Long Distance Band Selector */}
                  {quickDist === "long_distance" && (
                  <div>
                    <h3 className="text-lg font-serif font-bold mb-1">How far are you moving?</h3>
                    <p className="text-sm text-muted-foreground mb-4">Select your distance range for accurate per-cubic-foot pricing.</p>
                    <div className="grid grid-cols-2 gap-3">
                      {LONG_DIST_BANDS.map(band => {
                        const bandCalc = calcLongDist(quickBRData.avgCuft + quickBoxes * BOX_CUFT, band, hasPacking, hasUnpacking, quickStairs);
                        const isSelected = quickLdBand === band.id;
                        return (
                          <button key={band.id} type="button" onClick={() => setQuickLdBand(band.id)}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${isSelected ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/40"}`}>
                            <div className="font-bold text-sm">{band.label}</div>
                            <div className="text-primary font-serif text-lg font-bold mt-1">${band.rateLo.toFixed(2)}–${band.rateHi.toFixed(2)}<span className="text-xs font-normal text-muted-foreground">/cu ft</span></div>
                            <div className="text-xs text-muted-foreground mt-1">≈ ${bandCalc.totalLow.toLocaleString()}–${band.noMax ? `${bandCalc.totalHigh.toLocaleString()}+` : bandCalc.totalHigh.toLocaleString()}</div>
                            {isSelected && <div className="mt-2 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block">Selected</div>}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">+15% fuel surcharge included in estimate above</p>
                  </div>
                  )}

                  {/* Box count */}
                  <div>
                    <h3 className="text-lg font-serif font-bold mb-1">Estimated number of boxes</h3>
                    <p className="text-sm text-muted-foreground mb-3">Auto-calculated from your bedroom count. Adjust if you know more or less.</p>
                    <div className="flex items-center gap-4">
                      <button type="button" onClick={() => setQuickBoxes(q => Math.max(0, q - 5))}
                        className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center font-bold text-lg hover:bg-muted transition-colors">−</button>
                      <div className="flex-1 text-center">
                        <input type="number" min="0" max="500" value={quickBoxes}
                          onChange={e => setQuickBoxes(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-24 text-center text-3xl font-serif font-bold border-0 border-b-2 border-primary focus:outline-none bg-transparent" />
                        <div className="text-xs text-muted-foreground mt-1">boxes (≈ {(quickBoxes * 1.5).toFixed(0)} cu ft)</div>
                      </div>
                      <button type="button" onClick={() => setQuickBoxes(q => q + 5)}
                        className="w-10 h-10 rounded-full border-2 border-primary bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg hover:bg-primary/90 transition-colors">+</button>
                    </div>
                  </div>

                  {/* Add-ons */}
                  <div>
                    <h3 className="text-lg font-serif font-bold mb-4">Add-on Services</h3>
                    <div className="space-y-3">
                      {/* Packing */}
                      {[
                        { id: "pack",   label: "Full Packing Service", sub: "We pack everything — $0.15–$0.21/lb (≈ $1.05–$1.47/cu ft)", value: hasPacking,   set: setHasPacking,
                          costLo: quickDist === "long_distance" ? quickLdCalc.packLow   : quickHourlyCalc.packLow,
                          costHi: quickDist === "long_distance" ? quickLdCalc.packHigh  : quickHourlyCalc.packHigh },
                        { id: "unpack", label: "Unpacking Service",    sub: "We unpack & place items at your new home — $0.15–$0.21/lb (≈ $1.05–$1.47/cu ft)",  value: hasUnpacking, set: setHasUnpacking,
                          costLo: quickDist === "long_distance" ? quickLdCalc.unpackLow  : quickHourlyCalc.unpackLow,
                          costHi: quickDist === "long_distance" ? quickLdCalc.unpackHigh : quickHourlyCalc.unpackHigh },
                      ].map(item => (
                        <button key={item.id} type="button" onClick={() => item.set(v => !v)}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${item.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${item.value ? "bg-primary border-primary" : "border-muted-foreground"}`}>
                            {item.value && <CheckCircle className="w-4 h-4 text-primary-foreground" />}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs text-muted-foreground">{item.sub}</div>
                          </div>
                          {item.value && (
                            <span className="text-sm font-bold text-primary text-right leading-tight">
                              +${item.costLo.toLocaleString()}–${item.costHi.toLocaleString()}
                            </span>
                          )}
                        </button>
                      ))}

                      {/* Stairs / Elevator / Long Carry */}
                      <AccessCard
                        accessType={quickAccessType} setAccessType={setQuickAccessType}
                        accessQty={quickAccessQty} setAccessQty={setQuickAccessQty}
                        elevatorDedicated={quickElevatorDedicated} setElevatorDedicated={setQuickElevatorDedicated}
                        compact
                      />

                      {/* Peak Season Note */}
                      <div className="p-4 rounded-xl border border-orange-200 bg-orange-50 text-sm text-orange-800">
                        <span className="font-semibold">☀️ Peak Season Notice (June–August):</span> Summer is our busiest time. Rates may be higher during peak season — contact us for an exact summer quote.
                      </div>
                    </div>
                  </div>

                  {/* Materials Guide */}
                  <div>
                    <h3 className="text-lg font-serif font-bold mb-3">Packing Supplies Estimator</h3>
                    <p className="text-sm text-muted-foreground mb-3">See roughly how many boxes and materials you'll need — and where to buy them near you.</p>
                    <MaterialsGuide bedrooms={quickBR} />
                  </div>

                  {/* Contact */}
                  <div>
                    <h3 className="text-lg font-serif font-bold mb-4">Your Contact Info</h3>
                    <p className="text-sm text-muted-foreground mb-4">We'll send your full estimate and have a coordinator call you within 1 hour.</p>
                    <ContactStep onSubmit={v => handleSubmit(v, true)} isPending={createEstimate.isPending || createLead.isPending} defaults={{ phone: prefillPhone, moveFromZip: prefillFrom, moveToZip: prefillTo }} />
                  </div>
                </div>

                {/* Live summary sidebar */}
                <div className="hidden lg:block">
                  <div className="sticky top-28 space-y-4">
                    {quickDist === "long_distance" ? (
                      <>
                        <LongDistSummary calc={quickLdCalc} band={quickLdBandObj} />
                        <div className="p-4 bg-secondary/30 rounded-xl text-xs text-muted-foreground space-y-1">
                          <div className="flex justify-between"><span>Home size</span><span>{quickBRData.label}</span></div>
                          <div className="flex justify-between"><span>Est. volume</span><span>~{quickBRData.avgCuft.toLocaleString()} cu ft</span></div>
                          <div className="flex justify-between font-medium border-t border-border/40 pt-1 mt-1"><span>Distance band</span><span>{quickLdBandObj.label}</span></div>
                        </div>
                      </>
                    ) : (
                      <>
                        <HourlyPriceSummary calc={quickHourlyCalc} crewOption={quickCrewOption} />
                        <div className="p-4 bg-secondary/30 rounded-xl text-xs text-muted-foreground space-y-1">
                          <div className="flex justify-between"><span>Home size</span><span>{quickBRData.label}</span></div>
                          <div className="flex justify-between"><span>Est. hours</span><span>{quickHourlyCalc.hoursLo}–{quickHourlyCalc.hoursHi} hrs</span></div>
                          <div className="flex justify-between font-medium border-t border-border/40 pt-1 mt-1">
                            <span>Rate</span>
                            <span>${quickCrewOption.rate}/hr</span>
                          </div>
                        </div>
                      </>
                    )}
                    <a href="tel:6606677770" className="flex items-center gap-2 p-4 bg-secondary/30 rounded-xl text-sm font-medium hover:bg-secondary/50 transition-colors">
                      <Phone className="w-4 h-4 text-primary" /> Prefer to call? (660) 667-7770
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ── DETAILED ESTIMATE ── */
            <motion.div key="detailed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {detailStep > 0 && (
                      <button onClick={() => setDetailStep(s => s - 1)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                    )}
                    {detailStep === 0 && (
                      <button onClick={resetAll} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">Step {detailStep + 1} of {totalDetailSteps}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((detailStep + 1) / totalDetailSteps) * 100}%` }} />
                </div>
                <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
                  {["Setup", ...ROOMS.map(r => r.emoji), "Add-Ons", "Contact"].map((label, i) => (
                    <button key={i} onClick={() => i <= detailStep && setDetailStep(i)}
                      className={`shrink-0 px-2 py-1 rounded text-xs font-medium transition-colors ${i === detailStep ? "bg-primary text-primary-foreground" : i < detailStep ? "bg-primary/20 text-primary cursor-pointer" : "bg-muted text-muted-foreground cursor-not-allowed"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <AnimatePresence mode="wait">
                    {/* Step 0: Basic Info */}
                    {detailStep === 0 && (
                      <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h2 className="text-2xl font-serif font-bold mb-2">Start with the basics</h2>
                        <p className="text-muted-foreground mb-6">We'll use this as a starting point and add your actual items on top.</p>
                        <div className="space-y-6">
                          <div>
                            <label className="text-sm font-medium mb-3 block">How many bedrooms?</label>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                              {BEDROOM_DATA.map(d => (
                                <button key={d.bedrooms} type="button" onClick={() => setDetailBR(d.bedrooms)}
                                  className={`p-3 rounded-xl border-2 text-center transition-all ${detailBR === d.bedrooms ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                                  <div className="text-xl mb-1">{d.emoji}</div>
                                  <div className="text-xs font-bold">{d.label}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-3 block">Distance?</label>
                            <DistanceSelector value={detailDist} onChange={setDetailDist} />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1 block">Number of boxes (auto-set, editable)</label>
                            <div className="flex items-center gap-4">
                              <button type="button" onClick={() => setDetailBoxes(q => Math.max(0, q - 5))}
                                className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center font-bold text-lg hover:bg-muted">−</button>
                              <input type="number" min="0" max="500" value={detailBoxes}
                                onChange={e => setDetailBoxes(Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-24 text-center text-3xl font-serif font-bold border-0 border-b-2 border-primary focus:outline-none bg-transparent" />
                              <button type="button" onClick={() => setDetailBoxes(q => q + 5)}
                                className="w-10 h-10 rounded-full border-2 border-primary bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg hover:bg-primary/90">+</button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 text-center">{detailBRData.avgBoxes} boxes auto-suggested for {detailBRData.label}</p>
                          </div>
                        </div>
                        <Button className="w-full mt-8" size="lg" onClick={() => setDetailStep(1)}>
                          Start Room-by-Room <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </motion.div>
                    )}

                    {/* Steps 1..ROOMS.length: Room inventory */}
                    {detailStep >= 1 && detailStep <= ROOMS.length && (() => {
                      const room = ROOMS[detailStep - 1];
                      return (
                        <motion.div key={`room-${detailStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-4xl">{room.emoji}</span>
                            <div>
                              <h2 className="text-2xl font-serif font-bold">{room.name}</h2>
                              <p className="text-sm text-muted-foreground">Tap + to add items. Each item shows its cubic feet.</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
                            {room.items.map(item => (
                              <ItemCard
                                key={item.name}
                                name={item.name}
                                emoji={item.emoji}
                                cubicFeet={item.cubicFeet}
                                qty={inventory[item.name] ?? 0}
                                onChange={qty => updateInventory(item.name, qty)}
                              />
                            ))}
                          </div>
                          <div className="flex gap-3 mt-8">
                            <Button variant="outline" className="flex-1" onClick={() => setDetailStep(s => s - 1)}>
                              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                            </Button>
                            <Button className="flex-1" onClick={() => setDetailStep(s => s + 1)}>
                              {detailStep === ROOMS.length ? "Review Add-Ons" : `Next: ${ROOMS[detailStep]?.name}`} <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })()}

                    {/* Add-Ons step */}
                    {detailStep === addonsStep && (
                      <motion.div key="addons" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h2 className="text-2xl font-serif font-bold mb-2">Add-on Services</h2>
                        <p className="text-muted-foreground mb-6">Optional services — priced per pound of your move volume.</p>
                        <div className="space-y-4">
                          {[
                            { id: "pack",   label: "Full Packing Service", sub: "Our crew packs every room with professional materials", detail: "All packing supplies included — boxes, paper, bubble wrap, wardrobe boxes. Priced at $0.15–$0.21/lb.", value: hasPacking,   set: setHasPacking },
                            { id: "unpack", label: "Unpacking Service",    sub: "We unpack, unwrap, and place items at your new home",  detail: "We remove all packing materials and place items where you want them. Priced at $0.15–$0.21/lb (≈ $1.05–$1.47/cu ft).",    value: hasUnpacking, set: setHasUnpacking },
                          ].map(item => (
                            <button key={item.id} type="button" onClick={() => item.set(v => !v)}
                              className={`w-full text-left p-5 rounded-xl border-2 transition-all ${item.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                              <div className="flex items-start gap-4">
                                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${item.value ? "bg-primary border-primary" : "border-muted-foreground"}`}>
                                  {item.value && <CheckCircle className="w-4 h-4 text-primary-foreground" />}
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold">{item.label}</div>
                                  <div className="text-sm text-muted-foreground">{item.sub}</div>
                                  <div className="text-xs text-muted-foreground mt-1">{item.detail}</div>
                                </div>
                                <div className="text-right shrink-0">
                                  {item.value
                                    ? <div className="text-sm font-bold text-primary">
                                        +${detailCalc.packLow.toLocaleString()}–${detailCalc.packHigh.toLocaleString()}
                                      </div>
                                    : <div className="text-sm font-bold text-muted-foreground">$0.15–$0.21/lb</div>
                                  }
                                  <div className="text-xs text-muted-foreground">{Math.round(detailCalc.totalCuft)} cu ft</div>
                                </div>
                              </div>
                            </button>
                          ))}

                          {/* Stairs / Elevator / Long Carry */}
                          <AccessCard
                            accessType={detailAccessType} setAccessType={setDetailAccessType}
                            accessQty={detailAccessQty} setAccessQty={setDetailAccessQty}
                            elevatorDedicated={detailElevatorDedicated} setElevatorDedicated={setDetailElevatorDedicated}
                          />

                          {/* Peak Season Note */}
                          <div className="p-5 rounded-xl border border-orange-200 bg-orange-50 text-sm text-orange-800">
                            <span className="font-semibold">☀️ Peak Season Notice (June–August):</span> Summer is our busiest time. Rates may be higher during peak season — contact us for an exact summer quote.
                          </div>

                          {/* Long Distance Band — only when LD selected in setup */}
                          {detailDist === "long_distance" && (
                            <div className="p-5 rounded-xl border-2 border-secondary/50 bg-secondary/5">
                              <div className="font-semibold mb-1">Distance Band</div>
                              <div className="text-sm text-muted-foreground mb-3">Select your mileage range for accurate cu-ft pricing.</div>
                              <div className="grid grid-cols-2 gap-2">
                                {LONG_DIST_BANDS.map(band => (
                                  <button key={band.id} type="button" onClick={() => setDetailLdBand(band.id)}
                                    className={`p-3 rounded-lg border-2 text-left transition-all text-sm ${detailLdBand === band.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                                    <div className="font-medium">{band.label}</div>
                                    <div className="text-xs text-muted-foreground">${band.rateLo.toFixed(2)}–${band.rateHi.toFixed(2)}/cu ft</div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-3 mt-8">
                          <Button variant="outline" className="flex-1" onClick={() => setDetailStep(s => s - 1)}>
                            <ChevronLeft className="w-4 h-4 mr-1" /> Back
                          </Button>
                          <Button className="flex-1" onClick={() => setDetailStep(contactStep)}>
                            Continue to Contact <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {/* Contact step */}
                    {detailStep === contactStep && (
                      <motion.div key="contact" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h2 className="text-2xl font-serif font-bold mb-2">Your Contact Info</h2>
                        <p className="text-muted-foreground mb-6">We'll send your detailed estimate and have a coordinator call you within 1 hour.</p>
                        <ContactStep onSubmit={v => handleSubmit(v, false)} isPending={createEstimate.isPending || createLead.isPending} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Live price sidebar */}
                <div className="hidden lg:block">
                  <div className="sticky top-28 space-y-4">
                    {detailDist === "long_distance"
                      ? <LongDistSummary calc={detailLdCalc} band={detailLdBandObj} />
                      : <HourlyPriceSummary calc={detailHourlyCalc} crewOption={CREW_OPTIONS[0]} />
                    }
                    <div className="p-4 bg-secondary/30 rounded-xl">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Your Inventory</p>
                      {Object.entries(inventory).filter(([, q]) => q > 0).length === 0 ? (
                        <p className="text-xs text-muted-foreground">No items added yet</p>
                      ) : (
                        <div className="space-y-1 max-h-48 overflow-y-auto">
                          {Object.entries(inventory).filter(([, q]) => q > 0).map(([name, qty]) => (
                            <div key={name} className="flex justify-between text-xs">
                              <span className="text-muted-foreground truncate">{name}</span>
                              <span className="font-medium ml-2">×{qty}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <a href="tel:6606677770" className="flex items-center gap-2 p-4 bg-secondary/30 rounded-xl text-sm font-medium hover:bg-secondary/50 transition-colors">
                      <Phone className="w-4 h-4 text-primary" /> Call (660) 667-7770
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PublicLayout>
  );
}
