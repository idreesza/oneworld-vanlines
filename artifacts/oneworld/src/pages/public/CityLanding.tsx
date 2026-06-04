import { useParams, Link } from "wouter";
import PublicLayout from "@/components/layout/PublicLayout";
import SeoHead from "@/components/SeoHead";
import { MapPin, Phone, CheckCircle2, ArrowRight, Star, Truck, Shield, Award } from "lucide-react";
import MoveDatePicker from "@/components/ui/MoveDatePicker";
import { useCreateLead } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { motion } from "framer-motion";

type Neighborhood = {
  name: string;
  note: string;
};

type CityData = {
  name: string;
  state: string;
  isHQ?: boolean;
  headline: string;
  metaTitle: string;
  metaDesc: string;
  intro: string;
  body: string[];
  neighborhoods?: Neighborhood[];
  nearbyAreas: string[];
  services: string[];
  zipCodes?: string[];
  faqs?: { q: string; a: string }[];
};

const cityData: Record<string, CityData> = {
  carrollton: {
    name: "Carrollton", state: "TX", isHQ: true,
    metaTitle: "Carrollton TX Movers | One World Van Lines | (660) 667-7770",
    metaDesc: "One World Van Lines — Carrollton's hometown movers. Licensed, bonded & insured. Local and long-distance moving from our Carrollton HQ. No hidden fees. Call (660) 667-7770.",
    headline: "Carrollton's Most Trusted Moving Company",
    intro: "One World Van Lines is headquartered right here in Carrollton, TX. We know every neighborhood in this city — from Josey Ranch to Old Carrollton — and we handle more local moves here than anyone.",
    body: [
      "Carrollton is a diverse, fast-growing city at the crossroads of Dallas, Denton, and Collin counties. Whether you're moving within Carrollton, relocating to another DFW city, or heading long-distance, our crews are based right here and ready to go.",
      "We serve every ZIP code in Carrollton: 75006, 75007, 75010, and 75011. Apartments near the DART Green Line? High-rise condos near I-35? Single-family homes in Prestonwood? We've moved them all.",
      "Our Carrollton customers get priority scheduling and some of our fastest response times. Call us at (660) 667-7770 and a coordinator will get back to you within the hour."
    ],
    neighborhoods: [
      { name: "Josey Ranch", note: "Master-planned community with strict HOA move-in rules — we handle the coordination." },
      { name: "Prestonwood", note: "Established neighborhood with large homes and narrow cul-de-sacs our crew knows well." },
      { name: "Old Carrollton", note: "Older homes requiring careful furniture navigation — our specialty." },
      { name: "Indian Creek", note: "Golf community with gated sections — we coordinate access ahead of time." },
      { name: "Keller Springs", note: "Apartment-heavy corridor near DART — elevator scheduling included." },
    ],
    nearbyAreas: ["Addison", "Farmers Branch", "Coppell", "Lewisville", "The Colony", "Irving", "Plano", "Richardson"],
    services: ["Local moves within Carrollton", "Moves to or from any DFW city", "Long-distance moves from Carrollton", "Apartment and condo moves", "Office and commercial relocation", "Full packing and unpacking service", "Piano and specialty item moving", "Labor-only moving (loading/unloading)"],
    zipCodes: ["75006", "75007", "75010", "75011"],
    faqs: [
      { q: "How much does it cost to move in Carrollton?", a: "Most local Carrollton moves cost $350–$700 for a 1–2 bedroom and $700–$1,400 for a 3–4 bedroom home. We provide free, itemized estimates with no hidden fees." },
      { q: "Are you based in Carrollton?", a: "Yes — our headquarters is at 2305 Belt Line Rd, Suite 120B, Carrollton, TX 75006. We're local and respond fast." },
    ],
  },
  dallas: {
    name: "Dallas", state: "TX",
    metaTitle: "Dallas Movers | Moving Company Dallas TX | One World Van Lines",
    metaDesc: "Top-rated Dallas movers — licensed, bonded & insured. One World Van Lines serves Uptown, Downtown, Oak Lawn, Deep Ellum, Lakewood & all Dallas neighborhoods. No hidden fees. Free estimate. (660) 667-7770.",
    headline: "Dallas Moving Company — All Neighborhoods, Every Zip Code",
    intro: "One World Van Lines serves every corner of Dallas — from Uptown high-rises and Deep Ellum lofts to Lakewood bungalows, Preston Hollow estates, and Oak Cliff homes. Licensed, bonded, insured, and transparent on pricing.",
    body: [
      "Moving in Dallas requires knowing the city — which buildings require elevator reservations and COI paperwork, which streets have parking restrictions, and how to navigate peak-hour traffic. Our crews have done thousands of Dallas moves and know every block.",
      "We've moved customers in Uptown, Highland Park, University Park, M Streets, Lakewood, Bishop Arts District, Oak Cliff, South Dallas, Lake Highlands, Deep Ellum, Knox-Henderson, Oak Lawn, Greenville Avenue, and everywhere in between.",
      "Whether you need local Dallas movers, a high-rise apartment move, a commercial office relocation, or a long-distance move from Dallas to Austin or Houston — call (660) 667-7770 for a same-day estimate."
    ],
    neighborhoods: [
      { name: "Uptown", note: "High-rise freight elevators, loading dock reservations, and COI paperwork — we handle it all before move day." },
      { name: "Deep Ellum", note: "Loft conversions with industrial freight elevators and steep concrete stairs. We bring the right equipment." },
      { name: "Oak Lawn", note: "Dense apartment complexes with limited parking and move-in windows. We schedule around your building's rules." },
      { name: "Lakewood", note: "Tree-lined streets with narrow driveways and 1940s floor plans that don't fit standard furniture paths — we know every corner." },
      { name: "Bishop Arts", note: "Charming bungalows with narrow alleys and street-parking-only access. Our crew stages smart." },
      { name: "Preston Hollow", note: "Large estate homes requiring oversized equipment and extended crew. We've done hundreds of high-value home moves here." },
      { name: "M Streets", note: "Historic neighborhood with tight turns and mature trees. Our drivers navigate it daily." },
      { name: "Knox-Henderson", note: "Mix of high-rises and walkups — we coordinate building access in advance." },
      { name: "Lake Highlands", note: "Family-friendly neighborhood — we move everything from starter homes to 4,000 sq ft properties." },
      { name: "Highland Park / University Park", note: "Park Cities moves requiring white-glove care for high-value furniture and art." },
    ],
    nearbyAreas: ["Plano", "Irving", "Garland", "Richardson", "Carrollton", "Mesquite", "Arlington", "Addison"],
    services: [
      "Dallas apartment and high-rise moves (elevator/COI coordination included)",
      "Local moves within Dallas — any neighborhood",
      "Commercial office relocation in Dallas",
      "Long-distance moves from Dallas to Austin, Houston, San Antonio",
      "Piano moving in Dallas (upright, baby grand, concert grand)",
      "Specialty item moves — safes, antiques, fine art",
      "Full packing and unpacking service",
      "Labor-only moving (load/unload your rental truck)",
    ],
    zipCodes: ["75201","75202","75204","75205","75206","75207","75208","75209","75214","75215","75216","75218","75219","75220","75223","75224","75225","75226","75227","75228","75229","75230","75231","75232","75233","75235","75238","75240","75243","75244","75248","75251","75252"],
    faqs: [
      { q: "Who are the best movers in Dallas TX?", a: "One World Van Lines is consistently rated 4.9/5 by Dallas customers with 5,430+ completed moves. We're licensed, bonded, and insured — a direct carrier with transparent pricing and no hidden fees." },
      { q: "How much does it cost to hire movers in Dallas?", a: "Local Dallas moves typically range from $350–$700 for a 1–2 bedroom apartment and $700–$1,500+ for a 3–4 bedroom home. Long-distance moves have binding estimates. We never charge hidden fees." },
      { q: "Do you move high-rise apartments in Uptown Dallas?", a: "Yes — Uptown, Victory Park, and Downtown high-rises are a specialty. We handle elevator reservations, COI documentation, and loading dock scheduling as part of every move." },
      { q: "Do you move pianos in Dallas?", a: "Yes. We move upright pianos, baby grands, and concert grands throughout DFW using trained specialists and proper equipment. Call (660) 667-7770 for a piano moving quote." },
    ],
  },
  plano: {
    name: "Plano", state: "TX",
    metaTitle: "Plano TX Movers | Moving Company Plano TX | One World Van Lines",
    metaDesc: "Professional movers in Plano, TX. One World Van Lines — licensed, bonded & insured. Local and long-distance moving in West Plano, Legacy, and all ZIP codes. No hidden fees. (660) 667-7770.",
    headline: "Professional Movers in Plano, TX — Local & Long-Distance",
    intro: "One World Van Lines serves all of Plano — from the Legacy business corridor to West Plano master-planned communities to the apartment complexes near US-75. Fast response, transparent pricing, trained crews.",
    body: [
      "Plano is one of DFW's largest and most prosperous cities, home to corporate headquarters, master-planned neighborhoods, and a diverse population of families and young professionals constantly on the move.",
      "We handle local moves within Plano and between Plano and anywhere in DFW or Texas. Our crews know Plano's apartment buildings, high-rise corridors near Legacy Drive, and gated communities in West Plano.",
      "Plano ZIP codes served: 75023, 75024, 75025, 75026, 75074, 75075, 75093, 75094."
    ],
    neighborhoods: [
      { name: "Legacy West", note: "Corporate campus area with luxury apartments — we handle elevator scheduling and COI." },
      { name: "West Plano", note: "Master-planned communities with HOA move-in requirements we manage for you." },
      { name: "Downtown Plano", note: "Historic district with older buildings requiring careful navigation." },
      { name: "Willow Bend", note: "Upscale neighborhood — white-glove care for high-value furniture." },
    ],
    nearbyAreas: ["Frisco", "Allen", "McKinney", "Richardson", "Garland", "Carrollton", "Dallas"],
    services: ["Local Plano moves", "Apartment moves near Plano Parkway", "Office moves in the Legacy corridor", "Long-distance moves from Plano", "Piano and specialty item moving", "Full packing service"],
    zipCodes: ["75023", "75024", "75025", "75026", "75074", "75075", "75093", "75094"],
    faqs: [
      { q: "How much do movers cost in Plano TX?", a: "Most Plano local moves cost $350–$1,200 depending on home size. We provide free, itemized estimates with no hidden fees. Call (660) 667-7770." },
    ],
  },
  frisco: {
    name: "Frisco", state: "TX",
    metaTitle: "Frisco TX Movers | Moving Company Frisco TX | One World Van Lines",
    metaDesc: "Top-rated movers in Frisco, TX. One World Van Lines — licensed, bonded & insured. Local and long-distance moves throughout Frisco. Same-day quotes. No hidden fees. (660) 667-7770.",
    headline: "Moving Company in Frisco, TX — Fast, Reliable, Transparent",
    intro: "One World Van Lines handles dozens of Frisco moves every month. America's fastest-growing city deserves movers who can keep up — and we do.",
    body: [
      "Frisco has exploded over the past decade, bringing thousands of new families and businesses to master-planned communities throughout the city. Demand for moving services is constant and high.",
      "We serve all of Frisco — from Starwood and Stonebriar to the new developments along DNT and Fields at Panther Creek. Our crews know the HOA move-in requirements, gate codes, and elevator protocols of Frisco's top communities.",
      "Whether you're arriving in Frisco from another state or relocating within the city, call (660) 667-7770 for a same-day quote."
    ],
    neighborhoods: [
      { name: "Starwood", note: "Gated community — we coordinate access and HOA move-in rules in advance." },
      { name: "Stonebriar", note: "Established community near PGA headquarters with large homes." },
      { name: "Fields", note: "New development — new construction move-in setup is a specialty." },
      { name: "The Canals at Grand Park", note: "Urban mixed-use — we handle elevator and parking coordination." },
    ],
    nearbyAreas: ["Plano", "McKinney", "Allen", "Little Elm", "The Colony", "Prosper", "Celina"],
    services: ["Local moves within Frisco", "Moves from Frisco to any DFW city", "Long-distance moves to/from Frisco", "New construction move-in setup", "Commercial office moves in Frisco", "Full packing service"],
  },
  mckinney: {
    name: "McKinney", state: "TX",
    metaTitle: "McKinney TX Movers | Moving Company McKinney TX | One World Van Lines",
    metaDesc: "Reliable movers in McKinney, TX. One World Van Lines — licensed, bonded & insured. Downtown McKinney, Craig Ranch, Tucker Hill & all ZIP codes. No hidden fees. (660) 667-7770.",
    headline: "McKinney, TX Moving Company — Historic Downtown to New Build",
    intro: "One World Van Lines moves McKinney families and businesses throughout the city — from historic downtown lofts and Adriatica Village to Craig Ranch, Tucker Hill, and new construction all over Collin County.",
    body: [
      "McKinney offers a rare combination of small-town charm and rapid growth. Its historic downtown district, diverse housing stock, and expanding business community make it one of DFW's most desirable addresses.",
      "We serve all McKinney ZIP codes: 75069, 75070, 75071, 75072. Whether you're moving into a new Lennar home in Tucker Hill or out of a downtown apartment above a restaurant, our crew handles it with care.",
    ],
    neighborhoods: [
      { name: "Historic Downtown McKinney", note: "Lofts and older buildings above restaurants — we navigate tight staircases." },
      { name: "Craig Ranch", note: "Master-planned community with HOA move-in rules we coordinate for you." },
      { name: "Tucker Hill", note: "New construction with careful move-in timelines." },
      { name: "Adriatica Village", note: "European-style community requiring careful parking and access coordination." },
    ],
    nearbyAreas: ["Frisco", "Allen", "Plano", "Prosper", "Fairview", "Celina"],
    services: ["Local McKinney moves", "New build move-ins", "Moves from McKinney to Austin", "Specialty item moves (piano, safe)", "Full packing service"],
    zipCodes: ["75069", "75070", "75071", "75072"],
  },
  allen: {
    name: "Allen", state: "TX",
    metaTitle: "Allen TX Movers | Moving Company Allen TX | One World Van Lines",
    metaDesc: "Trusted movers in Allen, TX. One World Van Lines — licensed, bonded & insured. Local and long-distance moving throughout Allen. Free estimate. (660) 667-7770.",
    headline: "Reliable Movers in Allen, TX — Trusted by DFW Families",
    intro: "One World Van Lines serves Allen with the same quality crew and transparent pricing we're known for across DFW. Quick response, trained movers, real estimates.",
    body: [
      "Allen is one of DFW's most family-friendly cities, consistently ranked among the safest and best places to live in Texas. Growing fast — and so is our schedule in Allen.",
      "We move homes, apartments, and offices throughout Allen. ZIP codes served: 75002, 75013.",
    ],
    nearbyAreas: ["Plano", "McKinney", "Frisco", "Richardson"],
    services: ["Local Allen moves", "Office moves near US-75", "Long-distance moves from Allen", "Piano and specialty item moving"],
    zipCodes: ["75002", "75013"],
  },
  irving: {
    name: "Irving", state: "TX",
    metaTitle: "Irving TX Movers | Moving Company Irving TX | One World Van Lines",
    metaDesc: "Professional movers in Irving, TX — Las Colinas, DFW Airport area & beyond. One World Van Lines: licensed, bonded & insured. No hidden fees. (660) 667-7770.",
    headline: "Irving TX Moving Company — Las Colinas & Corporate Relocation",
    intro: "Irving is one of DFW's most connected cities — corporate headquarters, international airport access, and the Las Colinas urban center. One World Van Lines handles corporate and residential moves throughout.",
    body: [
      "Irving's diverse economy brings in thousands of new residents and businesses annually. The Las Colinas area in particular sees constant turnover in luxury apartments and corporate relocations.",
      "We handle Irving moves with the same professionalism we bring to every job. Our crews are experienced with Las Colinas high-rises, older Irving neighborhoods, and the commercial centers near DFW Airport.",
    ],
    neighborhoods: [
      { name: "Las Colinas", note: "High-rise luxury apartments and corporate campuses — we handle elevator and COI coordination." },
      { name: "Valley Ranch", note: "Established neighborhood with large homes and mature trees." },
      { name: "Coppell area (Irving side)", note: "Near DFW Airport — we know the access routes and timing." },
    ],
    nearbyAreas: ["Coppell", "Carrollton", "Grand Prairie", "Arlington", "Dallas", "Grapevine"],
    services: ["Las Colinas apartment and high-rise moves", "Corporate office relocation", "Local Irving moves", "Airport-area moves (near DFW)", "Long-distance moves from Irving"],
  },
  "fort-worth": {
    name: "Fort Worth", state: "TX",
    metaTitle: "Fort Worth TX Movers | Moving Company Fort Worth | One World Van Lines",
    metaDesc: "Top-rated Fort Worth movers — licensed, bonded & insured. One World Van Lines serves Cultural District, Sundance Square, TCU area & all Fort Worth neighborhoods. (660) 667-7770.",
    headline: "Fort Worth Movers — Cowtown's Most Professional Moving Company",
    intro: "One World Van Lines brings the same premium moving experience to Fort Worth. From the Cultural District to Sundance Square to Magnolia Avenue — trained crews, honest pricing, no surprises.",
    body: [
      "Fort Worth has its own distinct identity within DFW — and its own moving needs. The city's mix of historic neighborhoods, new suburban development, and commercial expansion keeps our crews busy year-round.",
      "We serve all Fort Worth ZIP codes. Whether you're moving to a new home in Aledo, a condo near Magnolia Avenue, or relocating your business from downtown, we have the crew and equipment to get it done.",
    ],
    neighborhoods: [
      { name: "Cultural District", note: "Museum row area — white-glove care for art and fragile items." },
      { name: "Sundance Square", note: "Downtown condos and lofts — elevator and parking coordination included." },
      { name: "Magnolia Avenue", note: "Trendy walkable neighborhood with older building quirks our crew knows." },
      { name: "Near Southside", note: "Mix of apartments and bungalows — tight street parking managed." },
      { name: "TCU Area", note: "Student and family moves near TCU campus." },
    ],
    nearbyAreas: ["Hurst", "Euless", "Bedford", "Arlington", "Burleson", "Keller", "Mansfield"],
    services: ["Local Fort Worth moves", "Cultural District area moves", "TCU / near-campus moves", "Suburban home moving", "Commercial moves in Fort Worth", "Long-distance from Fort Worth"],
  },
  arlington: {
    name: "Arlington", state: "TX",
    metaTitle: "Arlington TX Movers | Moving Company Arlington TX | One World Van Lines",
    metaDesc: "Reliable movers in Arlington, TX — AT&T Stadium area, UT Arlington & beyond. One World Van Lines: licensed, bonded & insured. No hidden fees. (660) 667-7770.",
    headline: "Arlington TX Moving Company — Between Dallas and Fort Worth",
    intro: "One World Van Lines serves Arlington with reliable, professional crews. Midway between Dallas and Fort Worth, we cover all of Arlington's neighborhoods — from Globe Life Field to UT Arlington to the quiet eastern suburbs.",
    body: [
      "Arlington is one of the largest cities in DFW — a city that spans from the entertainment district near Globe Life Field and AT&T Stadium to quiet residential suburbs in its eastern and southern reaches.",
      "We handle Arlington moves with the same standards we bring to every job: on time, careful, and transparent about pricing.",
    ],
    nearbyAreas: ["Grand Prairie", "Mansfield", "Irving", "Fort Worth", "Euless", "Bedford"],
    services: ["Local Arlington moves", "Apartment moves near UT Arlington", "Long-distance moves from Arlington", "Commercial office moves", "Sports district area moves"],
  },
  richardson: {
    name: "Richardson", state: "TX",
    metaTitle: "Richardson TX Movers | Moving Company Richardson TX | One World Van Lines",
    metaDesc: "Professional movers in Richardson, TX — Telecom Corridor, UTD area & all neighborhoods. One World Van Lines: licensed, bonded & insured. Free estimate. (660) 667-7770.",
    headline: "Richardson TX Movers — Telecom Corridor & Beyond",
    intro: "One World Van Lines serves all of Richardson — from the Telecom Corridor tech campuses to UTD student housing to established neighborhoods like Arapaho Estates and Sherrill Park.",
    body: [
      "Richardson is home to one of the highest concentrations of technology companies in Texas. Employee relocations, apartment moves near UTD, and family home moves keep our crews busy year-round.",
      "We serve all Richardson ZIP codes: 75080, 75081, 75082, 75083.",
    ],
    nearbyAreas: ["Plano", "Garland", "Dallas", "Allen", "McKinney"],
    services: ["Local Richardson moves", "Telecom Corridor office relocations", "UTD-area apartment moves", "Long-distance moves from Richardson"],
    zipCodes: ["75080", "75081", "75082", "75083"],
  },
  garland: {
    name: "Garland", state: "TX",
    metaTitle: "Garland TX Movers | Moving Company Garland TX | One World Van Lines",
    metaDesc: "Trusted movers in Garland, TX. One World Van Lines — licensed, bonded & insured. Residential, apartment & commercial moving throughout Garland. (660) 667-7770.",
    headline: "Garland TX Moving Company — Local & Long-Distance Movers",
    intro: "One World Van Lines serves all of Garland with professional, transparent moving services. Whether you're moving within Garland or heading to another DFW city, our trained crews are ready.",
    body: [
      "Garland is a large, diverse city east of Dallas with a mix of single-family homes, apartment communities, and commercial properties.",
      "We serve all Garland ZIP codes including 75040, 75041, 75042, 75043, 75044, 75045.",
    ],
    nearbyAreas: ["Richardson", "Dallas", "Mesquite", "Rowlett", "Sachse"],
    services: ["Local Garland moves", "Apartment moves in Garland", "Long-distance from Garland", "Office and commercial relocation"],
    zipCodes: ["75040", "75041", "75042", "75043", "75044"],
  },
  mesquite: {
    name: "Mesquite", state: "TX",
    metaTitle: "Mesquite TX Movers | Moving Company Mesquite TX | One World Van Lines",
    metaDesc: "Reliable movers in Mesquite, TX. One World Van Lines — licensed, bonded & insured. Local and long-distance moving throughout Mesquite. Free estimate. (660) 667-7770.",
    headline: "Mesquite TX Moving Company — Trusted Local Movers",
    intro: "One World Van Lines serves Mesquite with the same quality and transparency we bring to all of DFW. Fast response, no hidden fees, trained crews.",
    body: [
      "Mesquite is a family-friendly city southeast of Dallas with established neighborhoods and growing suburban communities.",
      "ZIP codes served: 75149, 75150.",
    ],
    nearbyAreas: ["Garland", "Balch Springs", "Rowlett", "Dallas", "Sunnyvale"],
    services: ["Local Mesquite moves", "Apartment moves", "Long-distance from Mesquite", "Office relocation"],
    zipCodes: ["75149", "75150"],
  },
  denton: {
    name: "Denton", state: "TX",
    metaTitle: "Denton TX Movers | Moving Company Denton TX | One World Van Lines",
    metaDesc: "Professional movers in Denton, TX — UNT, TWU & all Denton neighborhoods. One World Van Lines: licensed, bonded & insured. No hidden fees. (660) 667-7770.",
    headline: "Denton TX Moving Company — UNT Area & Beyond",
    intro: "One World Van Lines serves all of Denton — from university housing near UNT and TWU to Robson Ranch and growing suburban developments on the south side.",
    body: [
      "Denton is a college town with a vibrant arts scene and rapidly growing population. Student moves, family moves, and corporate relocations keep our schedule full year-round.",
      "We serve all Denton ZIP codes: 76201, 76205, 76207, 76208, 76209, 76210.",
    ],
    nearbyAreas: ["Lewisville", "Flower Mound", "Corinth", "Highland Village", "Little Elm"],
    services: ["UNT and TWU area student moves", "Local Denton moves", "Long-distance from Denton", "Senior move management (Robson Ranch area)"],
    zipCodes: ["76201", "76205", "76207", "76208", "76210"],
  },
  lewisville: {
    name: "Lewisville", state: "TX",
    metaTitle: "Lewisville TX Movers | Moving Company Lewisville TX | One World Van Lines",
    metaDesc: "Trusted movers in Lewisville, TX. One World Van Lines — licensed, bonded & insured. Local and long-distance moving in Lewisville and all surrounding cities. (660) 667-7770.",
    headline: "Lewisville TX Movers — Local & Long-Distance Moving",
    intro: "One World Van Lines serves all of Lewisville with professional, transparent moving services. A quick trip from Carrollton — we know Lewisville neighborhoods inside and out.",
    body: [
      "Lewisville is a growing city at the north end of DFW, known for its lake, diverse dining scene, and family-friendly neighborhoods.",
      "ZIP codes served: 75019, 75029, 75056, 75057, 75067, 75077.",
    ],
    nearbyAreas: ["Carrollton", "Flower Mound", "Highland Village", "Coppell", "The Colony", "Denton"],
    services: ["Local Lewisville moves", "Lakeside area apartment moves", "Long-distance from Lewisville", "Office relocation"],
    zipCodes: ["75019", "75029", "75057", "75067"],
  },
  "flower-mound": {
    name: "Flower Mound", state: "TX",
    metaTitle: "Flower Mound TX Movers | Moving Company Flower Mound | One World Van Lines",
    metaDesc: "Professional movers in Flower Mound, TX. One World Van Lines — licensed, bonded & insured. Local and long-distance moving in all Flower Mound communities. (660) 667-7770.",
    headline: "Flower Mound TX Moving Company — Trusted by Local Families",
    intro: "One World Van Lines serves Flower Mound with professional, white-glove service. One of DFW's most affluent suburbs, Flower Mound moves require experienced movers who handle high-value homes with care.",
    body: [
      "Flower Mound is consistently ranked among the best places to live in Texas, with large homes, top schools, and a strong sense of community.",
      "ZIP codes served: 75022, 75028.",
    ],
    nearbyAreas: ["Lewisville", "Highland Village", "Coppell", "Grapevine", "Carrollton"],
    services: ["Local Flower Mound moves", "High-value home moves", "Long-distance from Flower Mound", "Full packing service"],
    zipCodes: ["75022", "75028"],
  },
  grapevine: {
    name: "Grapevine", state: "TX",
    metaTitle: "Grapevine TX Movers | Moving Company Grapevine TX | One World Van Lines",
    metaDesc: "Reliable movers in Grapevine, TX — near DFW Airport & Main Street. One World Van Lines: licensed, bonded & insured. No hidden fees. (660) 667-7770.",
    headline: "Grapevine TX Moving Company — Near DFW Airport",
    intro: "One World Van Lines serves Grapevine with reliable, professional moving services. Near DFW International Airport with a charming historic district — we know every part of this city.",
    body: [
      "Grapevine's location near DFW Airport makes it a hub for corporate relocations. Its historic downtown and Lake Grapevine area attract families from across Texas.",
      "ZIP codes served: 76051, 76092.",
    ],
    nearbyAreas: ["Coppell", "Flower Mound", "Southlake", "Colleyville", "Irving"],
    services: ["Local Grapevine moves", "Corporate relocation near DFW Airport", "Historic district home moves", "Long-distance from Grapevine"],
    zipCodes: ["76051", "76092"],
  },
  southlake: {
    name: "Southlake", state: "TX",
    metaTitle: "Southlake TX Movers | Moving Company Southlake TX | One World Van Lines",
    metaDesc: "White-glove movers in Southlake, TX. One World Van Lines — licensed, bonded & insured. High-value home moving in Southlake Town Square area & all neighborhoods. (660) 667-7770.",
    headline: "Southlake TX Moving Company — White-Glove Movers for Luxury Homes",
    intro: "One World Van Lines specializes in the high-value home moves that Southlake requires. With custom estates, luxury furnishings, and premium finishes throughout, every Southlake move demands our white-glove treatment.",
    body: [
      "Southlake is one of the wealthiest communities in North Texas, known for Carroll ISD schools and the Southlake Town Square. Our crew treats every home — and everything in it — with the care it deserves.",
      "ZIP codes served: 76092.",
    ],
    nearbyAreas: ["Grapevine", "Colleyville", "Keller", "Trophy Club", "Westlake"],
    services: ["Luxury home moves in Southlake", "Estate moves with white-glove care", "Fine art and antique moving", "Long-distance from Southlake"],
    zipCodes: ["76092"],
  },
  "grand-prairie": {
    name: "Grand Prairie", state: "TX",
    metaTitle: "Grand Prairie TX Movers | Moving Company Grand Prairie | One World Van Lines",
    metaDesc: "Trusted movers in Grand Prairie, TX. One World Van Lines — licensed, bonded & insured. Local and long-distance moving throughout Grand Prairie. (660) 667-7770.",
    headline: "Grand Prairie TX Moving Company — Dallas–Fort Worth Corridor",
    intro: "One World Van Lines serves all of Grand Prairie — from the entertainment district near South Grand Prairie to the growing residential neighborhoods throughout the city.",
    body: [
      "Grand Prairie stretches across the heart of DFW, making it uniquely connected to both Dallas and Fort Worth. Our crews serve the entire city.",
      "ZIP codes served: 75050, 75051, 75052, 75054.",
    ],
    nearbyAreas: ["Irving", "Arlington", "Mansfield", "Dallas", "Duncanville"],
    services: ["Local Grand Prairie moves", "Apartment and condo moves", "Long-distance from Grand Prairie", "Office relocation"],
    zipCodes: ["75050", "75051", "75052"],
  },
  austin: {
    name: "Austin", state: "TX",
    metaTitle: "Austin TX Movers | Moving Company Austin TX | One World Van Lines",
    metaDesc: "Top-rated Austin movers & DFW-to-Austin long-distance specialists. One World Van Lines — licensed, bonded & insured. Domain, SoCo, Cedar Park & all of Austin. (660) 667-7770.",
    headline: "Austin Moving Company — Local & Long-Distance from DFW",
    intro: "One World Van Lines serves Greater Austin locally and handles the DFW-to-Austin corridor — one of the most common long-distance routes in Texas. Trusted by hundreds of Austin-area families.",
    body: [
      "Austin is Texas's second-fastest-growing metro, and the DFW-to-Austin route is one of our busiest. Whether you're relocating for a tech job, moving your family to the Hill Country, or heading to Round Rock, we've done this run hundreds of times.",
      "We also handle local moves within Austin and Greater Austin — from South Congress condos to the Domain apartments to suburban homes in Cedar Park and Round Rock.",
      "Austin-area ZIP codes served: all of Travis, Williamson, and Hays counties."
    ],
    neighborhoods: [
      { name: "South Congress (SoCo)", note: "Trendy neighborhood with parking-limited streets — we manage the logistics." },
      { name: "The Domain / North Austin", note: "Tech company hub with high-rise apartments and frequent corporate relocations." },
      { name: "Downtown Austin", note: "High-rises and condos near Congress Ave — elevator and COI coordination included." },
      { name: "East Austin", note: "Converted industrial spaces and bungalows — we've moved hundreds here." },
      { name: "Zilker / Barton Hills", note: "Hilly terrain with narrow roads — our drivers know the routes." },
      { name: "Mueller", note: "Urban neighborhood with tight parking and elevator-required buildings." },
    ],
    nearbyAreas: ["Round Rock", "Cedar Park", "Pflugerville", "Georgetown", "Kyle", "Buda", "Leander"],
    services: ["DFW-to-Austin long-distance moves (dedicated truck, no shared loads)", "Local Austin moves", "Austin apartment and condo moves", "Domain and North Austin moves", "South Austin and SoCo moves", "Corporate relocation to Austin", "Piano and specialty item moving in Austin"],
    faqs: [
      { q: "Do you move from Dallas to Austin?", a: "Yes — the DFW-to-Austin route is one of our most common. We use dedicated trucks (no shared loads) with GPS tracking and guaranteed delivery windows. Call (660) 667-7770." },
      { q: "How long does a Dallas to Austin move take?", a: "The DFW-to-Austin move is typically a 1-day move. Our crew loads in DFW in the morning and delivers to Austin the same day in most cases." },
    ],
  },
  "round-rock": {
    name: "Round Rock", state: "TX",
    metaTitle: "Round Rock TX Movers | Moving Company Round Rock TX | One World Van Lines",
    metaDesc: "Professional movers in Round Rock, TX. One World Van Lines — licensed, bonded & insured. Local and long-distance moving in Round Rock and all Greater Austin cities. (660) 667-7770.",
    headline: "Round Rock TX Moving Company — Greater Austin Movers",
    intro: "One World Van Lines serves Round Rock as part of our Greater Austin coverage. Whether you're moving locally in Round Rock or heading to DFW or beyond, our crews are ready.",
    body: [
      "Round Rock is one of the fastest-growing cities in Texas, home to Dell Technologies and a growing tech and healthcare sector. Employee and family relocations happen year-round.",
    ],
    nearbyAreas: ["Cedar Park", "Pflugerville", "Georgetown", "Austin", "Leander"],
    services: ["Local Round Rock moves", "DFW-to-Round Rock long-distance moves", "Corporate relocation (Dell, tech companies)", "Apartment and new construction moves"],
  },
  "cedar-park": {
    name: "Cedar Park", state: "TX",
    metaTitle: "Cedar Park TX Movers | Moving Company Cedar Park TX | One World Van Lines",
    metaDesc: "Trusted movers in Cedar Park, TX. One World Van Lines — licensed, bonded & insured. Local and long-distance moving throughout Cedar Park and Greater Austin. (660) 667-7770.",
    headline: "Cedar Park TX Moving Company — Northwest Austin Movers",
    intro: "One World Van Lines serves Cedar Park and the entire northwest Austin corridor. One of the fastest-growing suburbs in the country, Cedar Park sees constant moving activity.",
    body: [
      "Cedar Park's rapid growth has brought thousands of new homes and apartment communities. We handle new construction move-ins, local moves within Cedar Park, and long-distance moves to DFW and beyond.",
    ],
    nearbyAreas: ["Leander", "Round Rock", "Austin", "Georgetown", "Pflugerville"],
    services: ["Local Cedar Park moves", "New construction move-ins", "DFW-to-Cedar Park long-distance moves", "Apartment community moves"],
  },
  pflugerville: {
    name: "Pflugerville", state: "TX",
    metaTitle: "Pflugerville TX Movers | Moving Company Pflugerville TX | One World Van Lines",
    metaDesc: "Reliable movers in Pflugerville, TX. One World Van Lines — licensed, bonded & insured. Local and long-distance moving in Pflugerville and all of Greater Austin. (660) 667-7770.",
    headline: "Pflugerville TX Moving Company — East Austin Suburb Movers",
    intro: "One World Van Lines serves Pflugerville with professional moving services. Convenient location northeast of Austin with growing master-planned communities.",
    body: [
      "Pflugerville has grown dramatically in recent years, attracting families and tech workers with its affordable homes and excellent schools.",
    ],
    nearbyAreas: ["Round Rock", "Austin", "Cedar Park", "Georgetown", "Hutto"],
    services: ["Local Pflugerville moves", "DFW-to-Pflugerville long-distance", "New subdivision move-ins", "Apartment moves"],
  },
  georgetown: {
    name: "Georgetown", state: "TX",
    metaTitle: "Georgetown TX Movers | Moving Company Georgetown TX | One World Van Lines",
    metaDesc: "Professional movers in Georgetown, TX — historic square & Sun City. One World Van Lines: licensed, bonded & insured. (660) 667-7770.",
    headline: "Georgetown TX Moving Company — Historic Square to Sun City",
    intro: "One World Van Lines serves all of Georgetown — from the historic courthouse square to Sun City Texas and the growing northern communities near I-35.",
    body: [
      "Georgetown is consistently ranked among the fastest-growing cities in the US. Its mix of historic homes, Sun City retiree community, and new developments keeps our crews busy.",
    ],
    nearbyAreas: ["Round Rock", "Cedar Park", "Leander", "Austin", "Jarrell"],
    services: ["Local Georgetown moves", "Sun City retirement moves", "New build move-ins", "DFW-to-Georgetown long-distance"],
  },
  kyle: {
    name: "Kyle", state: "TX",
    metaTitle: "Kyle TX Movers | Moving Company Kyle TX | One World Van Lines",
    metaDesc: "Trusted movers in Kyle, TX. One World Van Lines — licensed, bonded & insured. Local and long-distance moving in Kyle and all of Hays County. (660) 667-7770.",
    headline: "Kyle TX Moving Company — South Austin Suburb Movers",
    intro: "One World Van Lines serves Kyle and the entire south Austin corridor. Rapid growth south of Austin along I-35 makes Kyle one of our busiest Greater Austin destinations.",
    body: [
      "Kyle has grown from a small town to one of Texas's top ten fastest-growing cities. New subdivisions and apartment communities attract buyers from across the state.",
    ],
    nearbyAreas: ["Buda", "Austin", "San Marcos", "Wimberley", "Hays"],
    services: ["Local Kyle moves", "New subdivision move-ins", "DFW-to-Kyle long-distance", "Apartment moves"],
  },
  buda: {
    name: "Buda", state: "TX",
    metaTitle: "Buda TX Movers | Moving Company Buda TX | One World Van Lines",
    metaDesc: "Reliable movers in Buda, TX. One World Van Lines — licensed, bonded & insured. Local and long-distance moving in Buda and Hays County. Free estimate. (660) 667-7770.",
    headline: "Buda TX Moving Company — Hays County Movers",
    intro: "One World Van Lines serves Buda and all of Hays County. Just south of Austin on I-35, Buda has become one of the fastest-growing communities in Central Texas.",
    body: [
      "Buda's small-town feel and proximity to Austin make it a top destination for families relocating from across Texas.",
    ],
    nearbyAreas: ["Kyle", "Austin", "San Marcos", "Wimberley"],
    services: ["Local Buda moves", "DFW-to-Buda long-distance", "New home move-ins", "Apartment moves"],
  },
  leander: {
    name: "Leander", state: "TX",
    metaTitle: "Leander TX Movers | Moving Company Leander TX | One World Van Lines",
    metaDesc: "Professional movers in Leander, TX. One World Van Lines — licensed, bonded & insured. Local and long-distance moving throughout Leander and northwest Austin. (660) 667-7770.",
    headline: "Leander TX Moving Company — Northwest Austin Growth Corridor",
    intro: "One World Van Lines serves Leander and the northwest Austin growth corridor. One of the fastest-growing cities in Texas, Leander sees constant moving demand from new residents.",
    body: [
      "Leander's booming residential development along the Toll 183A corridor has made it a major destination for families relocating from DFW and beyond.",
    ],
    nearbyAreas: ["Cedar Park", "Round Rock", "Georgetown", "Austin"],
    services: ["Local Leander moves", "DFW-to-Leander long-distance", "New construction move-ins", "Apartment moves"],
  },
};

