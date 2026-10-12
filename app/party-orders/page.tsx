import React from "react";
import type { Metadata } from "next";
import { PartyBookingForm } from "@/components/booking/PartyBookingForm";
import {
  ScrollProgressBar,
  ScrollRevealSection,
} from "@/components/animations/ScrollRevealSection";
import { FlavourRibbonMarquee } from "@/components/animations/FlavourRibbonMarquee";
import { Phone, Sparkles, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Party Bookings & Bulk Orders — Birthdays, Weddings & Events",
  description:
    "Hosting a party? Book NICE ICE CREAMS for birthdays, weddings, family gatherings, and corporate events. Call +91 99854 22222 / +91 73061 42993 or submit an online enquiry.",
};

export default function PartyOrdersPage() {
  return (
    <div className="pt-16">
      <ScrollProgressBar />
      <FlavourRibbonMarquee />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-12">
      {/* Hero Banner */}
      <ScrollRevealSection className="rounded-3xl bg-gradient-to-br from-cinema-950 via-brand-royal to-brand-indigo text-white p-8 sm:p-12 shadow-cinema grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-flavour-mango">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Eat.. Party.. Ice Creams • Since 1986</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight">
            Hosting a Party? Let NICE ICE CREAMS Sweeten Every Celebration
          </h1>
          <p className="text-sm sm:text-base text-ivory-100/90 leading-relaxed max-w-2xl">
            Whether you are planning a birthday party, wedding reception, family gathering, or office celebration, we supply bulk ice cream gallons, live{" "}
            <strong>Fruit Salad with Ice Cream</strong> counters, chilled{" "}
            <strong>Badam Milk with Ice Cream</strong>, and custom sundae stations.
          </p>
        </div>

        <div className="lg:col-span-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 space-y-3">
          <div className="text-xs font-extrabold uppercase tracking-widest text-brand-cyan">
            Direct Party Hotline
          </div>
          <a
            href="tel:+919985422222"
            className="flex items-center gap-2.5 text-xl font-black text-white hover:text-flavour-mango transition"
          >
            <Phone className="w-5 h-5 text-flavour-mango" aria-hidden="true" />
            <span>+91 99854 22222</span>
          </a>
          <a
            href="tel:+917306142993"
            className="flex items-center gap-2.5 text-xl font-black text-white hover:text-flavour-mango transition"
          >
            <Phone className="w-5 h-5 text-flavour-mango" aria-hidden="true" />
            <span>+91 73061 42993</span>
          </a>
          <p className="text-xs text-ivory-200 pt-1">
            Email: niceicecreams.warangal@gmail.com
          </p>
        </div>
      </ScrollRevealSection>

      {/* Highlights */}
      <ScrollRevealSection delay={0.08} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Live Fruit Salad & Badam Milk Counters",
            desc: "Our signature 1986 crowd-pleasers served fresh to your guests with generous scoops of pure-milk ice cream.",
          },
          {
            title: "Bulk Gallons & Custom Scoops",
            desc: "Choose from Classic Vanilla, Butterscotch, Pista Nuts, Malai Kulfi, Fresh Sitaphal, Natural Mango, and Belgium Chocolate.",
          },
          {
            title: "Transparent Enquiry Workflow",
            desc: "Receive an instant enquiry reference and send your event details directly via WhatsApp for rapid confirmation.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-2xl bg-white border border-ivory-300 p-6 shadow-sm space-y-2"
          >
            <Users className="w-6 h-6 text-brand-blue" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold text-cinema-900">
              {card.title}
            </h2>
            <p className="text-xs sm:text-sm text-cinema-800/75 leading-relaxed">
              {card.desc}
            </p>
          </div>
        ))}
      </ScrollRevealSection>

      {/* Party Booking Form */}
      <ScrollRevealSection direction="scale" delay={0.12}>
        <PartyBookingForm />
      </ScrollRevealSection>
      </div>
    </div>
  );
}

