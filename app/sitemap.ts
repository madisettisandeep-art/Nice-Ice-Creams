import type { MetadataRoute } from "next";
import { INITIAL_PRODUCTS } from "@/lib/db/seed-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.niceicecreams.com";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/menu`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/party-orders`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/cart`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];

  const productRoutes: MetadataRoute.Sitemap = INITIAL_PRODUCTS.map((product) => ({
    url: `${baseUrl}/menu/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...productRoutes];
}

