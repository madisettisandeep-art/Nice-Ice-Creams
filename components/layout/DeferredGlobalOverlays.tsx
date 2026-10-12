"use client";

import dynamic from "next/dynamic";

const DeferredCartDrawer = dynamic(
  () => import("@/components/cart/CartDrawer").then((mod) => mod.CartDrawer),
  { ssr: false }
);

const DeferredProductDetailModal = dynamic(
  () =>
    import("@/components/product/ProductDetailModal").then(
      (mod) => mod.ProductDetailModal
    ),
  { ssr: false }
);

/**
 * Splits interactive global overlays (CartDrawer & ProductDetailModal)
 * into deferred client chunks so they do not bloat the initial critical bundle.
 */
export function DeferredGlobalOverlays() {
  return (
    <>
      <DeferredCartDrawer />
      <DeferredProductDetailModal />
    </>
  );
}

