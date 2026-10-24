"use client";

import React, { useEffect, useRef, useState } from "react";
import { HERO_SHOTS_MANIFEST } from "@/lib/db/seed-data";
import { trackEvent } from "@/lib/analytics/tracker";
import { MessageCircle, Volume2, VolumeX } from "lucide-react";

export function CinematicHero12Shots() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const primaryVideoRef = useRef<HTMLVideoElement>(null);
  const preloadVideoRef = useRef<HTMLVideoElement>(null);
  const completedTrackedRef = useRef(false);
  const fadeRafRef = useRef<number | null>(null);
  const userMutedRef = useRef(false);

  const [activeShotIndex, setActiveShotIndex] = useState(0);
  const [shotLocalProgress, setShotLocalProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [mobileFitMode, setMobileFitMode] = useState<"fit" | "fill">("fit");
  const [isHeroInView, setIsHeroInView] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [needsInteractionForAudio, setNeedsInteractionForAudio] = useState(false);

  // Exact screen coordinates of the 1920x1080 bottom-right watermark (1740, 900) under object-cover
  const [watermarkCover, setWatermarkCover] = useState<{
    x: number;
    y: number;
    size: number;
    visibleInViewport: boolean;
  }>({
    x: 0,
    y: 0,
    size: 72,
    visibleInViewport: false,
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onMqChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onMqChange);

    const updateGeometry = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isMobile = w < 768 || w / h < 1.15;
      setIsMobileViewport(isMobile);

      // Compute exact object-cover projection of (1740, 900) in a 1920x1080 frame
      const videoW = 1920;
      const videoH = 1080;
      const scale = Math.max(w / videoW, h / videoH);
      const renderedW = videoW * scale;
      const renderedH = videoH * scale;
      const offsetX = (w - renderedW) / 2;
      const offsetY = (h - renderedH) / 2;

      const starX = offsetX + 1740 * scale;
      const starY = offsetY + 900 * scale;
      const coverDiameter = Math.max(70, Math.ceil(86 * scale));

      const inBounds =
        starX + coverDiameter / 2 > 0 &&
        starX - coverDiameter / 2 < w &&
        starY + coverDiameter / 2 > 0 &&
        starY - coverDiameter / 2 < h;

      setWatermarkCover({
        x: starX,
        y: starY,
        size: coverDiameter,
        visibleInViewport: inBounds,
      });
    };

    updateGeometry();
    window.addEventListener("resize", updateGeometry);

    return () => {
      mq.removeEventListener("change", onMqChange);
      window.removeEventListener("resize", updateGeometry);
    };
  }, []);

  // Unlock browser audio on first user gesture if autoplay with sound was initially deferred by browser policy
  useEffect(() => {
    if (!needsInteractionForAudio || isMuted) return;

    const unlockAudio = () => {
      if (userMutedRef.current) return;
      const vid = primaryVideoRef.current;
      if (vid) {
        vid.muted = false;
        vid.volume = 0.85;
        vid.play().catch(() => {});
      }
      setNeedsInteractionForAudio(false);
    };

    window.addEventListener("pointerdown", unlockAudio, { once: true, passive: true });
    window.addEventListener("keydown", unlockAudio, { once: true, passive: true });
    window.addEventListener("touchstart", unlockAudio, { once: true, passive: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
  }, [needsInteractionForAudio, isMuted]);

  // Scroll synchronization across the 640vh hero container
  useEffect(() => {
    let rafId: number | null = null;

    const updateScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;

      // Pause audio/video when user scrolls past the hero into the menu below
      const inView = rect.bottom > viewportH * 0.18 && rect.top < viewportH * 0.92;
      setIsHeroInView(inView);

      const scrollableDistance = Math.max(1, el.offsetHeight - viewportH);
      const rawProgress = -rect.top / scrollableDistance;
      const clamped = Math.max(0, Math.min(1, rawProgress));

      const totalShots = HERO_SHOTS_MANIFEST.length; // 12
      const scaled = clamped * totalShots;
      const idx = Math.min(totalShots - 1, Math.floor(scaled));
      const local = Math.max(0, Math.min(1, scaled - idx));

      setActiveShotIndex(idx);
      setShotLocalProgress(local);

      if (clamped >= 0.94 && !completedTrackedRef.current) {
        completedTrackedRef.current = true;
        trackEvent("hero_completed", { shots_viewed: 12 });
      }
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        updateScroll();
        rafId = null;
      });
    };

    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const currentShot = HERO_SHOTS_MANIFEST[activeShotIndex] || HERO_SHOTS_MANIFEST[0];
  const nextShot =
    HERO_SHOTS_MANIFEST[Math.min(HERO_SHOTS_MANIFEST.length - 1, activeShotIndex + 1)];

  // Smooth visual & audio envelope near shot boundaries so slides never clash
  const edgeFade =
    shotLocalProgress < 0.07
      ? shotLocalProgress / 0.07
      : shotLocalProgress > 0.93
      ? (1 - shotLocalProgress) / 0.07
      : 1;

  // Keep live video volume synchronized with shot boundary envelope & viewport visibility
  useEffect(() => {
    const vid = primaryVideoRef.current;
    if (!vid) return;

    if (!isHeroInView) {
      vid.volume = 0;
      if (!vid.paused) vid.pause();
      return;
    }

    if (isMuted) {
      vid.muted = true;
      vid.volume = 0;
    } else {
      const targetVol = Math.max(0, Math.min(0.9, edgeFade * 0.9));
      vid.volume = targetVol;
    }
  }, [edgeFade, isHeroInView, isMuted]);

  // Strictly isolated per-slide video & audio switching with smooth volume ramp-in
  useEffect(() => {
    if (reducedMotion) return;
    const vid = primaryVideoRef.current;
    if (!vid) return;

    if (fadeRafRef.current) {
      cancelAnimationFrame(fadeRafRef.current);
      fadeRafRef.current = null;
    }

    // Ensure preloader is 100% silent and paused at all times so its sound can never bleed
    const pre = preloadVideoRef.current;
    if (pre) {
      pre.pause();
      pre.muted = true;
      pre.volume = 0;
      if (nextShot && nextShot.videoSrc !== currentShot.videoSrc) {
        if (pre.getAttribute("data-preload-src") !== nextShot.videoSrc) {
          pre.setAttribute("data-preload-src", nextShot.videoSrc);
          pre.src = nextShot.videoSrc;
          pre.preload = "metadata";
        }
      }
    }

    const currentSrc = vid.getAttribute("data-shot-src");
    const isNewSlide = currentSrc !== currentShot.videoSrc;

    if (isNewSlide) {
      // Immediately stop previous slide's audio & video stream before loading the new slide
      vid.pause();
      vid.currentTime = 0;
      vid.volume = 0;
      vid.setAttribute("data-shot-src", currentShot.videoSrc);
      vid.src = currentShot.videoSrc;
      vid.poster = currentShot.posterSrc;
      vid.load();
    }

    if (!isHeroInView) {
      vid.pause();
      return;
    }

    const startPlayback = async () => {
      try {
        vid.muted = isMuted;
        if (!isMuted) {
          vid.volume = 0.02;
        }
        await vid.play();

        if (!isMuted) {
          const rampStart = performance.now();
          const rampDuration = 380;
          const rampTick = (now: number) => {
            const t = Math.min(1, (now - rampStart) / rampDuration);
            const eased = t * (2 - t);
            if (primaryVideoRef.current && !userMutedRef.current) {
              primaryVideoRef.current.volume = Math.min(0.9, eased * 0.9);
            }
            if (t < 1) {
              fadeRafRef.current = requestAnimationFrame(rampTick);
            }
          };
          fadeRafRef.current = requestAnimationFrame(rampTick);
        }
      } catch {
        vid.muted = true;
        vid.volume = 0;
        setNeedsInteractionForAudio(true);
        vid.play().catch(() => {});
      }
    };

    startPlayback();

    return () => {
      if (fadeRafRef.current) {
        cancelAnimationFrame(fadeRafRef.current);
        fadeRafRef.current = null;
      }
    };
  }, [currentShot, nextShot, reducedMotion, isHeroInView, isMuted]);

  const toggleMute = () => {
    const nextMuted = !isMuted && !needsInteractionForAudio;
    userMutedRef.current = nextMuted;
    setNeedsInteractionForAudio(false);
    setIsMuted(nextMuted);

    const vid = primaryVideoRef.current;
    if (vid) {
      vid.muted = nextMuted;
      vid.volume = nextMuted ? 0 : 0.9;
      if (vid.paused && isHeroInView) {
        vid.play().catch(() => {});
      }
    }
  };

  const jumpToShot = (shotIdx: number) => {
    const el = containerRef.current;
    if (!el) return;
    const scrollableDistance = Math.max(1, el.offsetHeight - window.innerHeight);
    const targetProgress = (shotIdx + 0.15) / HERO_SHOTS_MANIFEST.length;
    const targetY =
      window.scrollY + el.getBoundingClientRect().top + targetProgress * scrollableDistance;
    window.scrollTo({
      top: targetY,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  const openWhatsAppChat = () => {
    const msg = encodeURIComponent(
      "Hello NICE ICE CREAMS! I would like to place an order from your menu."
    );
    window.open(
      `https://wa.me/919985422222?text=${msg}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const effectiveMuted = isMuted || needsInteractionForAudio;

  return (
    <section
      id="hero-cinematic-section"
      ref={containerRef}
      aria-label="NICE ICE CREAMS 12-Shot Cinematic Story"
      className="relative w-full bg-black text-ivory-50 select-none"
      style={{
        height: reducedMotion ? "auto" : isMobileViewport ? "480vh" : "640vh",
      }}
    >
      {reducedMotion ? (
        /* Accessible Reduced-Motion Equivalent Storyboard */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {HERO_SHOTS_MANIFEST.map((shot) => (
              <div
                key={shot.shotNumber}
                className="rounded-2xl overflow-hidden bg-cinema-900 border border-white/10 flex flex-col"
              >
                <div className="aspect-video w-full overflow-hidden bg-black">
                  <img
                    src={shot.posterSrc}
                    alt={`${shot.code}: ${shot.title}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 flex items-center justify-between text-xs font-mono text-ivory-200">
                  <span>{shot.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Sticky Full-Screen Cinematic Viewport (100% Mobile & Desktop Compatible) */
        <div
          ref={stageRef}
          className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden flex items-center justify-center bg-black"
        >
          {/* Ambient Glowing Backdrop (Fills mobile portrait space with matching shot colors) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
            <img
              src={currentShot.posterSrc}
              alt=""
              className="w-full h-full object-cover blur-3xl scale-125 opacity-40 md:opacity-0 transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/35 to-black/90 md:hidden" />
          </div>

          {/* Silent Next-Clip Metadata Preloader (Never plays audio) */}
          <video
            ref={preloadVideoRef}
            muted
            playsInline
            className="hidden"
            aria-hidden="true"
          />

          {isMobileViewport && mobileFitMode === "fit" ? (
            /* MOBILE PRESENTATION: 100% Fully Visible 16:9 Cinematic Video + Story Card */
            <div className="relative z-10 w-full h-full flex flex-col justify-between items-center px-3 sm:px-6 pt-16 pb-4 sm:pt-20 sm:pb-6 overflow-hidden">
              {/* Centered 16:9 Video Frame — 100% Uncropped & Unobstructed */}
              <div className="w-full max-w-lg my-auto flex flex-col items-center">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.85)] border border-white/20 bg-black shrink-0">
                  {/* Instant LCP Poster Backdrop */}
                  <img
                    src={currentShot.posterSrc}
                    alt={currentShot.code}
                    width={1920}
                    height={1080}
                    fetchPriority="high"
                    decoding="sync"
                    className="absolute inset-0 h-full w-full object-contain transition-opacity duration-300"
                  />

                  {/* Primary Active Shot Video */}
                  <video
                    ref={primaryVideoRef}
                    poster={currentShot.posterSrc}
                    loop
                    playsInline
                    autoPlay
                    className="relative z-10 h-full w-full object-contain transition-opacity duration-250"
                    style={{
                      opacity: Math.max(0.45, edgeFade),
                    }}
                  />

                  {/* Discrete Watermark Hallmark Badge Inside 16:9 Frame */}
                  <div
                    style={{ left: "90.625%", top: "83.333%" }}
                    className="absolute z-20 -translate-x-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-black/85 backdrop-blur-[2px] border border-white/25 flex items-center justify-center shadow-md pointer-events-none"
                  >
                    <span className="text-[10px] font-black text-amber-300 leading-none">✦</span>
                  </div>
                </div>

                {/* Mobile Story Title, Tagline & Controls Card */}
                <div className="w-full pt-3 pb-1 flex flex-col items-center text-center space-y-1.5 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-[#FDE68A]">
                      {currentShot.code} OF 12 • {currentShot.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => setMobileFitMode("fill")}
                      className="rounded-full bg-white/10 hover:bg-white/20 border border-white/15 px-2.5 py-0.5 text-[10px] font-bold text-white/80 hover:text-white transition"
                      title="Expand to full screen"
                    >
                      Fill View
                    </button>
                  </div>

                  <p className="text-xs font-semibold text-white/95 leading-snug">
                    {currentShot.subtitle}
                  </p>

                  <p className="text-[11px] text-ivory-200/75 leading-relaxed max-w-xs line-clamp-2">
                    {currentShot.caption}
                  </p>

                  {/* Mobile 12-Shot Progress Bar & Mute Control */}
                  <div className="flex items-center gap-2.5 pt-1">
                    <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-black/35 backdrop-blur-md border border-white/15">
                      {HERO_SHOTS_MANIFEST.map((shot, idx) => {
                        const isCurrent = idx === activeShotIndex;
                        const isCompleted = idx < activeShotIndex;
                        return (
                          <button
                            key={shot.shotNumber}
                            type="button"
                            onClick={() => jumpToShot(idx)}
                            aria-label={`Jump to slide ${shot.shotNumber}`}
                            className="p-0.5 focus:outline-none"
                          >
                            <span
                              className="block h-1.5 rounded-full transition-all duration-200"
                              style={{
                                width: isCurrent ? "18px" : "5px",
                                backgroundColor: isCurrent
                                  ? "#FFFFFF"
                                  : isCompleted
                                  ? "rgba(255,255,255,0.6)"
                                  : "rgba(255,255,255,0.22)",
                              }}
                            />
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={toggleMute}
                      aria-label={effectiveMuted ? "Unmute video sound" : "Mute video sound"}
                      className="flex items-center justify-center h-8 w-8 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur-md border border-white/15 text-white shadow-sm transition"
                    >
                      {effectiveMuted ? (
                        <VolumeX className="w-3.5 h-3.5 text-white/80" aria-hidden="true" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Mobile WhatsApp Order Button */}
              <button
                type="button"
                onClick={openWhatsAppChat}
                aria-label="Order on WhatsApp with NICE ICE CREAMS"
                title="Order on WhatsApp"
                className="fixed bottom-4 right-4 z-40 flex items-center justify-center h-13 w-13 rounded-full bg-[#25D366] hover:bg-[#1EBE5B] text-white shadow-[0_8px_24px_rgba(0,0,0,0.6)] ring-4 ring-black/40 hover:scale-105 active:scale-95 transition-transform"
              >
                <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" aria-hidden="true" />
              </button>
            </div>
          ) : (
            /* DESKTOP (OR FULL-BLEED MOBILE) VIEWPORT */
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              {/* Instant LCP Poster Backdrop */}
              <img
                src={currentShot.posterSrc}
                alt={currentShot.code}
                width={1920}
                height={1080}
                fetchPriority="high"
                decoding="sync"
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
              />

              {/* Primary Active Shot Video */}
              <video
                ref={primaryVideoRef}
                poster={currentShot.posterSrc}
                loop
                playsInline
                autoPlay
                className="relative z-10 h-full w-full object-cover transition-opacity duration-250"
                style={{
                  opacity: Math.max(0.45, edgeFade),
                }}
              />

              {/* Floating "Fit 16:9" Toggle Button when in Mobile Fill Mode */}
              {isMobileViewport && (
                <button
                  type="button"
                  onClick={() => setMobileFitMode("fit")}
                  className="absolute top-18 left-4 z-30 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/25 px-3 py-1 text-xs font-bold text-white shadow-lg transition"
                >
                  ← 100% Fit View
                </button>
              )}

              {/* Numberless Transparent Side Capsule Indicator Rail + Sound/Mute Control */}
              <aside
                aria-label="Hero shot sequence and sound controls"
                className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3"
              >
                {/* Minimalist Numberless Dot/Capsule Sequence Pill */}
                <div className="flex flex-col items-center gap-2 py-3 px-2 rounded-full bg-black/15 hover:bg-black/30 backdrop-blur-sm border border-white/15 transition-all duration-300 opacity-70 hover:opacity-100">
                  {HERO_SHOTS_MANIFEST.map((shot, idx) => {
                    const isCurrent = idx === activeShotIndex;
                    const isCompleted = idx < activeShotIndex;
                    return (
                      <button
                        key={shot.shotNumber}
                        type="button"
                        onClick={() => jumpToShot(idx)}
                        aria-label={`Slide ${shot.shotNumber}`}
                        aria-current={isCurrent ? "step" : undefined}
                        className="group flex items-center justify-center p-0.5 focus:outline-none"
                      >
                        <span
                          className="block w-1.5 rounded-full overflow-hidden transition-all duration-300"
                          style={{
                            height: isCurrent ? "22px" : "6px",
                            backgroundColor: isCurrent
                              ? "rgba(255,255,255,0.28)"
                              : isCompleted
                              ? "rgba(255,255,255,0.55)"
                              : "rgba(255,255,255,0.22)",
                          }}
                        >
                          {isCurrent && (
                            <span
                              className="block w-full bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.9)] transition-all duration-100"
                              style={{
                                height: `${Math.max(20, Math.round(shotLocalProgress * 100))}%`,
                              }}
                            />
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Transparent Mute / Unmute Button */}
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={effectiveMuted ? "Unmute video sound" : "Mute video sound"}
                  title={effectiveMuted ? "Unmute sound" : "Mute sound"}
                  className="flex items-center justify-center h-9 w-9 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm border border-white/15 text-white/85 hover:text-white shadow-sm transition-all duration-200 opacity-75 hover:opacity-100"
                >
                  {effectiveMuted ? (
                    <VolumeX className="w-4 h-4 text-white/80" aria-hidden="true" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white" aria-hidden="true" />
                  )}
                </button>
              </aside>

              {/* WhatsApp Floating Icon Button */}
              <button
                type="button"
                onClick={openWhatsAppChat}
                aria-label="Chat on WhatsApp with NICE ICE CREAMS"
                title="Order on WhatsApp"
                style={
                  watermarkCover.visibleInViewport
                    ? {
                        position: "absolute",
                        left: `${watermarkCover.x}px`,
                        top: `${watermarkCover.y}px`,
                        width: `${watermarkCover.size}px`,
                        height: `${watermarkCover.size}px`,
                        transform: "translate(-50%, -50%)",
                      }
                    : {
                        position: "absolute",
                        right: "20px",
                        bottom: "20px",
                        width: "64px",
                        height: "64px",
                      }
                }
                className="z-30 flex items-center justify-center rounded-full bg-[#25D366] hover:bg-[#1EBE5B] text-white shadow-[0_8px_28px_rgba(0,0,0,0.65)] ring-4 ring-black/45 hover:scale-105 transition-transform duration-200"
              >
                <MessageCircle className="w-8 h-8 fill-white text-[#25D366]" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
