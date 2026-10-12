"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Product } from "@/lib/db/types";
import { useCart } from "@/components/cart/CartContext";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Plus,
  Sparkles,
  Check,
} from "lucide-react";

const SHOWCASE_SLUGS = [
  "brownie-with-ice-cream-sizzler",
  "fruit-salad-with-ice-cream",
  "death-by-chocolate",
  "fresh-sitaphal",
  "badam-milk-with-ice-cream",
  "ferrero-shake",
  "natural-mango",
  "gulab-jamoon",
  "cassata",
  "american-beauty-sundae",
];

const CARD_ACCENTS = [
  {
    cardBg: "bg-gradient-to-b from-white via-[#FFF9FA] to-[#FFF0F4]",
    badge: "bg-gradient-to-r from-[#E84A6F] to-[#C2185B]",
    catColor: "text-[#C2185B]",
    priceBg: "bg-[#FFF0F3] text-[#C2185B] border-[#F9A8B8]/60",
    btn: "bg-gradient-to-r from-[#E84A6F] to-[#C2185B] hover:from-[#D83A5F] hover:to-[#AD1457]",
  },
  {
    cardBg: "bg-gradient-to-b from-white via-[#FFFCF5] to-[#FFF5DF]",
    badge: "bg-gradient-to-r from-[#F59E0B] to-[#D97706]",
    catColor: "text-[#B45309]",
    priceBg: "bg-[#FFF8E7] text-[#B45309] border-[#F5A623]/60",
    btn: "bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309]",
  },
  {
    cardBg: "bg-gradient-to-b from-white via-[#F7FCF6] to-[#ECF8E8]",
    badge: "bg-gradient-to-r from-[#2E7D32] to-[#15803D]",
    catColor: "text-[#15803D]",
    priceBg: "bg-[#F1F9EE] text-[#15803D] border-[#7BB661]/60",
    btn: "bg-gradient-to-r from-[#2E7D32] to-[#15803D] hover:from-[#1B5E20] hover:to-[#166534]",
  },
];

