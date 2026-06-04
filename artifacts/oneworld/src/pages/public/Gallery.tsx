import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";

const photos = [
  {
    src: "/gallery/one-world-van-lines-moving-truck-dallas-tx.webp",
    alt: "One World Van Lines branded moving truck parked at a luxury home in Dallas, TX",
    label: "Branded Moving Truck — Dallas, TX",
    category: "Our Fleet",
  },
  {
    src: "/gallery/professional-furniture-wrapping-dfw-movers.jpg",
    alt: "Professional furniture wrapping with moving blankets — DFW movers protecting items",
    label: "Furniture Wrapping — DFW",
    category: "Packing",
  },
  {
    src: "/gallery/careful-packing-services-dallas-fort-worth.jpg",
    alt: "Careful packing services with paper-wrapped fragile items — Dallas–Fort Worth movers",
    label: "Careful Packing — Dallas–Fort Worth",
    category: "Packing",
  },
  {
    src: "/gallery/padded-furniture-protection-carrollton-tx-movers.jpg",
    alt: "Padded and strapped furniture protection ready for transport — Carrollton, TX movers",
    label: "Padded Protection — Carrollton, TX",
    category: "Packing",
  },
  {
    src: "/gallery/moving-truck-loaded-dfw-professional-movers.jpg",
    alt: "Moving truck fully loaded with blanket-wrapped furniture — DFW professional movers",
    label: "Truck Loaded & Secured — DFW",
    category: "Our Fleet",
  },
  {
    src: "/gallery/piano-moving-dallas-tx-specialty-movers.jpg",
    alt: "Grand piano wrapped and secured for specialty moving service — Dallas, TX",
    label: "Piano Moving — Dallas, TX",
    category: "Specialty",
  },
  {
    src: "/gallery/floor-protection-home-moving-dallas-fort-worth.jpg",
    alt: "Floor and door-frame protection during a residential move — Dallas–Fort Worth",
    label: "Floor Protection — Dallas–Fort Worth",
    category: "Residential",
  },
  {
    src: "/gallery/wrapped-sofa-moving-service-dfw-texas.jpg",
    alt: "Sofas wrapped in plastic and moving blankets on driveway — DFW moving service",
    label: "Wrapped Sofas — DFW, Texas",
    category: "Packing",
  },
  {
    src: "/gallery/fragile-items-packing-glass-protection-dallas-movers.jpg",
    alt: "Fragile glass item labelled and wrapped with protective materials — Dallas movers",
    label: "Fragile Item Packing — Dallas",
    category: "Packing",
  },
  {
    src: "/gallery/full-home-move-boxes-furniture-carrollton-tx.jpg",
    alt: "Full home move with boxes and furniture organized in new room — Carrollton, TX",
    label: "Full Home Move — Carrollton, TX",
    category: "Residential",
  },
  {
    src: "/gallery/packed-moving-truck-household-goods-dfw.jpg",
    alt: "Packed moving truck interior stacked with household goods — DFW movers",
    label: "Packed Truck — DFW Household Move",
    category: "Our Fleet",
  },
  {
    src: "/gallery/large-moving-truck-interior-long-distance-texas.jpg",
    alt: "Interior of large moving truck ready for long-distance move across Texas",
    label: "Long-Distance Truck — Texas",
    category: "Our Fleet",
  },
  {
    src: "/gallery/one-world-van-lines-austin-tx-moving-company.jpg",
    alt: "One World Van Lines moving truck in Austin, TX — seamless relocation services",
    label: "One World Van Lines — Austin, TX",
    category: "Our Fleet",
  },
  {
    src: "/gallery/secure-storage-units-dallas-fort-worth-movers.jpg",
    alt: "Secure storage vault unit with wardrobe boxes — Dallas–Fort Worth storage movers",
    label: "Secure Storage — Dallas–Fort Worth",
    category: "Storage",
  },
  {
    src: "/gallery/climate-controlled-storage-carrollton-tx-warehouse.jpg",
    alt: "Rows of wooden vault storage crates in climate-controlled warehouse — Carrollton, TX",
    label: "Vault Storage Warehouse — Carrollton",
    category: "Storage",
  },
  {
    src: "/gallery/vault-storage-dfw-moving-company-carrollton.jpg",
    alt: "Stacked wooden storage vaults labeled for customers — DFW moving company Carrollton",
    label: "Vault Crates — Carrollton, TX",
    category: "Storage",
  },
  {
    src: "/gallery/fully-packed-moving-truck-dallas-residential-movers.jpg",
    alt: "Moving truck fully packed with labeled boxes floor to ceiling — Dallas residential movers",
    label: "Fully Packed Truck — Dallas",
    category: "Our Fleet",
  },
  {
    src: "/gallery/moving-truck-fleet-one-world-van-lines-texas.jpg",
    alt: "Fleet of One World Van Lines moving trucks lined up at yard — Texas",
    label: "Our Fleet — One World Van Lines",
    category: "Our Fleet",
  },
  {
    src: "/gallery/long-distance-moving-truck-dfw-to-austin.jpg",
    alt: "Large moving truck ready for long-distance relocation from DFW to Austin, TX",
    label: "Long-Distance Truck — DFW to Austin",
    category: "Our Fleet",
  },
  {
    src: "/gallery/truck-loaded-kitchen-boxes-fragile-dishpack-dfw-residential-movers.jpg",
    alt: "Moving truck packed with labeled kitchen boxes and fragile dish-pack boxes — DFW residential movers",
    label: "Kitchen Boxes & Dish Pack — DFW",
    category: "Packing",
  },
  {
    src: "/gallery/blue-blanket-wrapped-furniture-tight-truck-loading-dallas-texas.jpg",
    alt: "Tight truck loading with blue moving-blanket-wrapped furniture and plastic-covered mattresses — Dallas, TX",
    label: "Blanket-Wrapped Furniture Load — Dallas",
    category: "Our Fleet",
  },
  {
    src: "/gallery/mattress-furniture-blue-moving-blankets-truck-carrollton-tx-movers.jpg",
    alt: "Mattresses and furniture fully covered in blue moving blankets inside truck — Carrollton, TX movers",
    label: "Blue Blanket Protection — Carrollton, TX",
    category: "Our Fleet",
  },
  {
    src: "/gallery/fully-loaded-moving-truck-blue-blankets-secured-household-goods-dfw.jpg",
    alt: "Moving truck interior fully loaded wall-to-wall with blue blanket-wrapped household goods — DFW",
    label: "Fully Secured Load — DFW Household Move",
    category: "Our Fleet",
  },
  {
    src: "/gallery/residential-move-dishpack-stacked-boxes-moving-truck-dallas-tx.jpg",
    alt: "Dish-pack and fragile boxes stacked in moving truck at a residential home — Dallas, TX",
    label: "Residential Dish Pack — Dallas, TX",
    category: "Residential",
  },
  {
    src: "/gallery/moving-truck-interior-ramp-dolly-blankets-ready-dfw-texas.jpg",
    alt: "Moving truck interior showing ramp, dolly, and stacked blue moving blankets ready for a job — DFW, Texas",
    label: "Truck Ready — Ramp & Equipment, DFW",
    category: "Our Fleet",
  },
  {
    src: "/gallery/furniture-wrapped-blue-blankets-in-home-protection-dallas-fort-worth.jpg",
    alt: "Large furniture pieces wrapped in blue moving blankets inside a home before transport — Dallas–Fort Worth",
    label: "In-Home Furniture Wrap — DFW",
    category: "Packing",
  },
  {
    src: "/gallery/packed-moving-truck-blankets-boxes-dolly-dfw-professional-movers.jpg",
    alt: "Packed moving truck interior with blue blankets, labeled boxes, and hand truck dolly — DFW professional movers",
    label: "Packed Truck With Equipment — DFW",
    category: "Our Fleet",
  },
  {
    src: "/gallery/organized-truck-loading-mixed-household-moving-company-texas.jpg",
    alt: "Organized truck loading with mixed household items, blue blankets, and boxes — Texas moving company",
    label: "Organized Load — Texas Move",
    category: "Our Fleet",
  },
  {
    src: "/gallery/professional-truck-loading-boxes-blankets-hardwood-floor-carrollton-tx.jpg",
    alt: "Professional truck loading with boxes and blanket-wrapped items on hardwood truck floor — Carrollton, TX",
    label: "Professional Load — Carrollton, TX",
    category: "Our Fleet",
  },
  {
    src: "/gallery/plastic-wrapped-sofas-couch-driveway-furniture-protection-dfw-movers.jpg",
    alt: "Two sofas wrapped in plastic and moving blankets on a residential driveway — DFW furniture protection",
    label: "Wrapped Sofas on Driveway — DFW",
    category: "Packing",
  },
  // ── New real customer photos ──
  {
    src: "/gallery/oneworld-van-lines-packed-moving-truck-furniture-protection-dallas-tx.jpeg",
    alt: "One World Van Lines moving truck packed floor-to-ceiling with blue moving pads and plastic-wrapped mattresses — Dallas, TX residential movers",
    label: "Packed Truck — Dallas, TX Home Move",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-kitchen-boxes-fragile-dishpack-moving-truck-dfw-texas.jpg",
    alt: "Labeled kitchen and fragile dish-pack boxes loaded in moving truck — One World Van Lines DFW Texas professional movers",
    label: "Kitchen & Fragile Pack — DFW, Texas",
    category: "Packing",
  },
  {
    src: "/gallery/oneworld-van-lines-long-distance-move-large-boxes-blue-blankets-truck-texas.jpg",
    alt: "Large moving boxes and blue blanket-wrapped furniture loaded in truck for long-distance move — One World Van Lines Texas",
    label: "Long-Distance Load — Texas",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-branded-boxes-professional-moving-company-dallas-tx.webp",
    alt: "One World Van Lines branded moving boxes and plastic-wrapped chair loaded in truck — professional moving company Dallas, TX",
    label: "Branded Move — Dallas, TX",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-specialty-sports-equipment-moving-kayak-paddleboard-dfw-tx.jpeg",
    alt: "Kayaks, paddleboards, and specialty outdoor equipment secured in moving truck — One World Van Lines specialty movers DFW, TX",
    label: "Specialty Sports Equipment — DFW, TX",
    category: "Specialty",
  },
  {
    src: "/gallery/oneworld-van-lines-aerial-view-blue-wrapped-furniture-moving-truck-carrollton-tx.jpg",
    alt: "Aerial view of moving truck interior showing blue plastic-wrapped furniture and strapped items — One World Van Lines Carrollton, TX",
    label: "Aerial Truck View — Carrollton, TX",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-long-distance-professional-movers-dfw-austin-texas.webp",
    alt: "One World Van Lines long distance professional movers — serving Dallas–Fort Worth and Austin, Texas (660) 667-7770",
    label: "Long-Distance Movers — DFW & Austin",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-wooden-storage-crate-household-goods-carrollton-tx.jpeg",
    alt: "Wooden storage vault crate packed with household goods, boxes, and moving blankets — One World Van Lines storage Carrollton, TX",
    label: "Storage Vault — Carrollton, TX",
    category: "Storage",
  },
  {
    src: "/gallery/oneworld-van-lines-blue-blanket-wrapped-furniture-secured-truck-dallas-tx.jpg",
    alt: "Blue moving blanket-wrapped furniture and mattresses tightly secured with straps in truck — One World Van Lines Dallas, TX",
    label: "Blue-Pad Secured Load — Dallas, TX",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-storage-vault-luggage-belongings-dfw-moving-company.jpeg",
    alt: "Storage vault crate holding luggage, furniture, and household items — One World Van Lines DFW moving and storage company",
    label: "Storage Vault — DFW Moving & Storage",
    category: "Storage",
  },
  {
    src: "/gallery/oneworld-van-lines-fully-loaded-blue-blanket-furniture-truck-dfw-texas.jpg",
    alt: "Moving truck fully loaded wall-to-wall with blue moving blanket-wrapped furniture — One World Van Lines DFW Texas movers",
    label: "Fully Loaded — DFW, Texas",
    category: "Our Fleet",
  },
  // ── Batch 2 real photos ──
  {
    src: "/gallery/oneworld-van-lines-home-depot-boxes-fragile-glass-packed-moving-truck-dallas-fort-worth.jpeg",
    alt: "Home Depot medium boxes and glass-labeled fragile items packed floor to ceiling in moving truck — One World Van Lines Dallas–Fort Worth",
    label: "Fragile & Glass Pack — Dallas–Fort Worth",
    category: "Packing",
  },
  {
    src: "/gallery/oneworld-van-lines-dishpack-fragile-boxes-loaded-residential-move-dfw-metroplex.jpg",
    alt: "Dish-pack and fragile boxes loaded at residential home exterior — One World Van Lines DFW Metroplex professional movers",
    label: "Dish-Pack Load — DFW Metroplex",
    category: "Residential",
  },
  {
    src: "/gallery/oneworld-van-lines-professional-dish-paper-wrap-fragile-packing-dallas-tx.jpeg",
    alt: "Paper-wrapped dishes and glassware neatly packed inside cardboard box — One World Van Lines professional fragile packing service Dallas, TX",
    label: "Professional Dish Wrap — Dallas, TX",
    category: "Packing",
  },
  {
    src: "/gallery/oneworld-van-lines-moving-truck-ready-dolly-ramp-blue-blankets-carrollton-tx.jpg",
    alt: "Large moving truck interior with ramp deployed, hand-truck dolly, and stacked blue moving blankets ready for a job — One World Van Lines Carrollton, TX",
    label: "Truck Ready — Carrollton, TX",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-branded-moving-box-professional-packing-service-dfw-texas.webp",
    alt: "One World Van Lines branded moving box in warehouse setting — professional packing service Dallas–Fort Worth Texas",
    label: "Branded Moving Box — DFW, Texas",
    category: "Packing",
  },
  {
    src: "/gallery/oneworld-van-lines-plastic-storage-bins-organized-truck-interior-greater-dfw-tx.jpeg",
    alt: "Organized clear plastic storage bins and household items stacked in moving truck — One World Van Lines Greater DFW TX movers",
    label: "Organized Bins — Greater DFW, TX",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-blue-blanket-wrapped-furniture-in-home-ready-austin-tx-movers.jpg",
    alt: "Blue moving blanket-wrapped and taped furniture staged inside home ready for transport — One World Van Lines Austin, TX movers",
    label: "In-Home Furniture Ready — Austin, TX",
    category: "Packing",
  },
  {
    src: "/gallery/oneworld-van-lines-moving-truck-labeled-boxes-dfw-to-austin-texas-relocation.webp",
    alt: "One World Van Lines moving truck on road with labeled living room and fragile boxes — DFW to Austin Texas relocation service",
    label: "DFW to Austin Relocation",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-organized-box-loading-moving-truck-home-depot-boxes-plano-tx.jpeg",
    alt: "Organized Home Depot large and medium boxes neatly loaded in moving truck — One World Van Lines professional movers Plano, TX DFW",
    label: "Organized Box Load — Plano, TX",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-fully-packed-truck-blankets-plastic-wrap-boxes-dallas-tx.jpg",
    alt: "Fully packed moving truck with blue blankets, plastic-wrapped items, and stacked boxes — One World Van Lines Dallas, TX residential move",
    label: "Fully Packed Truck — Dallas, TX",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-long-distance-movers-dfw-austin-tx-seamless-relocation-branding.webp",
    alt: "One World Van Lines long distance professional movers branding — seamless relocation DFW and Greater Austin TX (660) 667-7770 oneworldvanlines.net",
    label: "Long-Distance Movers — DFW & Austin",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-mixed-boxes-blankets-loading-moving-truck-garland-tx-dfw.jpeg",
    alt: "Mixed Home Depot boxes and blue moving blankets being loaded into moving truck — One World Van Lines Garland, TX DFW Metroplex movers",
    label: "Mixed Load — Garland, TX DFW",
    category: "Our Fleet",
  },
  // ── Batch 3 real photos ──
  {
    src: "/gallery/oneworld-van-lines-blanket-plastic-wrap-fully-packed-truck-irving-tx-dfw-movers.jpg",
    alt: "Fully packed moving truck interior with blue blanket-wrapped frames, plastic-wrapped furniture and secured boxes — One World Van Lines Irving, TX DFW movers",
    label: "Fully Packed — Irving, TX DFW",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-long-distance-professional-movers-business-card-dfw-texas-660-667-7770.webp",
    alt: "One World Van Lines business card — Long Distance Professional Movers Dallas–Fort Worth Texas, (660) 667-7770, oneworldvanlines.net",
    label: "Long Distance Movers — DFW, Texas",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-home-depot-wardrobe-boxes-loaded-moving-truck-richardson-tx-dfw.jpeg",
    alt: "Home Depot medium boxes and tall wardrobe boxes partially loaded in moving truck — One World Van Lines Richardson, TX DFW professional movers",
    label: "Wardrobe & Box Load — Richardson, TX",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-blanket-wrapped-mattress-furniture-packed-truck-frisco-tx-dfw-metroplex.jpg",
    alt: "Moving truck packed wall-to-wall with blue blanket-wrapped mattresses, furniture, rolled rugs and sports items — One World Van Lines Frisco, TX DFW Metroplex",
    label: "Wall-to-Wall Pack — Frisco, TX DFW",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-branded-vehicle-decal-long-distance-movers-dfw-texas-660-667-7770.webp",
    alt: "One World Van Lines branded vehicle window decal — Long Distance Professional Movers DFW Texas, (660) 667-7770, oneworldvanlines.net",
    label: "Branded Fleet Vehicle — DFW, Texas",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-partial-load-boxes-blankets-moving-truck-mesquite-tx-dfw-area.jpeg",
    alt: "Partially loaded moving truck with wardrobe boxes, Home Depot medium boxes and blue blankets — One World Van Lines Mesquite, TX DFW area movers",
    label: "Organized Load — Mesquite, TX DFW",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-organized-luggage-plastic-wrap-boxes-moving-truck-mckinney-tx-dfw.jpg",
    alt: "Organized moving truck with suitcases, plastic-wrapped blankets, Amazon and wardrobe boxes with ratchet straps — One World Van Lines McKinney, TX DFW Metroplex",
    label: "Organized Truck — McKinney, TX DFW",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-logo-long-distance-professional-movers-dfw-austin-tx-oneworldvanlines.webp",
    alt: "One World Van Lines logo — Long Distance Professional Movers serving Dallas–Fort Worth and Greater Austin, TX, (660) 667-7770, oneworldvanlines.net",
    label: "Professional Movers — DFW & Austin, TX",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-wardrobe-home-depot-boxes-blankets-truck-lewisville-tx-dfw-metroplex.jpeg",
    alt: "Wardrobe boxes and Home Depot medium boxes with blue and teal blankets loaded in moving truck — One World Van Lines Lewisville, TX DFW Metroplex",
    label: "Wardrobe Load — Lewisville, TX DFW",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-bedroom-furniture-wrapped-protected-ready-move-allen-tx-dfw-movers.jpg",
    alt: "Blue blanket-wrapped dresser, headboard and wardrobe box staged in bedroom ready for pickup — One World Van Lines Allen, TX DFW professional movers",
    label: "Protected Furniture — Allen, TX DFW",
    category: "Residential",
  },
  {
    src: "/gallery/oneworld-van-lines-moving-you-forward-long-distance-professional-movers-dallas-tx.webp",
    alt: "One World Van Lines — Moving You Forward, long distance professional movers serving Dallas–Fort Worth and Greater Austin, TX",
    label: "Moving You Forward — Dallas, TX",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-wardrobe-boxes-blue-blankets-truck-arlington-tx-dfw-professional-movers.jpeg",
    alt: "Wardrobe boxes and blue moving blankets professionally loaded in moving truck — One World Van Lines Arlington, TX DFW professional movers",
    label: "Professional Load — Arlington, TX DFW",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-mixed-household-plastic-bins-packed-truck-fort-worth-tx-dfw-movers.jpg",
    alt: "Moving truck packed to the ceiling with mixed household items, plastic storage bins, Hefty boxes, blue blankets and tools — One World Van Lines Fort Worth, TX DFW movers",
    label: "Full House Move — Fort Worth, TX DFW",
    category: "Our Fleet",
  },
  // ── Batch 4 real photos ──
  {
    src: "/gallery/oneworld-van-lines-home-depot-blue-blanket-boxes-partial-load-truck-north-dallas-tx-dfw.jpeg",
    alt: "Home Depot medium boxes and blue blanket-wrapped furniture partially loaded in moving truck — One World Van Lines North Dallas, TX DFW movers",
    label: "Partial Load — North Dallas, TX DFW",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-labeled-kitchen-bedroom-boxes-ratchet-strap-truck-cedar-hill-tx-dfw.jpg",
    alt: "Labeled Kitchen and bedroom boxes secured with ratchet straps in moving truck — One World Van Lines Cedar Hill, TX DFW professional movers",
    label: "Labeled & Secured — Cedar Hill, TX DFW",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-seamless-relocation-business-card-long-distance-movers-dfw-texas.webp",
    alt: "One World Van Lines business card — Seamless Relocation, Long Distance Professional Movers, (660) 667-7770, oneworldvanlines.net, DFW Texas",
    label: "Seamless Relocation — DFW, Texas",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-paper-wrapped-wardrobe-boxes-truck-euless-tx-dfw-metroplex-movers.jpeg",
    alt: "Paper-wrapped items and wardrobe boxes loaded in moving truck — One World Van Lines Euless, TX DFW Metroplex professional movers",
    label: "Wardrobe Pack — Euless, TX DFW",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-boxes-ceiling-floor-plastic-wrapped-shelving-truck-bedford-tx-dfw.jpg",
    alt: "Cardboard boxes stacked ceiling to floor alongside plastic-wrapped metal shelving unit in moving truck — One World Van Lines Bedford, TX DFW Metroplex",
    label: "Ceiling-to-Floor Load — Bedford, TX DFW",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-bedroom-stacked-wardrobe-boxes-ready-move-day-keller-tx-dfw-movers.jpeg",
    alt: "Bedroom with stacked wardrobe and moving boxes organized and ready for move day — One World Van Lines Keller, TX DFW professional movers",
    label: "Move Day Ready — Keller, TX DFW",
    category: "Residential",
  },
  {
    src: "/gallery/oneworld-van-lines-specialty-clear-bins-wooden-crate-mixed-packed-truck-grapevine-tx-dfw.jpg",
    alt: "Moving truck packed with clear plastic bins, wooden crate, blue bags and specialty items secured with straps — One World Van Lines Grapevine, TX DFW",
    label: "Specialty Move — Grapevine, TX DFW",
    category: "Specialty",
  },
  {
    src: "/gallery/oneworld-van-lines-blue-floor-runner-hardwood-protection-move-day-home-southlake-tx-dfw.jpeg",
    alt: "Blue floor runner protecting hardwood floors during move day in residential home hallway — One World Van Lines Southlake, TX DFW professional movers",
    label: "Floor Protection — Southlake, TX DFW",
    category: "Residential",
  },
  {
    src: "/gallery/oneworld-van-lines-empty-moving-truck-interior-ready-load-commercial-move-dfw-texas.jpg",
    alt: "Empty large moving truck interior full-length view ready to load for commercial or residential move — One World Van Lines DFW, Texas",
    label: "Empty Truck Ready — DFW, Texas",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-flat-packed-boxes-bedroom-staging-move-day-flower-mound-tx-dfw.jpeg",
    alt: "Flat-packed moving boxes staged along bedroom wall with cabinet ready for move day — One World Van Lines Flower Mound, TX DFW movers",
    label: "Staged Bedroom — Flower Mound, TX DFW",
    category: "Residential",
  },
  {
    src: "/gallery/oneworld-van-lines-large-fragile-labeled-home-depot-boxes-loaded-truck-mansfield-tx-dfw.jpg",
    alt: "Large fragile-labeled Home Depot boxes, Amazon box and blue blanket-wrapped mattress loaded in truck — One World Van Lines Mansfield, TX DFW Metroplex",
    label: "Fragile Labeled Load — Mansfield, TX DFW",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-blue-floor-protection-luxury-home-hardwood-move-day-southlake-tx-dfw.jpeg",
    alt: "Blue floor protection runners covering hardwood floors throughout luxury home hallway during move — One World Van Lines Southlake, TX DFW professional movers",
    label: "Luxury Home Move — Southlake, TX DFW",
    category: "Residential",
  },
  {
    src: "/gallery/oneworld-van-lines-wardrobe-handle-care-boxes-plastic-wrap-truck-waxahachie-tx-dfw.jpg",
    alt: "Wardrobe Handle-With-Care boxes and plastic-wrapped flat items loaded in moving truck — One World Van Lines Waxahachie, TX DFW area movers",
    label: "Wardrobe Load — Waxahachie, TX DFW",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-wrapped-furniture-staged-basement-room-move-day-prosper-tx-dfw.jpeg",
    alt: "Blue blanket-wrapped furniture pieces and packed boxes staged in basement recreation room before move — One World Van Lines Prosper, TX DFW Metroplex",
    label: "Basement Stage — Prosper, TX DFW",
    category: "Residential",
  },
  {
    src: "/gallery/oneworld-van-lines-storage-totes-tv-box-packing-kit-boxes-move-celina-tx-dfw-movers.jpg",
    alt: "Stacked black and red Sterilite storage totes, large boxes and TV expandable packing kit organized for move — One World Van Lines Celina, TX DFW movers",
    label: "Storage & TV Pack — Celina, TX DFW",
    category: "Storage",
  },
  {
    src: "/gallery/oneworld-van-lines-bedroom-staging-blue-blanket-bed-rolled-rugs-boxes-wylie-tx-dfw.jpeg",
    alt: "Bedroom with blue blanket-wrapped bed frame, rolled rugs, crated item and boxes staged for move day — One World Van Lines Wylie, TX DFW professional movers",
    label: "Bedroom Stage — Wylie, TX DFW",
    category: "Residential",
  },
  {
    src: "/gallery/oneworld-van-lines-wrapped-glass-table-boxes-finished-basement-move-rowlett-tx-dfw.jpeg",
    alt: "Wrapped round glass table top, stacked boxes and blanket-wrapped items in finished basement near staircase — One World Van Lines Rowlett, TX DFW movers",
    label: "Finished Basement — Rowlett, TX DFW",
    category: "Residential",
  },
  {
    src: "/gallery/oneworld-van-lines-dish-pack-fragile-kraft-wrapped-truck-loading-cedar-park-austin-tx.jpeg",
    alt: "Dish-pack fragile boxes and kraft paper-wrapped specialty items loaded in moving truck at sunny suburban home — One World Van Lines Cedar Park, Greater Austin TX",
    label: "Dish-Pack Load — Cedar Park, Austin TX",
    category: "Packing",
  },
  // ── Batch 5 real photos ──
  {
    src: "/gallery/oneworld-van-lines-dish-pack-fragile-kraft-wrapped-truck-suburban-home-pflugerville-austin-tx.jpeg",
    alt: "Dish-pack fragile boxes and kraft paper-wrapped specialty items in truck at sunny suburban home — One World Van Lines Pflugerville, Greater Austin TX movers",
    label: "Dish-Pack Load — Pflugerville, Austin TX",
    category: "Packing",
  },
  {
    src: "/gallery/oneworld-van-lines-uhaul-home-depot-colored-tubs-plastic-wrap-packed-truck-hurst-tx-dfw.jpeg",
    alt: "U-Haul large boxes, Home Depot box, colorful plastic tubs and plastic-wrapped mattress packed in moving truck — One World Van Lines Hurst, TX DFW Metroplex movers",
    label: "Mixed Tubs & Boxes — Hurst, TX DFW",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-long-distance-movers-branded-globe-trucks-logo-dfw-texas-660-667-7770.jpg",
    alt: "One World Van Lines Long Distance Professional Movers branded logo with two trucks and globe — DFW Texas, (660) 667-7770, oneworldvanlines.net",
    label: "Long Distance Movers Logo — DFW, TX",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-uhaul-boxes-plastic-wrapped-dresser-furniture-truck-haltom-city-tx-dfw.jpeg",
    alt: "U-Haul boxes and plastic-wrapped dresser furniture secured in moving truck — One World Van Lines Haltom City, TX DFW Metroplex professional movers",
    label: "U-Haul & Wrapped Dresser — Haltom City, TX",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-plastic-wrapped-mattress-blanket-furniture-wooden-door-truck-grand-prairie-tx-dfw.jpeg",
    alt: "Plastic-wrapped mattresses, blue blanket-wrapped furniture and wooden door panel packed in moving truck — One World Van Lines Grand Prairie, TX DFW movers",
    label: "Full Wrap Pack — Grand Prairie, TX DFW",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-kids-bikes-strollers-toys-boxes-truck-round-rock-austin-tx-family-move.jpeg",
    alt: "Moving truck loaded with kids bikes, strollers, toys and household boxes for a family move — One World Van Lines Round Rock, Greater Austin TX professional movers",
    label: "Family Move — Round Rock, Austin TX",
    category: "Residential",
  },
  {
    src: "/gallery/oneworld-van-lines-dark-logo-globe-dual-trucks-long-distance-movers-dfw-texas-oneworldvanlines.jpg",
    alt: "One World Van Lines dark background logo with dual trucks and globe — Long Distance Professional Movers DFW Texas, (660) 667-7770, oneworldvanlines.net",
    label: "Long Distance Logo — DFW & Austin, TX",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-hino-white-box-truck-residential-street-carrollton-tx-dfw-on-location.jpeg",
    alt: "One World Van Lines white Hino box truck on residential street on location for a move — Carrollton, TX DFW Metroplex professional movers",
    label: "On-Location Truck — Carrollton, TX DFW",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-patio-outdoor-furniture-wicker-cooler-specialty-truck-kyle-tx-greater-austin.jpeg",
    alt: "Moving truck packed with patio wicker furniture sets, cooler, outdoor rugs and specialty items — One World Van Lines Kyle, TX Greater Austin professional movers",
    label: "Patio Specialty Move — Kyle, TX Austin",
    category: "Specialty",
  },
  {
    src: "/gallery/oneworld-van-lines-nationwide-long-distance-movers-round-logo-dfw-austin-texas-oneworldvanlines.jpg",
    alt: "One World Van Lines round logo — Nationwide Long Distance Professional Movers serving DFW and Greater Austin Texas, oneworldvanlines.net",
    label: "Nationwide Movers — DFW & Austin, TX",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-wardrobe-boxes-plastic-wrapped-panels-truck-cedar-park-austin-tx-movers.jpeg",
    alt: "Wardrobe Handle-With-Care boxes and plastic-wrapped flat panels loaded in moving truck at palm-tree suburban home — One World Van Lines Cedar Park, Austin TX movers",
    label: "Wardrobe Load — Cedar Park, Austin TX",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-wall-to-wall-blanket-wrapped-furniture-bungee-truck-round-rock-austin-tx.jpeg",
    alt: "Moving truck packed wall-to-wall with blue blanket-wrapped furniture secured with bungee cords at suburban neighborhood — One World Van Lines Round Rock, Austin TX",
    label: "Wall-to-Wall Wrap — Round Rock, Austin TX",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-plastic-wrapped-furniture-luggage-suitcases-truck-leander-tx-greater-austin.jpeg",
    alt: "Moving truck rear with plastic-wrapped furniture, blue blanket-wrapped items, luggage and suitcases — One World Van Lines Leander, TX Greater Austin movers",
    label: "Full Load — Leander, TX Greater Austin",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-kayak-seasonal-labeled-boxes-specialty-truck-georgetown-tx-greater-austin.jpeg",
    alt: "Moving truck loaded with kayak, Autumn and Christmas labeled seasonal boxes, plastic-wrapped flat items and blankets — One World Van Lines Georgetown, TX Greater Austin specialty movers",
    label: "Specialty & Seasonal — Georgetown, TX Austin",
    category: "Specialty",
  },
  {
    src: "/gallery/oneworld-van-lines-truck-ramp-mattress-bags-dolly-ready-load-supplies-pflugerville-tx-austin.jpeg",
    alt: "Large moving truck with ramp deployed, stacked mattress bags, dolly and IPG packing supplies ready to load — One World Van Lines Pflugerville, TX Greater Austin professional movers",
    label: "Truck Ready — Pflugerville, TX Austin",
    category: "Our Fleet",
  },
  // ── Batch 6 real photos ──
  {
    src: "/gallery/oneworld-van-lines-dish-barrel-fragile-boxes-kitchen-staging-blue-carpet-runner-frisco-tx-dfw-movers.jpeg",
    alt: "Full kitchen and dining room staged for move day with dish barrel fragile boxes stacked floor-to-ceiling and blue carpet runner protecting hardwood floors — One World Van Lines Frisco, TX DFW Metroplex professional movers",
    label: "Kitchen Dish Barrel Stage — Frisco, TX DFW",
    category: "Packing",
  },
  {
    src: "/gallery/oneworld-van-lines-labeled-boxes-blanket-wrapped-furniture-straps-full-truck-north-richland-hills-tx-dfw.jpeg",
    alt: "Moving truck interior fully loaded with hand-labeled boxes, blue blanket-wrapped furniture and bungee straps — One World Van Lines North Richland Hills, TX DFW Metroplex movers",
    label: "Full Labeled Load — North Richland Hills, TX",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-home-depot-boxes-blue-blanket-furniture-full-truck-burleson-tx-dfw-movers.jpeg",
    alt: "Full moving truck with Home Depot boxes, blue blanket-wrapped furniture, plastic tubs and ratchet straps — One World Van Lines Burleson, TX DFW professional movers",
    label: "Full Home Depot Load — Burleson, TX DFW",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-blue-blanket-wrapped-furniture-stacked-boxes-truck-interior-denton-tx-dfw-movers.jpeg",
    alt: "Moving truck interior showing blue blanket-wrapped furniture and stacked household boxes secured with straps — One World Van Lines Denton, TX DFW Metroplex professional movers",
    label: "Blanket Wrap Stack — Denton, TX DFW",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-wall-to-wall-labeled-boxes-blue-blanket-floor-truck-sachse-tx-dfw-metroplex.jpeg",
    alt: "Moving truck packed wall-to-wall with hand-labeled cardboard boxes and blue blanket-padded floor — One World Van Lines Sachse, TX DFW Metroplex professional movers",
    label: "Wall-to-Wall Boxes — Sachse, TX DFW",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-lowes-welcome-home-boxes-rolled-rugs-blanket-wrapped-truck-little-elm-tx-dfw.jpg",
    alt: "Moving truck loaded with Lowe's Welcome Home boxes, rolled area rugs, navy blanket-wrapped furniture and red bucket — One World Van Lines Little Elm, TX DFW Metroplex movers",
    label: "Lowe's Load & Rugs — Little Elm, TX DFW",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-stacked-mattresses-box-spring-yellow-straps-secured-truck-plano-tx-dfw-movers.jpeg",
    alt: "Three stacked mattresses and box spring secured with yellow ratchet straps and gray ratchet belt in moving truck — One World Van Lines Plano, TX DFW Metroplex specialty movers",
    label: "Mattress & Box Spring — Plano, TX DFW",
    category: "Specialty",
  },
  {
    src: "/gallery/oneworld-van-lines-home-depot-labeled-boxes-blanket-furniture-long-distance-truck-carrollton-tx-dfw.jpeg",
    alt: "Moving truck tightly packed with Home Depot boxes, hand-labeled boxes, blue blanket-wrapped furniture for long-distance move — One World Van Lines Carrollton, TX DFW headquarters movers",
    label: "Long Distance Pack — Carrollton, TX DFW",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-plastic-wrapped-blanket-furniture-stacked-full-truck-san-marcos-tx-greater-austin.jpeg",
    alt: "Moving truck fully stacked with plastic-wrapped and navy blanket-wrapped furniture secured with straps — One World Van Lines San Marcos, TX Greater Austin professional movers",
    label: "Full Wrap Load — San Marcos, TX Austin",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-craft-tubs-plastic-wrapped-flooring-blanket-items-truck-buda-tx-greater-austin.jpg",
    alt: "Moving truck interior with labeled CRAFT plastic tubs, plastic-shrink-wrapped hardwood flooring, blanket-wrapped furniture — One World Van Lines Buda, TX Greater Austin movers",
    label: "Craft Tubs & Flooring — Buda, TX Austin",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-blue-moving-truck-open-doors-wrapped-furniture-tubs-armstrong-box-bastrop-tx-austin.jpg",
    alt: "Blue moving truck exterior open doors showing wrapped furniture, plastic tubs and Armstrong flooring box loaded inside — One World Van Lines Bastrop, TX Greater Austin professional movers",
    label: "Blue Truck Load — Bastrop, TX Austin",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-large-semi-trailer-long-distance-suburban-neighborhood-forney-tx-dfw-movers.jpg",
    alt: "Large white semi-trailer long-distance moving truck parked at suburban neighborhood driveway on overcast day — One World Van Lines Forney, TX DFW Metroplex long-distance movers",
    label: "Semi-Trailer Long Distance — Forney, TX DFW",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-graco-baby-gear-dish-pack-camp-chairs-cooler-truck-coppell-tx-dfw-family-move.jpg",
    alt: "Moving truck loaded with Graco baby gear, dish-pack fragile boxes, camp chairs, strollers and cooler for family move — One World Van Lines Coppell, TX DFW Metroplex family movers",
    label: "Family Gear Move — Coppell, TX DFW",
    category: "Specialty",
  },
  {
    src: "/gallery/oneworld-van-lines-empty-large-box-truck-full-capacity-straps-ramp-ready-load-allen-tx-dfw-movers.jpg",
    alt: "Empty large box truck interior showing full capacity with straps hanging, ramp deployed and cardboard ready for loading — One World Van Lines Allen, TX DFW Metroplex professional movers",
    label: "Full Capacity Truck Ready — Allen, TX DFW",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-dish-pack-wardrobe-boxes-rolled-rugs-hp-printer-ladder-truck-southlake-tx-dfw.jpg",
    alt: "Moving truck with dish-pack fragile boxes, wardrobe clothing boxes, rolled rugs, HP printer box and wooden ladder — One World Van Lines Southlake, TX DFW Metroplex professional movers",
    label: "Dish Pack & Wardrobe — Southlake, TX DFW",
    category: "Packing",
  },
  // ── Batch 7 real photos ──
  {
    src: "/gallery/oneworld-van-lines-blue-blanket-wall-to-wall-straps-truck-interior-mesquite-tx-dfw-movers.jpeg",
    alt: "Moving truck interior packed wall-to-wall with blue moving blankets secured by green and white straps — One World Van Lines Mesquite, TX DFW Metroplex professional movers",
    label: "Blue Blanket Wall Pack — Mesquite, TX DFW",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-staircase-blue-carpet-runner-floor-protection-move-day-mckinney-tx-dfw.jpeg",
    alt: "Home foyer staircase fully protected with blue carpet runner on steps and hardwood floor pads on move day — One World Van Lines McKinney, TX DFW Metroplex professional movers",
    label: "Stair & Floor Protection — McKinney, TX DFW",
    category: "Residential",
  },
  {
    src: "/gallery/oneworld-van-lines-bedroom-plastic-wrapped-furniture-liberator-dolly-pack-irving-tx-dfw-movers.jpeg",
    alt: "Bedroom with plastic-wrapped and blue blanket-wrapped furniture staged for move with Liberator appliance dolly — One World Van Lines Irving, TX DFW Metroplex professional movers",
    label: "Bedroom Wrap & Dolly — Irving, TX DFW",
    category: "Residential",
  },
  {
    src: "/gallery/oneworld-van-lines-plastic-wrap-furniture-collage-sofa-dresser-mattress-bed-keller-tx-dfw.jpeg",
    alt: "Collage of nine plastic-wrapped furniture pieces — sofa, dresser, mattresses, bed frame and armoire — professionally wrapped for move — One World Van Lines Keller, TX DFW Metroplex",
    label: "Full Furniture Wrap Collage — Keller, TX DFW",
    category: "Packing",
  },
  {
    src: "/gallery/oneworld-van-lines-staircase-floor-protection-blue-runner-blanket-pads-lewisville-tx-dfw.jpeg",
    alt: "Residential staircase and entry floor fully protected with blue carpet runners and moving blanket pads on move day — One World Van Lines Lewisville, TX DFW Metroplex movers",
    label: "Stair Protection — Lewisville, TX DFW",
    category: "Residential",
  },
  {
    src: "/gallery/oneworld-van-lines-graco-baby-gear-dish-pack-camp-chairs-cooler-truck-mansfield-tx-dfw-family.jpeg",
    alt: "Moving truck packed with Graco baby gear, dish-pack fragile boxes, folding camp chairs, cooler and household items for family move — One World Van Lines Mansfield, TX DFW Metroplex",
    label: "Family Move Load — Mansfield, TX DFW",
    category: "Specialty",
  },
  {
    src: "/gallery/oneworld-van-lines-door-frame-blanket-pads-hallway-carpet-runner-home-protection-euless-tx-dfw.jpeg",
    alt: "Door frame fully padded with blue moving blankets and hallway protected with blue carpet runner — One World Van Lines Euless, TX DFW Metroplex professional home protection movers",
    label: "Door & Hallway Protection — Euless, TX DFW",
    category: "Residential",
  },
  {
    src: "/gallery/oneworld-van-lines-living-room-plastic-wrapped-recliners-mattresses-armoire-flower-mound-tx-dfw.jpeg",
    alt: "Living room staged for move with plastic-wrapped recliners, mattresses, armoire and ceiling fan home ready — One World Van Lines Flower Mound, TX DFW Metroplex professional movers",
    label: "Living Room Wrap — Flower Mound, TX DFW",
    category: "Residential",
  },
  {
    src: "/gallery/oneworld-van-lines-luxury-modern-home-plastic-wrapped-sofas-chairs-staged-westlake-hills-tx-austin.jpeg",
    alt: "Luxury modern home living room with plastic-wrapped sofas and accent chairs staged for move with slider door view — One World Van Lines Westlake Hills, TX Greater Austin high-value movers",
    label: "Luxury Home Wrap — Westlake Hills, TX Austin",
    category: "Residential",
  },
  {
    src: "/gallery/oneworld-van-lines-uhaul-extra-large-wardrobe-boxes-wrapped-panels-truck-grapevine-tx-dfw.jpeg",
    alt: "Moving truck loaded with U-Haul extra-large boxes, wardrobe boxes, plastic-wrapped flat panels and blue moving blankets — One World Van Lines Grapevine, TX DFW Metroplex movers",
    label: "U-Haul & Wardrobe Load — Grapevine, TX DFW",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-wardrobe-craftsman-compressor-labeled-boxes-truck-cedar-hill-tx-dfw-movers.jpeg",
    alt: "Moving truck with wardrobe Handle-With-Care boxes, Craftsman air compressor box and hand-labeled household boxes — One World Van Lines Cedar Hill, TX DFW Metroplex professional movers",
    label: "Wardrobe & Craftsman — Cedar Hill, TX DFW",
    category: "Our Fleet",
  },
  {
    src: "/gallery/oneworld-van-lines-wardrobe-boxes-pink-tubs-labeled-boxes-truck-new-braunfels-tx-greater-austin.jpeg",
    alt: "Moving truck fully loaded with wardrobe Handle-With-Care boxes, pink and gray storage tubs and hand-labeled household boxes — One World Van Lines New Braunfels, TX Greater Austin movers",
    label: "Wardrobe & Tubs — New Braunfels, TX Austin",
    category: "Our Fleet",
  },
];

