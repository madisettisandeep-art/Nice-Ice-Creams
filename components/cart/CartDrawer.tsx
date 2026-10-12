"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useCart } from "./CartContext";
import { CheckoutFormPanel } from "@/components/checkout/CheckoutFormPanel";
import { ArrowRight, ShoppingBag, Sparkles, X } from "lucide-react";

export function CartDrawer() {
  const { items, itemCount, isCartDrawerOpen, setCartDrawerOpen } = useCart();

  useEffect(() => {
    if (!isCartDrawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCartDrawerOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCartDrawerOpen, setCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) setCartDrawerOpen(false);
      }}
    >
      <div className="relative w-full max-w-lg bg-ivory-50 text-cinema-900 h-full shadow-2xl flex flex-col overflow-hidden border-l border-ivory-300">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-ivory-300">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="cart-drawer-title"
                className="font-display text-lg font-bold text-cinema-900"
              >
                Your NICE Order Cart
              </h2>
              <p className="text-xs text-cinema-800/70">
                {itemCount} {itemCount === 1 ? "item" : "items"} selected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              onClick={() => setCartDrawerOpen(false)}
              className="text-xs font-bold text-brand-blue hover:underline px-2 py-1"
            >
              Full Cart Page
            </Link>
            <button
              type="button"
              onClick={() => setCartDrawerOpen(false)}
              aria-label="Close shopping cart drawer"
              className="h-9 w-9 rounded-full bg-ivory-200 hover:bg-ivory-300 inline-flex items-center justify-center text-cinema-900 transition"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 space-y-4">
              <div className="h-16 w-16 rounded-3xl bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                <Sparkles className="w-8 h-8" aria-hidden="true" />
              </div>
              <h3 className="font-display text-2xl font-bold text-cinema-900">
                Your Ice Cream Cart is Empty
              </h3>
              <p className="text-sm text-cinema-800/75 max-w-xs leading-relaxed">
                Add your favourite Classic Scoops, Sizzling Brownie Sundaes, or Thick Shakes to place one combined WhatsApp order.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <Link
                  href="/menu"
                  onClick={() => setCartDrawerOpen(false)}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-blue hover:bg-brand-indigo text-white px-6 py-3 text-xs font-bold shadow transition"
                >
                  <span>Explore All 49 Flavours</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ) : (
            <CheckoutFormPanel onCloseDrawer={() => setCartDrawerOpen(false)} />
          )}
        </div>
      </div>
    </div>
  );
}

