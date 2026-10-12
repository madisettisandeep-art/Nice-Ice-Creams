"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "@/lib/db/types";
import { useCart } from "@/components/cart/CartContext";
import { ProductCard } from "@/components/menu/ProductCard";
import {
  AlertCircle,
  ArrowLeft,
  Award,
  Check,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

export function ProductPageClient({
  product,
  recommendedProducts = [],
}: {
  product: Product;
  recommendedProducts: Product[];
}) {
  const { addItem, setCartDrawerOpen } = useCart();

  const variants = product.variants?.length
    ? product.variants
    : [
        {
          id: "standard",
          name: "Standard Serving",
          price: product.price,
          servingSize: "1 Serving",
          available: true,
        },
      ];
  const ingredients = product.ingredients?.length
    ? product.ingredients
    : ["Pure Milk", "Fresh Dairy Cream"];
  const allergens = product.allergens?.length
    ? product.allergens
    : ["Milk / Dairy"];

  const firstAvail = variants.find((v) => v.available) || variants[0];
  const [selectedVariantId, setSelectedVariantId] = useState(
    firstAvail?.id || "standard"
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedVariant =
    variants.find((v) => v.id === selectedVariantId) || variants[0];
  const unitPrice = selectedVariant ? selectedVariant.price : product.price;
  const totalPrice = Math.round(unitPrice * quantity * 100) / 100;
  const canOrder =
    product.availability && (!selectedVariant || selectedVariant.available);

  const layers = product.exploded_spec?.layers ?? [];

  const handleAdd = () => {
    if (!canOrder || !selectedVariant) return;
    addItem(product, selectedVariant.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 space-y-16">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href={`/menu?category=${product.category_slug}`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-cinema-800 hover:text-brand-blue transition"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to {product.category_name}</span>
        </Link>
        <span className="text-xs font-mono text-cinema-800/60">
          NICE ICE CREAMS • EST. 1986
        </span>
      </div>

      {/* Main Product Showcase & Ordering Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        {/* Left: High-Resolution Studio Photograph, Layer Breakdown & Craft Highlights */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 rounded-3xl bg-white border border-ivory-300 p-5 sm:p-7 shadow-card flex flex-col justify-between gap-6"
        >
          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-ivory-100 border border-ivory-300 shadow-inner">
            <img
              src={product.image_url}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.src = "/menu/vanilla.webp?v=4";
              }}
              className="h-full w-full object-cover"
            />
          </div>

          {layers.length > 0 && (
            <div className="space-y-2.5">
              <div className="text-xs font-extrabold uppercase tracking-wider text-cinema-800/75">
                Signature Layer-by-Layer Breakdown
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {layers.slice(0, 4).map((layer, idx) => (
                  <div
                    key={layer.id || idx}
                    className="rounded-2xl bg-cinema-950 text-white border border-cinema-800 p-3.5 space-y-1"
                  >
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-brand-cyan leading-snug break-words">
                      0{idx + 1} • {layer.label}
                    </div>
                    <div className="text-xs text-ivory-200 leading-relaxed break-words">
                      {layer.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 rounded-2xl bg-ivory-100/80 border border-ivory-300 p-4">
              <ShieldCheck
                className="w-5 h-5 text-brand-blue shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-cinema-900">
                  100% Pure Dairy Promise
                </div>
                <p className="text-xs text-cinema-800/75 mt-1 leading-relaxed">
                  Prepared fresh with pure milk, rich dairy cream, and authentic ingredients since 1986.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-ivory-100/80 border border-ivory-300 p-4">
              <Award
                className="w-5 h-5 text-brand-indigo shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-cinema-900">
                  Multi-Item WhatsApp Ordering
                </div>
                <p className="text-xs text-cinema-800/75 mt-1 leading-relaxed">
                  Combine scoops, sundaes, and shakes in your cart for instant WhatsApp confirmation.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Product Info & Ordering */}
        <div className="lg:col-span-5 rounded-3xl bg-white border border-ivory-300 p-6 sm:p-8 shadow-card flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-brand-blue/10 text-brand-blue px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider">
                {product.category_name}
              </span>
              {product.seasonal && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-900 px-3 py-1 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
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
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-cinema-900">
                {product.name}
              </h1>
              <div className="text-right shrink-0">
                <div className="text-3xl font-extrabold text-brand-blue">
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

            {/* Variant Selector */}
            {variants.length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-cinema-800/75">
                  Choose Serving Size / Variant
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {variants.map((variant) => {
                    const active = variant.id === selectedVariant?.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        disabled={!variant.available}
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`rounded-2xl border p-3 text-left transition ${
                          active
                            ? "border-brand-blue bg-brand-blue/10 ring-2 ring-brand-blue/30"
                            : "border-ivory-300 bg-ivory-50/70 hover:border-brand-blue"
                        } ${!variant.available ? "opacity-45 cursor-not-allowed" : ""}`}
                      >
                        <div className="text-xs font-bold text-cinema-900">
                          {variant.name}
                        </div>
                        <div className="text-base font-extrabold text-brand-blue mt-0.5">
                          ₹{variant.price}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Verified Ingredients & Allergen Notice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="rounded-2xl bg-ivory-100 border border-ivory-300 p-3.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-cinema-800/70 mb-1">
                  Ingredients
                </div>
                <div className="text-xs text-cinema-900 leading-relaxed">
                  {ingredients.join(" • ")}
                </div>
              </div>
              <div className="rounded-2xl bg-ivory-100 border border-ivory-300 p-3.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-cinema-800/70 mb-1">
                  Allergens
                </div>
                <div className="text-xs font-semibold text-amber-900 leading-relaxed">
                  Contains: {allergens.join(", ")}
                </div>
              </div>
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="pt-5 border-t border-ivory-300 space-y-3">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-ivory-300 bg-ivory-50 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="h-10 w-10 inline-flex items-center justify-center rounded-full hover:bg-ivory-200 text-cinema-900"
                >
                  <Minus className="w-4 h-4" aria-hidden="true" />
                </button>
                <span className="w-10 text-center font-bold text-base">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(50, q + 1))}
                  aria-label="Increase quantity"
                  className="h-10 w-10 inline-flex items-center justify-center rounded-full hover:bg-ivory-200 text-cinema-900"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <button
                type="button"
                disabled={!canOrder}
                onClick={handleAdd}
                className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-sm sm:text-base font-extrabold text-white shadow-lg transition ${
                  !canOrder
                    ? "bg-gray-400 cursor-not-allowed"
                    : added
                    ? "bg-emerald-600"
                    : "bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-indigo hover:opacity-95"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" aria-hidden="true" />
                    <span>Added to Cart (₹{totalPrice})</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                    <span>Add to Cart • ₹{totalPrice}</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <Link
                href="/menu"
                className="font-bold text-cinema-800 hover:text-brand-blue"
              >
                ← Continue Shopping
              </Link>
              <button
                type="button"
                onClick={() => setCartDrawerOpen(true)}
                className="font-extrabold text-brand-blue hover:underline"
              >
                Open Cart &amp; Order on WhatsApp →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Pairings */}
      {recommendedProducts.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-ivory-300">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-cinema-900">
              Recommended Pairings
            </h2>
            <p className="text-xs sm:text-sm text-cinema-800/75">
              Customers who enjoy {product.name} also love adding these to their multi-item order:
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedProducts.map((rec) => (
              <ProductCard key={rec.id} product={rec} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

