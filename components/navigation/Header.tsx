"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCart } from "@/components/cart/CartContext";
import { INITIAL_PRODUCTS } from "@/lib/db/seed-data";
import { useDebounce } from "@/lib/performance/useDebounce";
import { NICE_SHOP_LOCATION } from "@/lib/location/shop-location";
import {
  Instagram,
  Menu,
  MessageCircle,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  sectionId: string;
  category?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    href: "/",
    sectionId: "hero-cinematic-section",
  },
  {
    label: "Our Story",
    href: "/#our-story-section",
    sectionId: "our-story-section",
  },
  {
    label: "Flavours",
    href: "/#flavour-catalogue",
    sectionId: "flavour-catalogue",
    category: "all",
  },
  {
    label: "Sundaes & Desserts",
    href: "/#flavour-catalogue",
    sectionId: "flavour-catalogue",
    category: "ice-cream-sundaes",
  },
  {
    label: "Shakes",
    href: "/#flavour-catalogue",
    sectionId: "flavour-catalogue",
    category: "premium-shakes",
  },
  {
    label: "Party Orders",
    href: "/#party-orders-section",
    sectionId: "party-orders-section",
  },
  {
    label: "Contact",
    href: "/#parlour-location",
    sectionId: "parlour-location",
  },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, total, setCartDrawerOpen, openProductModal } = useCart();

  const [inHeroSection, setInHeroSection] = useState(true);
  const [activeNavLabel, setActiveNavLabel] = useState<string>("Home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 180);

  // Keep navbar transparent ONLY while the dark 12-shot hero video fills the header area
  const isHomeHero = pathname === "/" && inHeroSection;

  // Prefetch core routes on mount for zero-latency route switches
  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/menu");
    router.prefetch("/about");
    router.prefetch("/party-orders");
    router.prefetch("/contact");
  }, [router]);

  useEffect(() => {
    const checkScrollState = () => {
      if (pathname !== "/") {
        setInHeroSection(false);
        if (pathname.startsWith("/about")) setActiveNavLabel("Our Story");
        else if (pathname.startsWith("/menu")) setActiveNavLabel("Flavours");
        else if (pathname.startsWith("/party-orders"))
          setActiveNavLabel("Party Orders");
        else if (pathname.startsWith("/contact")) setActiveNavLabel("Contact");
        return;
      }

      const heroEl = document.getElementById("hero-cinematic-section");
      if (heroEl) {
        const heroRect = heroEl.getBoundingClientRect();
        // Switch from transparent to solid ivory header BEFORE the blue strip reaches the top
        setInHeroSection(heroRect.bottom > 68);
      } else {
        setInHeroSection(window.scrollY < window.innerHeight * 5.2);
      }

      // Scroll-spy for active section on "/"
      const contactEl = document.getElementById("parlour-location");
      const partyEl = document.getElementById("party-orders-section");
      const catEl = document.getElementById("flavour-catalogue");
      const storyEl = document.getElementById("our-story-section");

      if (contactEl && contactEl.getBoundingClientRect().top <= 180) {
        setActiveNavLabel("Contact");
      } else if (partyEl && partyEl.getBoundingClientRect().top <= 180) {
        setActiveNavLabel("Party Orders");
      } else if (catEl && catEl.getBoundingClientRect().top <= 180) {
        setActiveNavLabel((prev) =>
          prev === "Sundaes & Desserts" || prev === "Shakes"
            ? prev
            : "Flavours"
        );
      } else if (storyEl && storyEl.getBoundingClientRect().top <= 180) {
        setActiveNavLabel("Our Story");
      } else {
        setActiveNavLabel("Home");
      }
    };

    checkScrollState();
    window.addEventListener("scroll", checkScrollState, { passive: true });
    window.addEventListener("resize", checkScrollState);
    return () => {
      window.removeEventListener("scroll", checkScrollState);
      window.removeEventListener("resize", checkScrollState);
    };
  }, [pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
      setActiveNavLabel(item.label);
      setMobileMenuOpen(false);

      // Dispatch category filter immediately if applicable
      if (item.category) {
        window.dispatchEvent(
          new CustomEvent("nice:select-category", {
            detail: { category: item.category },
          })
        );
      }

      if (item.sectionId === "hero-cinematic-section" && pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const targetEl = document.getElementById(item.sectionId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 68;
        const targetTop =
          targetEl.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: "smooth",
        });

        // Re-fire category selection after scroll begins in case CatalogueSection just mounted
        if (item.category) {
          setTimeout(() => {
            window.dispatchEvent(
              new CustomEvent("nice:select-category", {
                detail: { category: item.category },
              })
            );
          }, 60);
        }
      }
    },
    [pathname]
  );

  const quickSearchResults = useMemo(() => {
    const q = debouncedSearchTerm.trim().toLowerCase();
    if (!q) return [];
    return INITIAL_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category_name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [debouncedSearchTerm]);

  const handleDirectWhatsApp = () => {
    if (itemCount > 0) {
      setCartDrawerOpen(true);
    } else {
      const msg = encodeURIComponent(
        "Hello NICE ICE CREAMS! I would like to place an order from your menu."
      );
      window.open(
        `https://wa.me/919985422222?text=${msg}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-200 ${
          isHomeHero
            ? "bg-transparent text-white border-none shadow-none"
            : "bg-gradient-to-r from-[#FFFDF9]/95 via-[#FFF5F8]/95 to-[#F4F9FF]/95 backdrop-blur-md text-cinema-900 border-b border-[#FBCFE8]/70 shadow-sm"
        }`}
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
          {/* Left: Official NICE ICE CREAMS Brand Lockup */}
          <Link
            href="/"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                setActiveNavLabel("Home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center gap-2 shrink-0 whitespace-nowrap group focus:outline-none"
            aria-label="NICE ICE CREAMS — Home"
          >
            <img
              src="/brand/nice_ice_cream_logo.png"
              alt="NICE ICE CREAMS Logo"
              width={40}
              height={40}
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl object-contain bg-white/95 p-0.5 shadow-sm group-hover:scale-105 transition-transform"
            />
            <div className="leading-tight whitespace-nowrap">
              <span
                className={`block text-[8px] font-extrabold uppercase tracking-[0.22em] ${
                  isHomeHero
                    ? "text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]"
                    : "text-[#BE123C]"
                }`}
              >
                Since 1986
              </span>
              <span
                className={`font-display text-sm sm:text-base font-black tracking-tight ${
                  isHomeHero
                    ? "text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
                    : "bg-gradient-to-r from-[#0064B5] via-[#7E22CE] to-[#BE123C] bg-clip-text text-transparent"
                }`}
              >
                NICE ICE CREAMS
              </span>
            </div>
          </Link>

          {/* Center: Instant Section Navigation with Smooth Sliding Underline */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 bg-transparent"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeNavLabel === item.label;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`relative whitespace-nowrap inline-flex items-center justify-center rounded-full px-2.5 xl:px-3 py-1.5 text-xs xl:text-[13px] font-bold tracking-wide transition-colors ${
                    isActive
                      ? isHomeHero
                        ? "text-white drop-shadow-[0_1px_5px_rgba(0,0,0,0.95)]"
                        : "text-[#BE123C]"
                      : isHomeHero
                      ? "text-white/90 hover:text-white drop-shadow-[0_1px_5px_rgba(0,0,0,0.95)]"
                      : "text-cinema-800 hover:text-[#BE123C]"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeNavbarUnderline"
                      transition={{
                        type: "spring",
                        stiffness: 360,
                        damping: 30,
                      }}
                      className={`absolute bottom-0.5 left-2.5 right-2.5 h-0.5 rounded-full ${
                        isHomeHero
                          ? "bg-white"
                          : "bg-gradient-to-r from-[#E11D48] via-[#D97706] to-[#0064B5]"
                      }`}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Search, Cart, and Small Round WhatsApp Icon */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search flavours and desserts"
              className={`h-9 w-9 rounded-full inline-flex items-center justify-center shrink-0 transition ${
                isHomeHero
                  ? "bg-transparent hover:bg-white/10 text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]"
                  : "bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]"
              }`}
            >
              <Search className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Cart Button with Live Item Count */}
            <button
              type="button"
              onClick={() => setCartDrawerOpen(true)}
              aria-label={`Open shopping cart (${itemCount} items)`}
              className={`whitespace-nowrap relative h-9 px-2.5 rounded-full inline-flex items-center gap-1.5 font-bold text-xs shrink-0 transition ${
                isHomeHero
                  ? "bg-transparent hover:bg-white/10 text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]"
                  : "bg-[#FFFBEB] hover:bg-[#FEF3C7] text-cinema-900 border border-[#FDE68A]"
              }`}
            >
              <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span
                aria-live="polite"
                className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-[#E11D48] to-[#0064B5] text-white px-1.5 text-[10px] font-extrabold"
              >
                {itemCount}
              </span>
            </button>

            {/* Official Instagram Icon Link */}
            <a
              href={NICE_SHOP_LOCATION.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit NICE ICE CREAMS on Instagram (@nice_ice_creams)"
              title="Follow @nice_ice_creams on Instagram"
              className="cursor-pointer h-9 w-9 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white inline-flex items-center justify-center shrink-0 shadow-sm hover:scale-105 transition-transform"
            >
              <Instagram className="w-4 h-4 text-white" aria-hidden="true" />
            </a>

            {/* Small Round WhatsApp Message Icon */}
            <button
              type="button"
              onClick={handleDirectWhatsApp}
              aria-label="Order on WhatsApp"
              title="Order on WhatsApp"
              className="cursor-pointer h-9 w-9 rounded-full bg-[#25D366] hover:bg-[#1EBE5B] text-white inline-flex items-center justify-center shrink-0 shadow-sm hover:scale-105 transition-transform"
            >
              <MessageCircle
                className="w-4 h-4 fill-white text-[#25D366]"
                aria-hidden="true"
              />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              className={`lg:hidden h-9 w-9 rounded-full inline-flex items-center justify-center shrink-0 transition ${
                isHomeHero
                  ? "bg-transparent text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]"
                  : "bg-ivory-200 text-cinema-900"
              }`}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Instant Global Flavour Search Bar Overlay */}
        {searchOpen && (
          <div className="bg-ivory-50/95 backdrop-blur-md text-cinema-900 border-t border-ivory-300 shadow-xl px-4 py-4 animate-fadeIn max-h-[75vh] overflow-y-auto custom-scrollbar overscroll-contain">
            <div className="max-w-3xl mx-auto space-y-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = searchTerm.trim();
                  if (q) {
                    setSearchOpen(false);
                    const catEl = document.getElementById("flavour-catalogue");
                    if (catEl) {
                      window.dispatchEvent(
                        new CustomEvent("nice:select-category", {
                          detail: { category: "all", search: q },
                        })
                      );
                      const top =
                        catEl.getBoundingClientRect().top + window.scrollY - 68;
                      window.scrollTo({ top, behavior: "smooth" });
                    } else {
                      router.push(`/menu?search=${encodeURIComponent(q)}`);
                    }
                  }
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <Search
                    className="w-4 h-4 text-cinema-800/50 absolute left-3.5 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    autoFocus
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search all 49 flavours, sundaes, shakes (e.g., Death by Chocolate, Sitaphal)..."
                    className="w-full rounded-full border border-ivory-300 bg-white pl-10 pr-4 py-2.5 text-sm text-cinema-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="rounded-full px-3 py-2 text-xs font-bold text-cinema-800 hover:bg-ivory-200"
                >
                  Close
                </button>
              </form>

              {quickSearchResults.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {quickSearchResults.map((prod) => (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => {
                        setSearchOpen(false);
                        openProductModal(prod, false);
                      }}
                      className="flex items-center gap-3 rounded-2xl bg-white hover:bg-ivory-100 border border-ivory-300 p-2.5 text-left transition"
                    >
                      <img
                        src={prod.image_url}
                        alt={prod.name}
                        width={44}
                        height={44}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.currentTarget.src = "/menu/vanilla.webp?v=4";
                        }}
                        className="h-11 w-11 rounded-xl object-cover shrink-0 bg-ivory-100"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-cinema-900 leading-snug break-words">
                          {prod.name}
                        </div>
                        <div className="text-[11px] text-cinema-800/70 leading-snug">
                          {prod.category_name}
                        </div>
                      </div>
                      <div className="text-xs font-extrabold text-brand-blue shrink-0">
                        ₹{prod.price}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Accessible Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="fixed inset-0 z-50 lg:hidden bg-black/65 backdrop-blur-sm flex justify-end overscroll-contain"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileMenuOpen(false);
          }}
        >
          <nav className="w-[min(22rem,84vw)] bg-ivory-50 text-cinema-900 h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto custom-scrollbar overscroll-contain">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-ivory-300 pb-4">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/brand/nice_ice_cream_logo.png"
                    alt="NICE ICE CREAMS"
                    className="h-10 w-10 rounded-lg object-contain bg-white p-0.5 border border-ivory-300"
                  />
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-widest text-brand-indigo">
                      Est. 1986
                    </div>
                    <div className="font-display font-black text-base text-brand-blue">
                      NICE ICE CREAMS
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close mobile menu"
                  className="h-9 w-9 rounded-full bg-ivory-200 inline-flex items-center justify-center text-cinema-900"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <ul className="space-y-1.5">
                {NAV_ITEMS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item)}
                      className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold text-cinema-900 hover:bg-brand-blue/10 hover:text-brand-blue transition"
                    >
                      <span>{item.label}</span>
                      <span className="text-xs text-brand-blue">→</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-2xl px-4 py-3 text-xs font-semibold text-cinema-800/70 hover:bg-ivory-200 transition"
                  >
                    <span>Staff Admin Portal</span>
                    <span>→</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5 pt-6 border-t border-ivory-300">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleDirectWhatsApp();
                }}
                className="cursor-pointer w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white px-5 py-3 text-sm font-extrabold shadow-md"
              >
                <MessageCircle
                  className="w-4 h-4 fill-white text-[#25D366]"
                  aria-hidden="true"
                />
                <span>Order on WhatsApp</span>
              </button>
              <a
                href={NICE_SHOP_LOCATION.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="cursor-pointer w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white px-5 py-3 text-sm font-extrabold shadow-md"
              >
                <Instagram className="w-4 h-4 text-white" aria-hidden="true" />
                <span>Instagram ({NICE_SHOP_LOCATION.instagramHandle})</span>
              </a>
              <div className="text-center text-[11px] text-cinema-800/70">
                Call for Party Orders: +91 99854 22222 • +91 73061 42993
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* Mobile Sticky Bottom Action Bar when items are in the cart */}
      {itemCount > 0 && (
        <div className="fixed bottom-3 inset-x-3 z-30 sm:hidden">
          <button
            type="button"
            onClick={() => setCartDrawerOpen(true)}
            className="w-full flex items-center justify-between rounded-2xl bg-gradient-to-r from-brand-blue via-brand-royal to-brand-indigo text-white px-4 py-3.5 shadow-2xl border border-white/20"
          >
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-brand-blue text-xs font-black">
                {itemCount}
              </span>
              <div className="text-left">
                <div className="text-xs font-extrabold">
                  View Multi-Item Order Cart
                </div>
                <div className="text-[10px] text-ivory-200">
                  Ready for WhatsApp Checkout
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-black">
              <span>₹{total}</span>
              <Sparkles
                className="w-4 h-4 text-flavour-mango"
                aria-hidden="true"
              />
            </div>
          </button>
        </div>
      )}
    </>
  );
}
