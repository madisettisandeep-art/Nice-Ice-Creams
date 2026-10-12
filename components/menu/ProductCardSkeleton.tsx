"use client";

import React from "react";

export function ProductCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col rounded-2xl bg-white border border-brand-chocolate/8 overflow-hidden shadow-card animate-pulse"
    >
      {/* 16:10 Image Skeleton */}
      <div className="relative aspect-[16/10] w-full bg-gradient-to-r from-[#F3ECE1] via-[#FAF6EE] to-[#F3ECE1]" />

      {/* Content Body Skeleton */}
      <div className="flex flex-col flex-1 p-5 justify-between gap-4">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <div className="h-5 w-2/3 rounded-md bg-brand-chocolate/10" />
            <div className="h-5 w-12 rounded-md bg-brand-blue/15" />
          </div>
          <div className="space-y-1.5 mb-3">
            <div className="h-3 w-full rounded bg-brand-chocolate/8" />
            <div className="h-3 w-4/5 rounded bg-brand-chocolate/8" />
          </div>
          <div className="flex gap-1.5">
            <div className="h-4 w-14 rounded-md bg-brand-cream" />
            <div className="h-4 w-16 rounded-md bg-brand-cream" />
            <div className="h-4 w-12 rounded-md bg-brand-cream" />
          </div>
        </div>

        <div className="pt-3 border-t border-brand-chocolate/8 flex items-center gap-2">
          <div className="flex-1 h-9 rounded-xl bg-brand-blue/15" />
          <div className="h-9 w-9 rounded-xl bg-brand-chocolate/8" />
        </div>
      </div>
    </div>
  );
}

export function CatalogueSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="Loading menu creations"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

