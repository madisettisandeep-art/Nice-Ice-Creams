"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/components/cart/CartContext";
import { INITIAL_PRODUCTS } from "@/lib/db/seed-data";
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";

export function ProductDetailModal() {
  const {
    activeProductModal,
    closeProductModal,
    addItem,
    setCartDrawerOpen,
    openProductModal,
  } = useCart();

  const product = activeProductModal?.product ?? null;

  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState(false);
  const [slideDir, setSlideDir] = useState<number>(1);

  useEffect(() => {
    if (product) {
      const firstAvailable =
        product.variants.find((v) => v.available) || product.variants[0];
      setSelectedVariantId(firstAvailable?.id || "standard");
      setQuantity(1);
      setJustAdded(false);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeProductModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [product, closeProductModal]);

  if (!product) return null;

  const currentIdx = INITIAL_PRODUCTS.findIndex((p) => p.slug === product.slug);
  const navigateFlavour = (dir: number) => {
    if (currentIdx === -1) return;
    setSlideDir(dir);
    const nextIdx =
      (currentIdx + dir + INITIAL_PRODUCTS.length) % INITIAL_PRODUCTS.length;
    openProductModal(INITIAL_PRODUCTS[nextIdx], false);
  };

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ||
    product.variants[0];
  const unitPrice = selectedVariant ? selectedVariant.price : product.price;
  const totalPrice = Math.round(unitPrice * quantity * 100) / 100;
  const canOrder =
    product.availability && (!selectedVariant || selectedVariant.available);

  const recommendedProducts = product.recommended_slugs
    .map((slug) => INITIAL_PRODUCTS.find((p) => p.slug === slug))
    .filter(Boolean);

  const handleAddToCart = () => {
    if (!canOrder || !selectedVariant) return;
    addItem(product, selectedVariant.id, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeProductModal();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-5xl rounded-3xl bg-ivory-50 text-cinema-900 shadow-2xl border border-ivory-300 overflow-hidden my-auto max-h-[92vh] flex flex-col lg:flex-row"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={closeProductModal}
          aria-label="Close product details"
          className="absolute top-3.5 right-3.5 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full bg-cinema-900/80 text-white hover:bg-brand-blue transition shadow-lg"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Left Column: High-Resolution Studio Photograph + Slide Navigation */}
        <div className="w-full lg:w-[52%] p-4 sm:p-6 bg-gradient-to-b from-cinema-950 via-cinema-900 to-cinema-950 text-white flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-ivory-100">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" aria-hidden="true" />
              <span>100% Pure Milk &amp; Fresh Cream</span>
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => navigateFlavour(-1)}
                aria-label="Previous flavour"
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-brand-cyan border border-white/15 flex items-center justify-center text-white transition"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <span className="text-[11px] font-mono text-ivory-300 px-1">
                {String(currentIdx + 1).padStart(2, "0")}/49
              </span>
              <button
                type="button"
                onClick={() => navigateFlavour(1)}
                aria-label="Next flavour"
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-brand-cyan border border-white/15 flex items-center justify-center text-white transition"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="relative flex-1 min-h-[260px] sm:min-h-[340px] flex items-center justify-center overflow-hidden rounded-2xl bg-black/40 border border-white/10">
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={product.slug}
                src={product.image_url}
                alt={product.name}
                initial={{ opacity: 0, x: slideDir > 0 ? 60 : -60, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: slideDir > 0 ? -60 : 60, scale: 0.96 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full max-h-[380px] object-contain p-2"
              />
            </AnimatePresence>
          </div>

          {/* Ingredient Layer Breakdown Pills */}
          <div className="grid grid-cols-2 gap-2">
            {product.exploded_spec.layers.slice(0, 4).map((layer, idx) => (
              <div
                key={layer.id}
                className="rounded-xl bg-white/5 border border-white/10 px-3 py-2"
              >
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-brand-cyan">
                  0{idx + 1} • {layer.label}
                </div>
                <div className="text-[11px] text-ivory-300 truncate">
                  {layer.detail}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Product Details & Ordering Controls */}
        <div className="w-full lg:w-[48%] p-5 sm:p-7 overflow-y-auto flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-brand-blue/10 text-brand-blue px-3 py-1 text-xs font-bold uppercase tracking-wider">
                {product.category_name}
              </span>
              {product.seasonal && (
                <span className="inline-flex items-center gap-1 rounded-full bg-flavour-mango/20 text-amber-900 px-3 py-1 text-xs font-semibold">
                  <Sparkles className="w-3 h-3" aria-hidden="true" />
                  Seasonal Special
                </span>
              )}
              {!product.availability && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-800 px-3 py-1 text-xs font-bold">
                  <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  Out of Stock
                </span>
              )}
            </div>

            <div className="flex items-baseline justify-between gap-4">
              <h2
                id="product-modal-title"
                className="font-display text-2xl sm:text-3xl font-bold text-cinema-900"
              >
                {product.name}
              </h2>
              <div className="text-right shrink-0">
                <div className="text-2xl sm:text-3xl font-extrabold text-brand-blue">
                  ₹{unitPrice}
                </div>
                {selectedVariant?.servingSize && (
                  <div className="text-xs text-cinema-800/70">
                    {selectedVariant.servingSize}
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm sm:text-base text-cinema-800/85 leading-relaxed">
              {product.description}
            </p>

            {/* Serving Size / Variant Selector */}
            {product.variants.length > 0 && (
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-cinema-800/75">
                  Select Serving Size / Variant
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {product.variants.map((variant) => {
                    const isSelected = variant.id === selectedVariant?.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        disabled={!variant.available}
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`rounded-xl border px-3 py-2.5 text-left transition ${
                          isSelected
                            ? "border-brand-blue bg-brand-blue/10 ring-2 ring-brand-blue/30"
                            : "border-ivory-300 bg-white hover:border-brand-cyan"
                        } ${!variant.available ? "opacity-45 cursor-not-allowed" : ""}`}
                      >
                        <div className="text-xs font-bold text-cinema-900">
                          {variant.name}
                        </div>
                        <div className="text-sm font-extrabold text-brand-blue mt-0.5">
                          ₹{variant.price}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Verified Ingredients & Allergens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="rounded-xl bg-ivory-100 border border-ivory-300 p-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-cinema-800/70 mb-1">
                  Key Ingredients
                </div>
                <div className="text-xs text-cinema-900 leading-relaxed">
                  {product.ingredients.join(" • ")}
                </div>
              </div>
              <div className="rounded-xl bg-ivory-100 border border-ivory-300 p-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-cinema-800/70 mb-1">
                  Allergen Info
                </div>
                <div className="text-xs font-medium text-amber-900 leading-relaxed">
                  Contains: {product.allergens.join(", ")}
                </div>
              </div>
            </div>

            {/* Recommended Pairings */}
            {recommendedProducts.length > 0 && (
              <div className="pt-1">
                <div className="text-xs font-bold uppercase tracking-wider text-cinema-800/70 mb-2">
                  Pairs Wonderfully With
                </div>
                <div className="flex flex-wrap gap-2">
                  {recommendedProducts.map((rec) =>
                    rec ? (
                      <button
                        key={rec.id}
                        type="button"
                        onClick={() => openProductModal(rec, false)}
                        className="inline-flex items-center gap-2 rounded-full bg-white border border-ivory-300 hover:border-brand-blue px-3 py-1.5 text-xs font-semibold text-cinema-900 transition shadow-sm"
                      >
                        <img
                          src={rec.image_url}
                          alt={rec.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span>{rec.name}</span>
                        <span className="text-brand-blue font-bold">
                          ₹{rec.price}
                        </span>
                      </button>
                    ) : null
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quantity & Add to Cart Action Bar */}
          <div className="pt-4 border-t border-ivory-300 space-y-3">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-ivory-300 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-ivory-200 text-cinema-900 transition"
                >
                  <Minus className="w-4 h-4" aria-hidden="true" />
                </button>
                <span
                  className="w-10 text-center font-bold text-base text-cinema-900"
                  aria-live="polite"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(50, q + 1))}
                  aria-label="Increase quantity"
                  className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-ivory-200 text-cinema-900 transition"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <button
                type="button"
                disabled={!canOrder}
                onClick={handleAddToCart}
                className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-lg transition ${
                  !canOrder
                    ? "bg-gray-400 cursor-not-allowed"
                    : justAdded
                    ? "bg-emerald-600"
                    : "bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-indigo hover:opacity-95"
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-5 h-5" aria-hidden="true" />
                    <span>Added to Cart (₹{totalPrice})</span>
                  </>
                ) : canOrder ? (
                  <>
                    <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                    <span>Add to Order • ₹{totalPrice}</span>
                  </>
                ) : (
                  <span>Currently Unavailable</span>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-cinema-800/75">
              <button
                type="button"
                onClick={closeProductModal}
                className="font-semibold text-cinema-800 hover:text-brand-blue underline-offset-4 hover:underline"
              >
                ← Continue Shopping
              </button>
              <div className="flex items-center gap-4">
                <Link
                  href={`/menu/${product.slug}`}
                  onClick={closeProductModal}
                  className="inline-flex items-center gap-1 font-semibold text-brand-blue hover:underline"
                >
                  <span>Full Product Page</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    closeProductModal();
                    setCartDrawerOpen(true);
                  }}
                  className="font-bold text-brand-indigo hover:underline"
                >
                  View Cart &amp; Checkout →
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
