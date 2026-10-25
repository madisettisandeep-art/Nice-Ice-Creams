"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Category, Product } from "@/lib/db/types";
import { ProductCard } from "./ProductCard";
import { CatalogueSkeletonGrid } from "./ProductCardSkeleton";
import { SignatureSlider } from "./SignatureSlider";
import { FloatingFlavourUniverse } from "./FloatingFlavourUniverse";
import { useCart } from "@/components/cart/CartContext";
import { trackEvent } from "@/lib/analytics/tracker";
import {
  fetchWithClientCache,
  useDebounce,
} from "@/lib/performance/useDebounce";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
  UtensilsCrossed,
  X,
} from "lucide-react";

const PAGE_SIZE = 16;

const CATEGORY_SECTION_BACKDROPS: Record<
  string,
  { wrapper: string; badge: string; pillActive: string }
> = {
  "classic-flavours": {
    wrapper:
      "bg-gradient-to-br from-[#F0FDF4] via-[#FFFDF9] to-[#DCFCE7]/70 border-[#BBF7D0]",
    badge: "bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]",
    pillActive: "bg-gradient-to-r from-[#10B981] to-[#059669]",
  },
  "premium-flavours": {
    wrapper:
      "bg-gradient-to-br from-[#FFFBEB] via-[#FFFDF9] to-[#FEF3C7]/75 border-[#FDE68A]",
    badge: "bg-[#FEF3C7] text-[#B45309] border-[#FCD34D]",
    pillActive: "bg-gradient-to-r from-[#F59E0B] to-[#D97706]",
  },
  "chocolate-flavours": {
    wrapper:
      "bg-gradient-to-br from-[#FDF5EE] via-[#FFFDF9] to-[#F5E6D8]/80 border-[#E6C7B0]",
    badge: "bg-[#F5E6D8] text-[#5C2C16] border-[#D7B399]",
    pillActive: "bg-gradient-to-r from-[#7C2D12] to-[#4E2614]",
  },
  "fruit-seasonal": {
    wrapper:
      "bg-gradient-to-br from-[#FFF7ED] via-[#FFFDF9] to-[#FFEDD5]/80 border-[#FED7AA]",
    badge: "bg-[#FFEDD5] text-[#C2410C] border-[#FDBA74]",
    pillActive: "bg-gradient-to-r from-[#F97316] to-[#E11D48]",
  },
  "dessert-inspired": {
    wrapper:
      "bg-gradient-to-br from-[#FAF5FF] via-[#FFFDF9] to-[#F3E8FF]/80 border-[#E9D5FF]",
    badge: "bg-[#F3E8FF] text-[#7E22CE] border-[#D8B4FE]",
    pillActive: "bg-gradient-to-r from-[#9333EA] to-[#DB2777]",
  },
  "specials-signature": {
    wrapper:
      "bg-gradient-to-br from-[#FFF1F2] via-[#FFFDF9] to-[#FFE4E6]/80 border-[#FECDD3]",
    badge: "bg-[#FFE4E6] text-[#BE123C] border-[#FDA4AF]",
    pillActive: "bg-gradient-to-r from-[#E11D48] to-[#BE185D]",
  },
  "premium-shakes": {
    wrapper:
      "bg-gradient-to-br from-[#ECFEFF] via-[#FFFDF9] to-[#E0F2FE]/80 border-[#BAE6FD]",
    badge: "bg-[#E0F2FE] text-[#0369A1] border-[#7DD3FC]",
    pillActive: "bg-gradient-to-r from-[#0284C7] to-[#6366F1]",
  },
  "ice-cream-sundaes": {
    wrapper:
      "bg-gradient-to-br from-[#FDF2F8] via-[#FFFDF9] to-[#EEF2FF]/80 border-[#FBCFE8]",
    badge: "bg-[#FCE7F3] text-[#BE185D] border-[#F9A8D4]",
    pillActive: "bg-gradient-to-r from-[#E11D48] via-[#C026D3] to-[#4F46E5]",
  },
};

