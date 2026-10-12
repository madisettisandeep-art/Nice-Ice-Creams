import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProductBySlugOrId,
  getProductsBySlugsOrIds,
} from "@/lib/db/store";
import { ProductPageClient } from "@/components/product/ProductPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugOrId(slug);
  if (!product) {
    return { title: "Product Not Found" };
  }
  return {
    title: `${product.name} (${product.category_name}) — ₹${product.price}`,
    description: product.description,
    openGraph: {
      title: `${product.name} — NICE ICE CREAMS (Est. 1986)`,
      description: product.description,
      images: [{ url: product.image_url, alt: product.name }],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlugOrId(slug);

  if (!product) {
    notFound();
  }

  const recommendedProducts = await getProductsBySlugsOrIds(
    product.recommended_slugs || []
  );

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: `https://www.niceicecreams.com${product.image_url}`,
    category: product.category_name,
    brand: {
      "@type": "Brand",
      name: "NICE ICE CREAMS",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: product.availability
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductPageClient
        product={product}
        recommendedProducts={recommendedProducts}
      />
    </>
  );
}