const CATEGORIES = ["All", "Our Fleet", "Packing", "Residential", "Specialty", "Storage"];

const HERO_INDICES = [0, 5, 12, 6, 14];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);

  const filtered = activeCategory === "All" ? photos : photos.filter(p => p.category === activeCategory);

  useEffect(() => {
    const timer = setInterval(() => setHeroIndex(i => (i + 1) % HERO_INDICES.length), 4500);
    return () => clearInterval(timer);
  }, []);

  const openLightbox = (filteredIdx: number) => setLightboxIndex(filteredIdx);
  const closeLightbox = () => setLightboxIndex(null);

  const prev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
  }, [lightboxIndex, filtered.length]);

  const next = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filtered.length);
  }, [lightboxIndex, filtered.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, prev, next]);

  const heroPhoto = photos[HERO_INDICES[heroIndex]];

  return (
    <PublicLayout>
      {/* ── CINEMATIC HERO SLIDESHOW ── */}
      <div className="relative h-[52vh] min-h-[360px] overflow-hidden bg-primary">
        <AnimatePresence mode="sync">
          <motion.img
            key={heroIndex}
            src={heroPhoto.src}
            alt={heroPhoto.alt}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm font-semibold uppercase tracking-widest text-yellow-400 mb-3"
          >
            Our Work
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="text-5xl md:text-6xl font-serif font-bold text-white mb-4 drop-shadow-lg"
          >
            Photo Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-white/80 text-lg max-w-2xl"
          >
            Real moves, real results — residential, commercial & specialty relocations across DFW and Austin.
          </motion.p>
        </div>
        {/* Hero dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_INDICES.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === heroIndex ? "bg-white w-6" : "bg-white/40"}`}
            />
          ))}
        </div>
      </div>

      {/* ── CATEGORY FILTER ── */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
              {cat !== "All" && (
                <span className="ml-1.5 text-xs opacity-60">
                  {photos.filter(p => p.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── MASONRY GRID ── */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          layout
          className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
        >
          <AnimatePresence>
            {filtered.map((photo, i) => (
              <motion.div
                key={photo.src}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                className="break-inside-avoid relative overflow-hidden rounded-2xl group cursor-pointer shadow-md hover:shadow-xl transition-shadow"
                onClick={() => openLightbox(i)}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ZoomIn className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="inline-block bg-primary/80 backdrop-blur-sm text-primary-foreground text-xs px-2 py-0.5 rounded mb-1">
                    {photo.category}
                  </span>
                  <p className="text-white text-sm font-medium leading-tight">{photo.label}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ── CTA BANNER ── */}
        <div className="mt-20 bg-primary text-primary-foreground rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Ready to add your move to our gallery?</h2>
          <p className="text-primary-foreground/70 mb-8 text-lg">
            Get a free estimate — no obligation, response within 1 hour.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/calculator">
              <button className="flex items-center gap-2 px-8 py-3 bg-secondary text-secondary-foreground rounded font-semibold hover:bg-secondary/90 transition-colors">
                Get a Free Quote <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <a href="tel:6606677770">
              <button className="px-8 py-3 border border-primary-foreground/30 text-primary-foreground rounded font-semibold hover:bg-primary-foreground/10 transition-colors">
                Call (660) 667-7770
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 z-10 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="max-w-5xl max-h-[85vh] mx-16 flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filtered[lightboxIndex].src}
                alt={filtered[lightboxIndex].alt}
                className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
              />
              <div className="mt-4 text-center">
                <span className="inline-block bg-primary/80 text-primary-foreground text-xs px-3 py-1 rounded-full mb-2">
                  {filtered[lightboxIndex].category}
                </span>
                <p className="text-white/90 text-sm font-medium">{filtered[lightboxIndex].label}</p>
                <p className="text-white/40 text-xs mt-1">{lightboxIndex + 1} / {filtered.length}</p>
              </div>
            </motion.div>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 z-10 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </PublicLayout>
  );
}