export const SignatureSlider = React.memo(function SignatureSlider({
  products,
}: {
  products: Product[];
}) {
  const { addItem, openProductModal } = useCart();

  const slides = useMemo(() => {
    const bySlug = new Map(products.map((p) => [p.slug, p]));
    return SHOWCASE_SLUGS.map((slug) => bySlug.get(slug)).filter(
      (p): p is Product => Boolean(p)
    );
  }, [products]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  const effectivelyPaused = isHoverPaused || userPaused;

  useEffect(() => {
    if (effectivelyPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [effectivelyPaused, slides.length]);

  if (slides.length === 0) return null;

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex(
      (prev) => (prev + newDirection + slides.length) % slides.length
    );
  };

  // Show 3 visible cards on desktop starting at currentIndex
  const visibleCards = [
    slides[currentIndex % slides.length],
    slides[(currentIndex + 1) % slides.length],
    slides[(currentIndex + 2) % slides.length],
  ];

  const handleQuickAdd = (product: Product) => {
    const v = product.variants.find((x) => x.available) || product.variants[0];
    if (!v) return;
    addItem(product, v.id, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHoverPaused(true)}
      onMouseLeave={() => setIsHoverPaused(false)}
      className="relative rounded-[2.25rem] bg-gradient-to-br from-[#3D1229] via-[#2D1646] to-[#13294B] text-white p-6 sm:p-8 lg:p-10 mb-12 border border-rose-300/25 shadow-cinema overflow-hidden"
    >
      {/* Multi-Flavour Ambient Glow Orbs (Strawberry Rose, Mango Gold & Pistachio) */}
      <div className="pointer-events-none absolute -top-24 -right-20 h-80 w-80 rounded-full bg-[#E84A6F] blur-3xl opacity-30" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-[#F5A623] blur-3xl opacity-25" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-[#7BB661] blur-3xl opacity-15" />

      {/* Header & Slide Controls */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400/25 to-rose-500/25 backdrop-blur-sm border border-amber-300/40 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-amber-300">
            <Sparkles
              className="w-3.5 h-3.5 text-amber-300"
              aria-hidden="true"
            />
            <span>Interactive Signature Spotlight • Drag or Click to Slide</span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Slide Through Our Most-Loved Creations
          </h3>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            aria-label={
              userPaused
                ? "Resume signature slide carousel"
                : "Pause signature slide carousel"
            }
            title={userPaused ? "Play auto-slide" : "Pause auto-slide"}
            className="h-10 px-3.5 rounded-full bg-white/15 hover:bg-amber-400 hover:text-cinema-950 border border-white/25 inline-flex items-center gap-1.5 text-xs font-extrabold text-white transition"
          >
            {userPaused ? (
              <>
                <Play className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Play</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Pause</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => paginate(-1)}
            aria-label="Previous signature slide"
            className="h-10 w-10 rounded-full bg-white/15 hover:bg-[#E84A6F] border border-white/25 flex items-center justify-center text-white transition active:scale-90"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <div className="px-2 text-xs font-mono font-bold text-amber-200">
            {String(currentIndex + 1).padStart(2, "0")} /{" "}
            {String(slides.length).padStart(2, "0")}
          </div>
          <button
            type="button"
            onClick={() => paginate(1)}
            aria-label="Next signature slide"
            className="h-10 w-10 rounded-full bg-white/15 hover:bg-[#E84A6F] border border-white/25 flex items-center justify-center text-white transition active:scale-90"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Animated 3-Card Slide Stage with Swipe/Drag Gesture */}
      <div className="relative z-10 overflow-hidden py-1">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -55) paginate(1);
              else if (info.offset.x > 55) paginate(-1);
            }}
            initial={{
              opacity: 0,
              x: direction > 0 ? 110 : -110,
              scale: 0.96,
            }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{
              opacity: 0,
              x: direction > 0 ? -110 : 110,
              scale: 0.96,
            }}
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 26,
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 cursor-grab active:cursor-grabbing"
          >
            {visibleCards.map((item, idx) => {
              const isAdded = addedId === item.id;
              const accent = CARD_ACCENTS[idx % CARD_ACCENTS.length];
              return (
                <motion.div
                  key={`${item.id}-${idx}`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06, duration: 0.35 }}
                  whileHover={{ y: -6 }}
                  className={`group rounded-2xl ${accent.cardBg} text-cinema-900 overflow-hidden shadow-xl border border-white/40 flex flex-col transition-shadow duration-300 hover:shadow-2xl`}
                >
                  <div
                    onClick={() => openProductModal(item, false)}
                    className="relative aspect-[16/10] w-full overflow-hidden bg-ivory-100 cursor-pointer"
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      width={800}
                      height={500}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.src = "/menu/vanilla.webp?v=4";
                      }}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div
                      className={`absolute top-2.5 left-2.5 rounded-full ${accent.badge} text-white px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider shadow-md`}
                    >
                      #{((currentIndex + idx) % slides.length) + 1} Spotlight
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span
                            className={`block text-[10px] font-extrabold uppercase tracking-widest ${accent.catColor}`}
                          >
                            {item.category_name}
                          </span>
                          <h4 className="font-display text-lg font-bold text-cinema-900 leading-snug group-hover:text-[#C2185B] transition-colors">
                            {item.name}
                          </h4>
                        </div>
                        <span
                          className={`rounded-xl border px-2.5 py-0.5 text-base font-black shrink-0 ${accent.priceBg}`}
                        >
                          ₹{item.price}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-cinema-800/80 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-cinema-900/10">
                      <button
                        type="button"
                        onClick={() => openProductModal(item, false)}
                        className={`text-xs font-extrabold ${accent.catColor} hover:underline transition`}
                      >
                        View Flavour Details
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(item)}
                        className={`inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-extrabold text-white shadow-sm transition active:scale-95 ${
                          isAdded ? "bg-emerald-600" : accent.btn
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Interactive Progress Dots */}
      <div className="relative z-10 flex items-center justify-center gap-2 mt-6">
        {slides.map((s, idx) => {
          const active = idx === currentIndex;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              aria-label={`Jump to slide ${idx + 1}: ${s.name}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                active
                  ? "w-9 bg-gradient-to-r from-amber-400 to-rose-400 shadow-[0_0_12px_rgba(245,166,35,0.85)]"
                  : "w-2.5 bg-white/30 hover:bg-white/60"
              }`}
            />
          );
        })}
      </div>
    </motion.div>
  );
});
