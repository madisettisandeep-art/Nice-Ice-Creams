import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartContext";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/footer/Footer";
import { DeferredGlobalOverlays } from "@/components/layout/DeferredGlobalOverlays";

const displayFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700", "800", "900"],
  display: "swap",
});

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.niceicecreams.com"),
  title: {
    default: "NICE ICE CREAMS (Est. 1986) — Eat.. Party.. Ice Creams",
    template: "%s | NICE ICE CREAMS (Est. 1986)",
  },
  description:
    "Crafting joy since 1986. Explore 49 handcrafted flavours, hot brownie sizzlers, sundaes, thick shakes, fruit salad with ice cream, and badam milk made with pure milk and fresh cream. Order on WhatsApp or book party orders.",
  keywords: [
    "NICE ICE CREAMS",
    "Nice Ice Creams 1986",
    "Fruit Salad with Ice Cream",
    "Badam Milk with Ice Cream",
    "Death by Chocolate",
    "Brownie with Ice Cream Sizzler",
    "Fresh Sitaphal Ice Cream",
    "Party Ice Cream Orders",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/brand/nice_ice_cream_logo.png", type: "image/png" },
    ],
    apple: [{ url: "/brand/nice_ice_cream_logo.png" }],
  },
  openGraph: {
    title: "NICE ICE CREAMS (Est. 1986) — Eat.. Party.. Ice Creams",
    description:
      "Premium ice creams, sundaes, shakes, fruit salad & badam milk crafted with pure milk and fresh cream since 1986.",
    url: "https://www.niceicecreams.com",
    siteName: "NICE ICE CREAMS",
    images: [
      {
        url: "/brand/nice-lockup-hd.png",
        width: 580,
        height: 145,
        alt: "NICE ICE CREAMS Since 1986",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: "NICE ICE CREAMS",
    foundingDate: "1986",
    slogan: "Eat.. Party.. Ice Creams",
    url: "https://www.niceicecreams.com",
    logo: "https://www.niceicecreams.com/brand/nice_ice_cream_logo.png",
    email: "niceicecreams.warangal@gmail.com",
    telephone: "+91-99854-22222",
    hasMap: "https://share.google/yq0nK8FNCLDy8liSQ",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Main Road, Opp. Forest Office, Waddepally Cross Roads, Subedari",
      addressLocality: "Hanamkonda, Warangal",
      addressRegion: "Telangana",
      postalCode: "506004",
      addressCountry: "IN",
    },
    sameAs: [
      "https://www.instagram.com/nice_ice_creams/",
      "https://share.google/yq0nK8FNCLDy8liSQ",
    ],
    servesCuisine: ["Ice Cream", "Desserts", "Milkshakes", "Sundaes"],
  };

  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${sansFont.variable}`}
    >
      <body className="font-sans antialiased bg-ivory-100 text-cinema-900 min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <DeferredGlobalOverlays />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

