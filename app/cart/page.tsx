"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { CheckoutFormPanel } from "@/components/checkout/CheckoutFormPanel";
import { ArrowLeft, ShoppingBag, Sparkles } from "lucide-react";

export default function CartPage() {
  const { items, itemCount } = useCart();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ivory-300 pb-6">
        <div className="space-y-1">
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Continue Exploring the Menu</span>
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-cinema-900">
            Your Multi-Item Order Cart
          </h1>
          <p className="text-xs sm:text-sm text-cinema-800/75">
            Combine multiple scoops, sundaes, shakes, and signature items into one verified WhatsApp order.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-2xl bg-white border border-ivory-300 px-4 py-2.5 shadow-sm">
          <ShoppingBag className="w-5 h-5 text-brand-blue" aria-hidden="true" />
          <span className="text-sm font-extrabold text-cinema-900">
            {itemCount} {itemCount === 1 ? "item" : "items"} in cart
          </span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl bg-white border border-ivory-300 p-12 text-center space-y-5 shadow-card">
          <div className="h-16 w-16 rounded-3xl bg-brand-blue/10 text-brand-blue flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" aria-hidden="true" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-cinema-900">
            Your Cart Is Currently Empty
          </h2>
          <p className="text-sm text-cinema-800/75 max-w-md mx-auto leading-relaxed">
            Browse our 8 collections—from Classic Flavours and Seasonal Sitaphal to hot Brownie Sizzlers and Death by Chocolate—and add your favourites.
          </p>
          <div className="pt-2">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-brand-blue hover:bg-brand-indigo text-white px-7 py-3.5 text-sm font-extrabold shadow-lg transition"
            >
              <span>Browse All 49 Menu Creations</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-ivory-50 border border-ivory-300 p-5 sm:p-8 shadow-card">
          <CheckoutFormPanel />
        </div>
      )}
    </div>
  );
}

