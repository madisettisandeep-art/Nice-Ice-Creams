import { CatalogueSkeletonGrid } from "@/components/menu/ProductCardSkeleton";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-brand-ivory pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mb-10 animate-pulse">
          <div className="h-3 w-36 rounded bg-brand-blue/20 mb-3" />
          <div className="h-10 w-80 rounded-xl bg-brand-chocolate/10 mb-3" />
          <div className="h-4 w-96 rounded bg-brand-chocolate/8" />
        </div>
        <CatalogueSkeletonGrid count={8} />
      </div>
    </div>
  );
}

