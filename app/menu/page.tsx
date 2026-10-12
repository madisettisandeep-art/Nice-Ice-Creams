import React from "react";
import type { Metadata } from "next";
import { CatalogueSection } from "@/components/menu/CatalogueSection";
import { ScrollProgressBar } from "@/components/animations/ScrollRevealSection";
import { FlavourRibbonMarquee } from "@/components/animations/FlavourRibbonMarquee";
import { getCategories, getProducts } from "@/lib/db/store";

export const metadata: Metadata = {
  title: "Full Menu — 49 Flavours, Sundaes, Shakes & Specials",
  description:
    "Browse the official NICE ICE CREAMS menu: Classic Flavours, Premium Flavours, Chocolate Flavours, Seasonal Sitaphal & Mango, Dessert-Inspired Scoops, Fruit Salad with Ice Cream, Badam Milk, Shakes, and Sundaes.",
};

export default async function MenuPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ includeUnavailable: true }),
  ]);

  return (
    <div className="pt-16 sm:pt-20">
      <ScrollProgressBar />
      <FlavourRibbonMarquee />
      <CatalogueSection
        initialCategories={categories}
        initialProducts={products}
      />
    </div>
  );
}