interface CatalogueSectionProps {
  initialCategories: Category[];
  initialProducts: Product[];
  initialCategorySlug?: string;
  initialSearch?: string;
  showHeading?: boolean;
}

export function CatalogueSection({
  initialCategories,
  initialProducts,
  initialCategorySlug = "all",
  initialSearch = "",
  showHeading = true,
}: CatalogueSectionProps) {
  const { syncWithCatalogue } = useCart();
  const categoryBarRef = useRef<HTMLDivElement>(null);

  const [categories] = useState<Category[]>(initialCategories);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState<boolean>(
    initialProducts.length === 0
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategorySlug || "all"
  );
  const [slideDirection, setSlideDirection] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const debouncedSearchQuery = useDebounce(searchQuery, 200);

  const [sortBy, setSortBy] = useState<
    "menu-order" | "price-asc" | "price-desc" | "name-asc"
  >("menu-order");
  const [onlySeasonal, setOnlySeasonal] = useState(false);
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  // Sync with live server catalogue using ETag client cache & compressed payload
  useEffect(() => {
    let active = true;
    fetchWithClientCache<{ products?: Product[] }>(
      "/api/products?compact=true",
      60_000
    )
      .then((data) => {
        if (!active) return;
        if (data?.products?.length) {
          setProducts(data.products);
          syncWithCatalogue(data.products);
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (!active) return;
        syncWithCatalogue(initialProducts);
        setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [initialProducts, syncWithCatalogue]);

  useEffect(() => {
    if (initialCategorySlug && initialCategorySlug !== "all") {
      setSelectedCategory(initialCategorySlug);
    } else if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get("category");
      const searchParam = params.get("search");
      if (catParam) setSelectedCategory(catParam);
      if (searchParam) setSearchQuery(searchParam);
    }
  }, [initialCategorySlug]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [
    selectedCategory,
    debouncedSearchQuery,
    sortBy,
    onlySeasonal,
    onlyFeatured,
  ]);

  const handleCategoryChange = useCallback(
    (slug: string) => {
      const orderList = ["all", ...categories.map((c) => c.slug)];
      const prevIdx = orderList.indexOf(selectedCategory);
      const nextIdx = orderList.indexOf(slug);
      setSlideDirection(nextIdx >= prevIdx ? 1 : -1);
      setSelectedCategory(slug);
      setSearchQuery("");
      setOnlyFeatured(false);
      setOnlySeasonal(false);
      trackEvent("menu_category_selected", { category_slug: slug });
    },
    [categories, selectedCategory]
  );

  // Instant 0ms listener for navbar tab clicks (Flavours, Sundaes & Desserts, Shakes)
  useEffect(() => {
    const onSelectCategory = (e: Event) => {
      const custom = e as CustomEvent<{ category?: string; search?: string }>;
      if (custom.detail?.category) {
        handleCategoryChange(custom.detail.category);
      }
      if (typeof custom.detail?.search === "string") {
        setSearchQuery(custom.detail.search);
      }
    };
    window.addEventListener("nice:select-category", onSelectCategory);
    return () => {
      window.removeEventListener("nice:select-category", onSelectCategory);
    };
  }, [handleCategoryChange]);

  const slideCategoryBar = (dir: -1 | 1) => {
    if (!categoryBarRef.current) return;
    categoryBarRef.current.scrollBy({
      left: dir * 280,
      behavior: "smooth",
    });
  };

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) {
      map.set(p.category_slug, (map.get(p.category_slug) ?? 0) + 1);
    }
    return map;
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = debouncedSearchQuery.toLowerCase().trim();
    const list = products.filter((p) => {
      if (selectedCategory !== "all" && p.category_slug !== selectedCategory) {
        return false;
      }
      if (onlySeasonal && !p.seasonal) return false;
      if (onlyFeatured && !p.featured) return false;
      if (q) {
        const inName = p.name.toLowerCase().includes(q);
        const inDesc = p.description.toLowerCase().includes(q);
        const inCat = p.category_name.toLowerCase().includes(q);
        const inIng = (p.ingredients || []).some((i) => i.toLowerCase().includes(q));
        if (!inName && !inDesc && !inCat && !inIng) return false;
      }
      return true;
    });

    if (sortBy === "price-asc") {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-desc") {
      return [...list].sort((a, b) => b.price - a.price);
    }
    if (sortBy === "name-asc") {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [
    products,
    selectedCategory,
    onlySeasonal,
    onlyFeatured,
    debouncedSearchQuery,
    sortBy,
  ]);

  const paginatedFlatProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  return (
    <section
      id="flavour-catalogue"
      className="scroll-mt-16 relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Decorative Soft Ambient Pastel Orbs Behind the Catalogue */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-20 -left-32 h-96 w-96 rounded-full bg-[#FFE4EC] blur-3xl opacity-65"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-96 -right-32 h-96 w-96 rounded-full bg-[#FEF3C7] blur-3xl opacity-65"
      />

      {showHeading && (
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            type: "spring",
            stiffness: 170,
            damping: 24,
          }}
          className="relative z-10 text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FFF0F5] via-[#FFF8EB] to-[#ECFDF5] border border-rose-200 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-[#C2185B] shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
            <span>The Complete 1986 Heritage Menu</span>
          </div>
          <h2
            className="font-display text-3xl sm:text-5xl font-bold text-cinema-900 tracking-tight"
            style={{ textWrap: "balance" }}
          >
            49 Handcrafted{" "}
            <span className="bg-gradient-to-r from-[#E11D48] via-[#D97706] to-[#7C3AED] bg-clip-text text-transparent">
              Scoops, Sundaes, Shakes
            </span>{" "}
            &amp; Signature Specials
          </h2>
          <p className="text-sm sm:text-base text-cinema-800/80 leading-relaxed">
            Every creation is made with pure milk and fresh dairy cream. Tap any dessert to view its serving options, ingredients, and slide through our signature flavours or add multiple items to your WhatsApp order.
          </p>
        </motion.div>
      )}

      {/* Floating Flavour Universe: Reelmark 3D Curved Cylinder Carousel containing all 49 flavours */}
      {showHeading && <FloatingFlavourUniverse products={products} />}

      {/* Search, Sort & Sliding Category Pill Bar */}
      <motion.div
        id="flavour-catalogue-grid"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="sticky top-14 sm:top-16 z-30 rounded-3xl bg-gradient-to-r from-[#FFF7F9]/95 via-[#FFFDF7]/95 to-[#F2FBF7]/95 backdrop-blur-md border border-rose-200/80 shadow-card p-2.5 sm:p-3.5 mb-8 space-y-2.5"
      >
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
          {/* Search Input (Debounced) */}
          <div className="relative flex-1">
            <Search
              className="w-4 h-4 text-[#C2185B]/70 absolute left-3.5 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search flavours, sundaes, shakes, ingredients (e.g. Sitaphal, Brownie, Ferrero)..."
              aria-label="Search menu products by name or ingredient"
              className="w-full rounded-full bg-white border border-rose-200/90 pl-10 pr-9 py-2 text-sm text-cinema-900 placeholder:text-cinema-800/45 focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search query"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cinema-800/60 hover:text-cinema-900"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Filter Toggles & Sort Dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyFeatured((v) => !v)}
              className={`rounded-full px-3.5 py-2 text-xs font-extrabold border transition ${
                onlyFeatured
                  ? "bg-gradient-to-r from-[#E11D48] to-[#9333EA] text-white border-transparent shadow-sm"
                  : "bg-white text-[#BE185D] border-rose-200 hover:border-[#E11D48]"
              }`}
            >
              ★ Signature Picks
            </button>

            <button
              type="button"
              onClick={() => setOnlySeasonal((v) => !v)}
              className={`rounded-full px-3.5 py-2 text-xs font-extrabold border transition ${
                onlySeasonal
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent shadow-sm"
                  : "bg-[#FFFBEB] text-[#B45309] border-amber-300 hover:border-amber-500"
              }`}
            >
              🥭 Seasonal Fruit
            </button>

            <div className="relative inline-flex items-center">
              <ArrowUpDown
                className="w-3.5 h-3.5 text-[#7E22CE] absolute left-3 pointer-events-none"
                aria-hidden="true"
              />
              <select
                aria-label="Sort menu products"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as
                      | "menu-order"
                      | "price-asc"
                      | "price-desc"
                      | "name-asc"
                  )
                }
                className="rounded-full bg-white border border-purple-200 pl-8 pr-4 py-2 text-xs font-bold text-cinema-900 focus:outline-none focus:ring-2 focus:ring-[#9333EA]"
              >
                <option value="menu-order">Sort: Menu Category</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Horizontal Sliding Category Pill Bar with Layout-Animated Active Pill */}
        <div className="relative flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => slideCategoryBar(-1)}
            aria-label="Slide categories left"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white hover:bg-[#E11D48] hover:text-white text-cinema-800 border border-rose-200 shadow-sm transition"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>

          <div
            ref={categoryBarRef}
            role="tablist"
            aria-label="Menu categories"
            className="flex-1 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategory === "all"}
              onClick={() => handleCategoryChange("all")}
              className={`relative shrink-0 rounded-full px-4 py-2 text-xs font-extrabold transition ${
                selectedCategory === "all"
                  ? "text-white"
                  : "bg-white text-cinema-800 border border-rose-200/70 hover:bg-rose-50"
              }`}
            >
              {selectedCategory === "all" && (
                <motion.span
                  layoutId="activeCategoryPill"
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#E11D48] via-[#D97706] to-[#7C3AED] shadow"
                />
              )}
              <span className="relative z-10">
                All Categories ({products.length})
              </span>
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              const count = categoryCounts.get(cat.slug) ?? 0;
              const catBackdrop = CATEGORY_SECTION_BACKDROPS[cat.slug];
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`relative shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
                    isSelected
                      ? "text-white"
                      : "bg-white text-cinema-800 border border-ivory-300 hover:bg-amber-50/70"
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="activeCategoryPill"
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 28,
                      }}
                      className={`absolute inset-0 rounded-full shadow ${
                        catBackdrop?.pillActive ||
                        "bg-gradient-to-r from-[#E11D48] to-[#7C3AED]"
                      }`}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: isSelected
                          ? "#ffffff"
                          : cat.accent_color,
                      }}
                    />
                    <span>
                      {cat.name} ({count})
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => slideCategoryBar(1)}
            aria-label="Slide categories right"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white hover:bg-[#E11D48] hover:text-white text-cinema-800 border border-rose-200 shadow-sm transition"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </motion.div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-cinema-800/70 mb-6 px-1">
        <span>
          Showing{" "}
          <strong className="text-cinema-900">{filteredProducts.length}</strong>{" "}
          {filteredProducts.length === 1 ? "creation" : "creations"}
        </span>
        {(selectedCategory !== "all" ||
          searchQuery ||
          onlyFeatured ||
          onlySeasonal) && (
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
              setOnlyFeatured(false);
              setOnlySeasonal(false);
              setSortBy("menu-order");
            }}
            className="font-bold text-[#E11D48] hover:underline"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Loading Skeletons 💀 */}
      {isLoading ? (
        <CatalogueSkeletonGrid count={8} />
      ) : filteredProducts.length === 0 ? (
        /* Empty Search State */
        <div className="rounded-3xl bg-white border border-rose-200 p-12 text-center max-w-lg mx-auto space-y-4">
          <UtensilsCrossed
            className="w-10 h-10 text-[#E11D48] mx-auto opacity-75"
            aria-hidden="true"
          />
          <h3 className="font-display text-2xl font-bold text-cinema-900">
            No Matching Flavours Found
          </h3>
          <p className="text-sm text-cinema-800/75">
            We couldn&apos;t find any menu items matching &ldquo;{searchQuery}&rdquo;. Try searching for Vanilla, Death by Chocolate, Sitaphal, or Oreo Shake.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
              setOnlyFeatured(false);
              setOnlySeasonal(false);
            }}
            className="inline-flex items-center rounded-full bg-gradient-to-r from-[#E11D48] to-[#D97706] text-white px-5 py-2.5 text-xs font-extrabold shadow"
          >
            Show All 49 Menu Items
          </button>
        </div>
      ) : selectedCategory === "all" &&
        !debouncedSearchQuery &&
        !onlyFeatured &&
        !onlySeasonal &&
        sortBy === "menu-order" ? (
        /* Grouped by Category with Bespoke Pastel Flavour Backdrops */
        <div className="space-y-12">
          {categories.map((cat, catIdx) => {
            const catProducts = filteredProducts.filter(
              (p) => p.category_slug === cat.slug
            );
            if (catProducts.length === 0) return null;
            const sectionTheme = CATEGORY_SECTION_BACKDROPS[cat.slug] || {
              wrapper: "bg-white/70 border-ivory-300",
              badge: "bg-rose-100 text-rose-800 border-rose-200",
              pillActive: "bg-brand-blue",
            };
            return (
              <div
                key={cat.id}
                id={`category-${cat.slug}`}
                className={`scroll-mt-36 rounded-[2rem] border p-5 sm:p-8 shadow-sm space-y-6 ${
                  sectionTheme.wrapper
                } ${catIdx > 0 ? "cv-auto" : ""}`}
              >
                <motion.div
                  initial={{ opacity: 0, x: -36 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    type: "spring",
                    stiffness: 180,
                    damping: 24,
                  }}
                  className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-cinema-900/10 pb-4"
                >
                  <div className="space-y-1.5">
                    <div
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-widest ${sectionTheme.badge}`}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: cat.accent_color }}
                      />
                      <span>Menu Collection</span>
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-cinema-900">
                      {cat.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-cinema-800/80">
                      {cat.subtitle}
                    </p>
                  </div>
                  <span
                    className={`self-start sm:self-auto rounded-full border px-3 py-1 text-xs font-extrabold ${sectionTheme.badge}`}
                  >
                    {catProducts.length} creations
                  </span>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {catProducts.map((product, idx) => (
                    <ProductCard key={product.id} product={product} index={idx} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Paginated Filtered / Sorted Flat Grid with Directional Slide Transition */
        <div className="space-y-10 overflow-hidden">
          <AnimatePresence mode="wait" custom={slideDirection}>
            <motion.div
              key={`${selectedCategory}-${sortBy}-${onlyFeatured}-${onlySeasonal}`}
              custom={slideDirection}
              initial={{ opacity: 0, x: slideDirection * 64 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: slideDirection * -64 }}
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 26,
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {paginatedFlatProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination Control for Large Filtered Lists */}
          {visibleCount < filteredProducts.length && (
            <div className="flex flex-col items-center justify-center gap-2 pt-4">
              <p className="text-xs text-cinema-800/70">
                Displaying{" "}
                <strong className="text-cinema-900">
                  {paginatedFlatProducts.length}
                </strong>{" "}
                of{" "}
                <strong className="text-cinema-900">
                  {filteredProducts.length}
                </strong>{" "}
                creations
              </p>
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((prev) =>
                    Math.min(prev + PAGE_SIZE, filteredProducts.length)
                  )
                }
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#E11D48] via-[#D97706] to-[#7C3AED] text-white px-6 py-3 text-xs font-extrabold shadow-card transition hover:scale-105"
              >
                <span>
                  Load More Creations (
                  {filteredProducts.length - paginatedFlatProducts.length}{" "}
                  remaining)
                </span>
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
