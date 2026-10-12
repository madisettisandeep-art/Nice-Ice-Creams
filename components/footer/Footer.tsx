import React from "react";
import Link from "next/link";
import {
  ExternalLink,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Sparkles,
} from "lucide-react";
import { NICE_SHOP_LOCATION } from "@/lib/location/shop-location";

export function Footer() {
  return (
    <footer className="relative z-10 bg-gradient-to-br from-[#2B101D] via-[#1E1433] to-[#0F1E36] text-ivory-100 border-t border-white/10 overflow-hidden">
      {/* Top Multi-Flavour Artisanal Ribbon */}
      <div
        aria-hidden="true"
        className="h-1.5 w-full bg-gradient-to-r from-[#E11D48] via-[#F59E0B] via-[#10B981] via-[#9333EA] to-[#0064B5]"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/brand/nice_ice_cream_logo.png"
                alt="NICE ICE CREAMS Official Logo"
                width={56}
                height={56}
                className="h-14 w-14 rounded-2xl bg-white p-1 object-contain shadow-md"
              />
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#FDE68A]">
                  Since 1986
                </div>
                <div className="font-display text-xl font-black text-white">
                  NICE ICE CREAMS
                </div>
                <div className="text-xs text-[#FDA4AF] font-semibold">
                  Eat.. Party.. Ice Creams
                </div>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-ivory-200/90 leading-relaxed">
              Crafting joy since 1986 with premium ice creams, thick shakes, hot brownie sizzlers, fruit salad with ice cream, and badam milk—made with pure milk and fresh dairy cream.
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#F59E0B]/20 to-[#E11D48]/20 border border-[#FBBF24]/35 px-3.5 py-1.5 text-xs font-semibold text-[#FDE68A]">
              <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" aria-hidden="true" />
              <span>100% Pure Milk &amp; Fresh Dairy Cream</span>
            </div>

            {/* Official Instagram Badge Link */}
            <div className="pt-1">
              <a
                href={NICE_SHOP_LOCATION.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-95 text-white px-4 py-2 text-xs font-extrabold shadow-md transition hover:-translate-y-0.5"
              >
                <Instagram className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Follow {NICE_SHOP_LOCATION.instagramHandle}</span>
                <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Menu Categories */}
          <div className="space-y-3">
            <h3 className="font-display text-base font-bold text-[#FDE68A] uppercase tracking-wider">
              Explore Menu
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-ivory-300">
              <li>
                <Link href="/menu?category=classic-flavours" className="hover:text-brand-cyan transition">
                  Classic Flavours
                </Link>
              </li>
              <li>
                <Link href="/menu?category=premium-flavours" className="hover:text-brand-cyan transition">
                  Premium Flavours
                </Link>
              </li>
              <li>
                <Link href="/menu?category=chocolate-flavours" className="hover:text-brand-cyan transition">
                  Chocolate Flavours
                </Link>
              </li>
              <li>
                <Link href="/menu?category=fruit-seasonal" className="hover:text-brand-cyan transition">
                  Fruit-Based / Seasonal
                </Link>
              </li>
              <li>
                <Link href="/menu?category=dessert-inspired" className="hover:text-brand-cyan transition">
                  Dessert-Inspired Flavours
                </Link>
              </li>
              <li>
                <Link href="/menu?category=specials-signature" className="hover:text-brand-cyan transition">
                  Specials &amp; Signature Items
                </Link>
              </li>
              <li>
                <Link href="/menu?category=premium-shakes" className="hover:text-brand-cyan transition">
                  Premium Ice Cream Shakes
                </Link>
              </li>
              <li>
                <Link href="/menu?category=ice-cream-sundaes" className="hover:text-brand-cyan transition">
                  Ice Cream Sundaes
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-ivory-300">
              <li>
                <Link href="/" className="hover:text-brand-cyan transition">
                  12-Shot Cinematic Story
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-cyan transition">
                  Our Story (Since 1986)
                </Link>
              </li>
              <li>
                <Link href="/party-orders" className="hover:text-brand-cyan transition">
                  Party Bookings &amp; Bulk Orders
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-brand-cyan transition">
                  Multi-Item Order Cart
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-cyan transition">
                  Shop Map &amp; Contact
                </Link>
              </li>
              <li>
                <a
                  href={NICE_SHOP_LOCATION.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer inline-flex items-center gap-1.5 text-[#FDA4AF] font-bold hover:text-white transition"
                >
                  <Instagram className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Instagram ({NICE_SHOP_LOCATION.instagramHandle})</span>
                </a>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-brand-cyan transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-cyan transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-brand-cyan transition text-ivory-300/60">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Verified Shop Address, Map Link & Contact Details */}
          <div className="space-y-3">
            <h3 className="font-display text-base font-bold text-[#FDE68A] uppercase tracking-wider">
              Parlour Address &amp; Orders
            </h3>
            <div className="relative z-10 rounded-2xl bg-white/10 border border-white/20 p-4 space-y-3 text-xs text-ivory-100 shadow-md">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" aria-hidden="true" />
                <address className="not-italic leading-relaxed font-semibold text-white">
                  {NICE_SHOP_LOCATION.streetAddress},<br />
                  {NICE_SHOP_LOCATION.area}, {NICE_SHOP_LOCATION.city},<br />
                  {NICE_SHOP_LOCATION.state} – {NICE_SHOP_LOCATION.postalCode}
                </address>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <a
                  href={NICE_SHOP_LOCATION.googleShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer relative z-20 inline-flex items-center gap-1.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white px-3.5 py-1.5 text-xs font-extrabold shadow-sm transition hover:-translate-y-0.5"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                </a>
                <a
                  href={NICE_SHOP_LOCATION.googleDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer relative z-20 inline-flex items-center gap-1 rounded-full bg-white/15 hover:bg-white/25 text-[#FDE68A] px-3 py-1.5 text-[11px] font-bold transition"
                >
                  <Navigation className="w-3 h-3 shrink-0" aria-hidden="true" />
                  <span>Directions</span>
                </a>
              </div>
            </div>
            <div className="space-y-2 text-xs sm:text-sm pt-1">
              <a
                href="tel:+919985422222"
                className="cursor-pointer flex items-center gap-2 text-white font-bold hover:text-brand-cyan transition"
              >
                <Phone className="w-4 h-4 text-brand-cyan shrink-0" aria-hidden="true" />
                <span>+91 99854 22222</span>
              </a>
              <a
                href="tel:+917306142993"
                className="cursor-pointer flex items-center gap-2 text-white font-bold hover:text-brand-cyan transition"
              >
                <Phone className="w-4 h-4 text-brand-cyan shrink-0" aria-hidden="true" />
                <span>+91 73061 42993</span>
              </a>
              <a
                href="mailto:niceicecreams.warangal@gmail.com"
                className="cursor-pointer flex items-center gap-2 text-ivory-200 hover:text-brand-cyan transition break-all"
              >
                <Mail className="w-4 h-4 text-brand-cyan shrink-0" aria-hidden="true" />
                <span>niceicecreams.warangal@gmail.com</span>
              </a>
            </div>
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <a
                href="https://wa.me/919985422222?text=Hello%20NICE%20ICE%20CREAMS!%20I%20would%20like%20to%20enquire%20about%20an%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1EBE5B] text-white px-4 py-2.5 text-xs font-extrabold shadow transition hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Chat on WhatsApp</span>
              </a>
              <a
                href={NICE_SHOP_LOCATION.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit NICE ICE CREAMS on Instagram"
                className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-95 text-white px-4 py-2.5 text-xs font-extrabold shadow transition hover:-translate-y-0.5"
              >
                <Instagram className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ivory-300/75">
          <p>
            © {new Date().getFullYear()} NICE ICE CREAMS (Established 1986) • {NICE_SHOP_LOCATION.area}, {NICE_SHOP_LOCATION.city}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={NICE_SHOP_LOCATION.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer inline-flex items-center gap-1.5 text-[#FDA4AF] font-extrabold hover:text-white hover:underline transition"
            >
              <Instagram className="w-4 h-4" aria-hidden="true" />
              <span>Instagram: {NICE_SHOP_LOCATION.instagramHandle}</span>
            </a>
            <span>•</span>
            <a
              href={NICE_SHOP_LOCATION.googleShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer inline-flex items-center gap-1 text-[#38BDF8] font-extrabold hover:text-white hover:underline transition"
            >
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