const schema = z.object({
  fullName: z.string().min(2, "Name required"),
  phone: z.string().min(10, "Phone required"),
  email: z.string().email("Valid email required"),
  moveDate: z.string().min(1, "Date required"),
  bedroomCount: z.coerce.number().min(0).max(10),
  moveType: z.string().min(1, "Type required"),
});

export default function CityLanding() {
  const { city: citySlug } = useParams<{ city: string }>();
  const city = cityData[citySlug ?? ""] ?? cityData.carrollton;
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const createLead = useCreateLead();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", phone: "", email: "", moveDate: "", bedroomCount: 2, moveType: "residential" },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    createLead.mutate({ data: { ...values, moveFromAddress: city.name + ", TX", source: "website_form" } }, {
      onSuccess: () => { setSubmitted(true); toast({ title: "Request received!", description: "We'll call you within 1 hour." }); },
      onError: () => toast({ title: "Error", description: "Please call us at (660) 667-7770.", variant: "destructive" }),
    });
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    "name": "One World Van Lines",
    "url": `https://oneworldvanlines.net/locations/${citySlug}`,
    "telephone": "+1-660-667-7770",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2305 Belt Line Rd, Suite 120B",
      "addressLocality": "Carrollton",
      "addressRegion": "TX",
      "postalCode": "75006",
      "addressCountry": "US"
    },
    "areaServed": `${city.name}, TX`,
    "description": city.intro,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "ratingCount": "5430"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://oneworldvanlines.net/" },
      { "@type": "ListItem", "position": 2, "name": "Service Areas", "item": "https://oneworldvanlines.net/areas" },
      { "@type": "ListItem", "position": 3, "name": `Movers in ${city.name}, TX`, "item": `https://oneworldvanlines.net/locations/${citySlug}` }
    ]
  };

  return (
    <PublicLayout>
      <SeoHead
        title={city.metaTitle}
        description={city.metaDesc}
        canonical={`/locations/${citySlug}`}
        schema={[structuredData, breadcrumbSchema, ...(city.faqs && city.faqs.length > 0 ? [{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": city.faqs.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }))
        }] : [])]}
      />

      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-secondary" />
              <span className="text-sm text-secondary font-medium">{city.name}, TX</span>
              {city.isHQ && <span className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded font-bold">Our HQ</span>}
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{city.headline}</h1>
            <p className="text-primary-foreground/70 text-lg leading-relaxed mb-6">{city.intro}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
              {["Licensed, Bonded & Insured", "No Hidden Fees", "1-Hour Response", "Direct Carrier"].map(badge => (
                <div key={badge} className="flex items-center gap-1.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-secondary" /> {badge}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />)}</div>
              <span className="text-sm text-primary-foreground/70">4.9/5 · 5,430+ moves completed</span>
            </div>
          </motion.div>

          {/* Quote Form */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-background text-foreground rounded-xl p-6 shadow-2xl">
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-xl font-serif font-bold mb-2">Request Received</h3>
                <p className="text-muted-foreground text-sm">A coordinator will call you within 1 hour (7am–8pm CST).</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-serif font-bold mb-1">Free {city.name} Moving Quote</h3>
                <p className="text-sm text-muted-foreground mb-4">We respond within 1 hour · No obligation</p>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <FormField control={form.control} name="bedroomCount" render={({ field }) => (
                        <FormItem><FormLabel>Bedrooms</FormLabel>
                          <Select onValueChange={(v) => field.onChange(Number(v))} defaultValue={String(field.value)}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>{[0,1,2,3,4,5].map(n => <SelectItem key={n} value={String(n)}>{n === 0 ? "Studio" : `${n} BR`}</SelectItem>)}</SelectContent>
                          </Select><FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="moveType" render={({ field }) => (
                        <FormItem><FormLabel>Move Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="residential">Home</SelectItem>
                              <SelectItem value="apartment">Apartment</SelectItem>
                              <SelectItem value="commercial">Office</SelectItem>
                            </SelectContent>
                          </Select><FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <Button type="submit" className="w-full" disabled={createLead.isPending}>
                      {createLead.isPending ? "Submitting..." : `Get My ${city.name} Moving Quote`}
                    </Button>
                  </form>
                </Form>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-serif font-bold mb-6">Moving in {city.name}, TX</h2>
            {city.body.map((para, i) => <p key={i} className="text-muted-foreground leading-relaxed mb-4">{para}</p>)}

            {/* Neighborhood-level content — key differentiator vs competitors */}
            {city.neighborhoods && city.neighborhoods.length > 0 && (
              <div className="mt-10">
                <h3 className="text-2xl font-serif font-bold mb-2">Neighborhoods We Move in {city.name}</h3>
                <p className="text-muted-foreground mb-6">We don't just know {city.name} — we know your block.</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {city.neighborhoods.map(n => (
                    <div key={n.name} className="bg-muted/30 border border-border rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-primary shrink-0" />
                        <span className="font-semibold text-sm">{n.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{n.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h3 className="text-2xl font-serif font-bold mt-10 mb-4">Services We Provide in {city.name}</h3>
            <div className="space-y-2">
              {city.services.map(service => (
                <div key={service} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{service}</span>
                </div>
              ))}
            </div>

            {city.zipCodes && city.zipCodes.length > 0 && (
              <div className="mt-8 bg-muted/40 rounded-xl p-5">
                <h4 className="font-medium mb-2">ZIP Codes Served in {city.name}</h4>
                <div className="flex flex-wrap gap-2">
                  {city.zipCodes.map(zip => <span key={zip} className="text-sm bg-background border border-border px-3 py-1 rounded">{zip}</span>)}
                </div>
              </div>
            )}

            {/* FAQ section for AIO / AI search */}
            {city.faqs && city.faqs.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-serif font-bold mb-6">{city.name} Moving FAQ</h3>
                <div className="space-y-4">
                  {city.faqs.map((faq, i) => (
                    <div key={i} className="border border-border rounded-xl p-5">
                      <h4 className="font-semibold mb-2">{faq.q}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-secondary/30 rounded-xl p-6 mb-6">
              <h4 className="font-serif font-bold text-lg mb-4">Contact Us</h4>
              <a href="tel:6606677770" className="flex items-center gap-2 text-foreground font-medium mb-3 hover:text-primary">
                <Phone className="w-5 h-5 text-primary" /> (660) 667-7770
              </a>
              <a href="https://wa.me/16606677770" className="flex items-center gap-2 text-foreground font-medium mb-3 hover:text-primary">
                <Truck className="w-5 h-5 text-primary" /> WhatsApp Us
              </a>
              <Link href="/calculator">
                <button className="w-full flex items-center justify-center gap-2 mt-2 px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Open Calculator <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            {/* Trust signals */}
            <div className="border border-border rounded-xl p-5 mb-6">
              <h4 className="font-serif font-bold text-base mb-4">Why One World Van Lines?</h4>
              <div className="space-y-3 text-sm">
                {[
                  { icon: Shield, text: "Licensed, Bonded & Insured in TX" },
                  { icon: CheckCircle2, text: "No hidden fees — ever" },
                  { icon: Award, text: "4.9★ · 5,430+ moves completed" },
                  { icon: Truck, text: "Direct carrier — not a broker" },
                  { icon: Phone, text: "1-hour response, 7am–8pm daily" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-muted-foreground">
                    <Icon className="w-4 h-4 text-primary shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-border rounded-xl p-6 mb-6">
              <h4 className="font-serif font-bold text-lg mb-3">Nearby Areas</h4>
              <div className="space-y-1">
                {city.nearbyAreas.map(area => (
                  <div key={area} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                    {area}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary text-primary-foreground rounded-xl p-5 text-center">
              <div className="flex justify-center gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />)}
              </div>
              <p className="font-semibold text-sm mb-1">4.9 / 5.0 Rating</p>
              <p className="text-xs text-primary-foreground/70">Based on 5,430+ completed moves across DFW and Austin</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA bar */}
      <section className="bg-secondary/20 border-t border-border py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-serif font-bold mb-2">Ready to move in {city.name}?</h2>
          <p className="text-muted-foreground mb-6">Call now or get a free estimate online. We respond within 1 hour.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:6606677770" className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-primary text-primary-foreground rounded font-semibold hover:bg-primary/90 transition-colors">
              <Phone className="w-4 h-4" /> (660) 667-7770
            </a>
            <Link href="/calculator">
              <button className="inline-flex items-center justify-center gap-2 px-7 py-3 border-2 border-primary text-primary rounded font-semibold hover:bg-primary/5 transition-colors">
                Free Online Estimate <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
