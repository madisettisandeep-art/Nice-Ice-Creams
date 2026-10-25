"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Product } from "@/lib/db/types";
import { useCart } from "@/components/cart/CartContext";
import { Sparkles, MessageCircle, ArrowDown } from "lucide-react";

interface FloatingFlavourUniverseProps {
  products: Product[];
}

export function FloatingFlavourUniverse({ products }: FloatingFlavourUniverseProps) {
  const { openProductModal } = useCart();
  const stageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const scrollOffsetRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const lastDragXRef = useRef(0);
  const lastDragTimeRef = useRef(0);
  const wasDraggedRef = useRef(false);
  const lastFrameTimeRef = useRef(0);
  const cardDomNodesRef = useRef<(HTMLDivElement | null)[]>([]);

  // Check reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Curved Cylinder Carousel Update Math
  const updateCardTransforms = useCallback(() => {
    const stage = stageRef.current;
    if (!stage || products.length === 0) return;

    const stageRect = stage.getBoundingClientRect();
    const stageWidth = stageRect.width || 1440;
    const stageHeight = stageRect.height || 440;
    const isMobile = window.innerWidth <= 820;

    let u = Math.min(window.innerWidth / 1440, window.innerHeight / 1080);
    if (isMobile) {
      u = Math.min(window.innerWidth / 640, 1);
    }
    if (u < 0.45) u = 0.45;

    const centerPoint = stageWidth / 2;
    const basePitch = (isMobile ? 130 : 196) * u;
    const totalCount = products.length;
    const trackLength = totalCount * basePitch;

    const offset = scrollOffsetRef.current % trackLength;

    cardDomNodesRef.current.forEach((card, idx) => {
      if (!card) return;

      // Unpushed position relative to center
      let t = (idx * basePitch - offset) % trackLength;
      if (t < -trackLength / 2) t += trackLength;
      if (t > trackLength / 2) t -= trackLength;

      // Cull cards far outside visible viewport for 60fps performance
      const maxRange = stageWidth / 2 + 180 * u;
      if (Math.abs(t) > maxRange) {
        card.style.display = "none";
        return;
      }
      card.style.display = "block";

      // Mathematical Model:
      // Horizontal curve: x = 720 + t * (1 + 0.083 * (t / 706)^2)
      const normFactor = 706 * u;
      const tNorm = t / (normFactor || 1);
      const x = centerPoint + t * (1 + 0.083 * (tNorm * tNorm));

      // Normalised distance d = abs(x - center) / 706u
      const d = Math.abs(x - centerPoint) / normFactor;

      // Card width: (170 + 48 * d^2)u
      const cardW = (170 + 48 * (d * d)) * u;

      // Vertical center: (687 - 12 * d^2)u - mapped to local stage coordinate
      const stageCenterY = stageHeight * 0.48;
      const yCenter = stageCenterY - 12 * (d * d) * u;

      // Left & right edge distances from center for perspective trapezoid
      const xLeft = x - cardW / 2;
      const xRight = x + cardW / 2;
      const qLeft = Math.abs(xLeft - centerPoint) / normFactor;
      const qRight = Math.abs(xRight - centerPoint) / normFactor;

      // Edge height: (280 + 92 * q^2.6)u
      const hLeft = (280 + 92 * Math.pow(qLeft, 2.6)) * u;
      const hRight = (280 + 92 * Math.pow(qRight, 2.6)) * u;
      const maxH = Math.max(hLeft, hRight);

      // Inward facing yaw angle
      const rotY = -(tNorm * 22);

      // Dynamic z-index
      const zIndex = Math.round(100 - d * 30);

      // Apply 3D transform & sizing
      card.style.width = `${cardW.toFixed(1)}px`;
      card.style.height = `${maxH.toFixed(1)}px`;
      card.style.zIndex = `${zIndex}`;

      // Calculate clip-path quadrilateral polygon:
      const yTopLeft = (((maxH - hLeft) / 2 / maxH) * 100).toFixed(2);
      const yTopRight = (((maxH - hRight) / 2 / maxH) * 100).toFixed(2);
      const yBottomRight = (100 - ((maxH - hRight) / 2 / maxH) * 100).toFixed(2);
      const yBottomLeft = (100 - ((maxH - hLeft) / 2 / maxH) * 100).toFixed(2);

      const posX = (x - cardW / 2).toFixed(1);
      const posY = (yCenter - maxH / 2).toFixed(1);

      card.style.transform = `translate3d(${posX}px, ${posY}px, 0px) rotateY(${rotY.toFixed(1)}deg)`;
      card.style.clipPath = `polygon(0% ${yTopLeft}%, 100% ${yTopRight}%, 100% ${yBottomRight}%, 0% ${yBottomLeft}%)`;
    });
  }, [products.length]);

  // Animation Loop (requestAnimationFrame with auto-scroll and momentum decay)
  useEffect(() => {
    let rafId: number;
    lastFrameTimeRef.current = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min(0.1, (currentTime - lastFrameTimeRef.current) / 1000);
      lastFrameTimeRef.current = currentTime;

      if (!isDraggingRef.current && !isReducedMotion) {
        // Momentum decay
        if (Math.abs(velocityRef.current) > 0.5) {
          scrollOffsetRef.current += velocityRef.current * dt;
          velocityRef.current *= Math.pow(0.88, dt * 60);
        } else {
          // Auto-scroll (~48 reference units per sec)
          let u = Math.min(window.innerWidth / 1440, window.innerHeight / 1080);
          if (window.innerWidth <= 820) u = Math.min(window.innerWidth / 640, 1);
          const speed = 48 * (u > 0.5 ? u : 0.5);
          scrollOffsetRef.current += speed * dt;
        }
      }

      updateCardTransforms();
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [isReducedMotion, updateCardTransforms]);

  // Drag Gesture Listeners
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let dragDistance = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      wasDraggedRef.current = false;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      dragStartXRef.current = clientX;
      dragStartOffsetRef.current = scrollOffsetRef.current;
      lastDragXRef.current = clientX;
      lastDragTimeRef.current = performance.now();
      velocityRef.current = 0;
      dragDistance = 0;

      stage.classList.add("cursor-grabbing");
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const dx = clientX - dragStartXRef.current;
      dragDistance += Math.abs(clientX - lastDragXRef.current);

      if (dragDistance > 6) {
        wasDraggedRef.current = true;
      }

      scrollOffsetRef.current = dragStartOffsetRef.current - dx;

      const now = performance.now();
      const dt = (now - lastDragTimeRef.current) / 1000;
      if (dt > 0.008) {
        const instVel = -(clientX - lastDragXRef.current) / dt;
        velocityRef.current = instVel * 0.4 + velocityRef.current * 0.6;
        lastDragXRef.current = clientX;
        lastDragTimeRef.current = now;
      }
    };

    const onPointerUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      stage.classList.remove("cursor-grabbing");
    };

    stage.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    stage.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);
    window.addEventListener("touchcancel", onPointerUp);

    const onResize = () => updateCardTransforms();
    window.addEventListener("resize", onResize);

    return () => {
      stage.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      stage.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
      window.removeEventListener("touchcancel", onPointerUp);
      window.removeEventListener("resize", onResize);
    };
  }, [updateCardTransforms]);

  const scrollToGrid = () => {
    const grid = document.getElementById("flavour-catalogue-grid");
    if (grid) {
      grid.scrollIntoView({ behavior: isReducedMotion ? "auto" : "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#FFF9EF] pt-8 pb-16 px-4 select-none"
      style={{
        perspective: "1200px",
      }}
    >
      {/* Warm Ambient Radial Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#FFF0D6]/60 via-[#F5C4D0]/25 to-transparent blur-3xl rounded-full"
      />

      {/* Header Block */}
      <div className="relative z-20 text-center max-w-3xl mx-auto space-y-3 mb-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#F5C4D0]/45 border border-[#C84B68]/35 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#C84B68] shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#D9A15B]" aria-hidden="true" />
          <span>MADE FOR YOUR HAPPY MOMENTS</span>
        </div>

        <h2 className="font-display text-3xl sm:text-5xl font-black text-[#291A14] tracking-tight leading-tight">
          A World of Flavours.{" "}
          <span className="block text-[#C84B68] bg-gradient-to-r from-[#C84B68] via-[#E86B86] to-[#D9A15B] bg-clip-text text-transparent">
            One Scoop of Happiness.
          </span>
        </h2>

        <p className="text-sm sm:text-base text-[#291A14]/75 max-w-xl mx-auto leading-relaxed font-medium">
          From timeless classics to indulgent creations, discover the flavour that makes your moment special.
        </p>
      </div>

      {/* Hand-Drawn Decorative Notes (Caveat Font) */}
      <div
        className="pointer-events-none absolute inset-0 z-25 hidden md:block overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="absolute left-[8%] top-[45%] text-[#C84B68] text-2xl font-bold -rotate-6 filter drop-shadow-sm"
          style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
        >
          Find your happy flavour
        </span>
        <svg
          className="absolute left-[13%] top-[50%] w-28 h-20 text-[#C84B68] fill-none stroke-current stroke-2 opacity-85"
          viewBox="0 0 120 80"
        >
          <path d="M 15 15 Q 60 5 95 65" />
          <polyline points="85,60 95,65 98,52" />
        </svg>

        <span
          className="absolute left-1/2 -translate-x-1/2 top-[34%] text-[#D9A15B] text-2xl font-bold rotate-2 filter drop-shadow-sm"
          style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
        >
          A little scoop of joy ✨
        </span>

        <span
          className="absolute right-[8%] top-[45%] text-[#C84B68] text-2xl font-bold rotate-6 filter drop-shadow-sm"
          style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
        >
          Sweet moments start here
        </span>
        <svg
          className="absolute right-[13%] top-[50%] w-28 h-20 text-[#C84B68] fill-none stroke-current stroke-2 opacity-85 scale-x-[-1]"
          viewBox="0 0 120 80"
        >
          <path d="M 15 15 Q 60 5 95 65" />
          <polyline points="85,60 95,65 98,52" />
        </svg>
      </div>

      {/* 3D Curved Cylinder Carousel Stage */}
      <div className="relative w-full h-[400px] sm:h-[450px] my-4 overflow-visible">
        {/* Soft Left and Right Edge Vignette Fades */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#FFF9EF] via-[#FFF9EF]/80 to-transparent z-22" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#FFF9EF] via-[#FFF9EF]/80 to-transparent z-22" />

        <div
          ref={stageRef}
          role="region"
          aria-label="3D Curved Flavour Carousel containing all 49 flavours"
          className="relative w-full h-full cursor-grab active:cursor-grabbing touch-pan-y"
        >
          {products.map((prod, idx) => (
            <div
              key={prod.id}
              ref={(el) => {
                cardDomNodesRef.current[idx] = el;
              }}
              role="button"
              tabIndex={0}
              aria-label={`${prod.name}, ${prod.category_name}, ₹${prod.price}`}
              onClick={() => {
                if (wasDraggedRef.current) return;
                openProductModal(prod);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openProductModal(prod);
                }
              }}
              className="group absolute left-0 top-0 rounded-2xl overflow-hidden bg-white shadow-[0_16px_36px_rgba(41,26,20,0.16)] border border-white/80 hover:shadow-[0_24px_48px_rgba(200,75,104,0.28)] hover:border-[#C84B68]/60 transition-[box-shadow,border-color] duration-200 cursor-pointer will-change-transform"
            >
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={prod.image_url || `/menu/${prod.slug}.webp?v=4`}
                  alt={prod.name}
                  loading={idx < 10 ? "eager" : "lazy"}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-[#1A0F0B]/45 via-transparent to-[#1A0F0B]/90 pointer-events-none" />

                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                  <span className="rounded-full bg-white/90 backdrop-blur-sm text-[#291A14] text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 shadow-sm">
                    {prod.category_name.split(" ")[0]}
                  </span>
                  <span className="rounded-full bg-[#C84B68]/90 backdrop-blur-sm text-white text-[10px] font-black px-2 py-0.5 shadow-sm">
                    ₹{prod.price}
                  </span>
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex flex-col gap-0.5">
                  <div className="text-white text-xs sm:text-sm font-black truncate drop-shadow-md">
                    {prod.name}
                  </div>
                  <div className="flex items-center justify-between opacity-85">
                    <span className="text-[9px] font-semibold text-[#FFF0D6] uppercase tracking-wider">
                      Discover
                    </span>
                    <div className="h-5 w-5 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white text-[10px] group-hover:bg-[#C84B68] group-hover:translate-x-0.5 transition-all">
                      →
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Action Buttons */}
      <div className="relative z-30 flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-2">
        <button
          type="button"
          onClick={scrollToGrid}
          className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#291A14] to-[#3D2218] text-white px-7 py-3.5 text-sm font-extrabold shadow-[0_10px_28px_rgba(41,26,20,0.25)] hover:shadow-[0_16px_36px_rgba(200,75,104,0.35)] hover:-translate-y-0.5 transition-all border border-[#FFF0D6]/30"
        >
          <span>Explore All 49 Flavours</span>
          <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
        </button>

        <a
          href="https://wa.me/919985422222?text=Hello%20NICE%20ICE%20CREAMS!%20I%20would%20like%20to%20order%20from%20your%20flavour%20universe."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-white/95 text-[#0F5132] border-1.5 border-[#25D366]/60 px-6 py-3.5 text-sm font-extrabold shadow-md hover:bg-[#25D366] hover:text-white hover:-translate-y-0.5 transition-all"
        >
          <MessageCircle className="w-4 h-4 text-[#25D366] group-hover:text-white fill-current" />
          <span>Order on WhatsApp</span>
        </a>

        <a
          href="/flavour-universe/index.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF0D6]/80 text-[#291A14] border border-[#D9A15B]/40 px-5 py-3.5 text-xs font-bold hover:bg-[#FFF0D6] hover:-translate-y-0.5 transition-all"
          title="Open Standalone Pure Vanilla 3D Showroom"
        >
          <span>Standalone 3D Showroom ↗</span>
        </a>
      </div>
    </div>
  );
}

