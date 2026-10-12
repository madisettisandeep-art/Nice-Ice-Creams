import { OrderItem, OrderType } from "../db/types";

/**
 * Returns the configured WhatsApp business number in international format
 * without spaces or punctuation (e.g. 919985422222 from the official menu).
 */
export function getConfiguredWhatsAppNumber(): string {
  const raw = process.env.WHATSAPP_BUSINESS_NUMBER || "919985422222";
  const digits = raw.replace(/[^0-9]/g, "");
  // Reject placeholder strings like 91XXXXXXXXXX
  if (!digits || digits.length < 10 || raw.includes("XXXX")) {
    return "919985422222";
  }
  return digits;
}

export function formatOrderWhatsAppMessage(params: {
  orderReference: string;
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  deliveryAddress?: string | null;
  preferredTime: string;
  items: Omit<OrderItem, "id" | "order_id">[];
  subtotal: number;
  fees: number;
  discount: number;
  total: number;
  notes?: string | null;
  partyDate?: string | null;
  guestCount?: number | null;
}): { message: string; whatsappUrl: string } {
  const orderTypeLabels: Record<OrderType, string> = {
    pickup: "Store Pickup",
    delivery: "Home Delivery",
    party_enquiry: "Bulk / Party Order",
  };

  const lines: string[] = [
    "🍨 *NICE ICE CREAMS — ORDER REQUEST*",
    `📋 *Order Reference:* ${params.orderReference}`,
    "Status: Awaiting WhatsApp Confirmation",
    "────────────────────────",
    `👤 *Customer:* ${params.customerName}`,
    `📞 *Phone:* ${params.customerPhone}`,
    `🛵 *Order Type:* ${orderTypeLabels[params.orderType] || params.orderType}`,
    `⏰ *Preferred Time:* ${params.preferredTime}`,
  ];

  if (params.orderType === "delivery" && params.deliveryAddress) {
    lines.push(`📍 *Delivery Address:* ${params.deliveryAddress}`);
  }
  if (params.partyDate) {
    lines.push(`🎉 *Event Date:* ${params.partyDate}`);
  }
  if (params.guestCount) {
    lines.push(`👥 *Estimated Guests:* ${params.guestCount}`);
  }

  lines.push("────────────────────────");
  lines.push("🍧 *ORDER ITEMS:*");

  params.items.forEach((item, index) => {
    lines.push(
      `${index + 1}. *${item.product_name_snapshot}* (${item.variant_snapshot})\n   ${item.quantity} × ₹${item.unit_price_snapshot} = *₹${item.line_total}*`
    );
  });

  lines.push("────────────────────────");
  lines.push(`Subtotal: ₹${params.subtotal}`);
  if (params.fees > 0) {
    lines.push(`Delivery / Taxes: ₹${params.fees}`);
  }
  if (params.discount > 0) {
    lines.push(`Discount: -₹${params.discount}`);
  }
  lines.push(`💰 *GRAND TOTAL: ₹${params.total}*`);

  if (params.notes && params.notes.trim()) {
    lines.push("────────────────────────");
    lines.push(`📝 *Customer Notes:* ${params.notes.trim()}`);
  }

  lines.push("────────────────────────");
  lines.push("Please confirm availability and total for my NICE ICE CREAMS order. Thank you!");

  const message = lines.join("\n");
  const businessNumber = getConfiguredWhatsAppNumber();
  const whatsappUrl = `https://wa.me/${businessNumber}?text=${encodeURIComponent(message)}`;

  return { message, whatsappUrl };
}

export function formatBookingWhatsAppMessage(params: {
  enquiryReference: string;
  customerName: string;
  customerPhone: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  budget?: string | null;
  deliveryPreference: "delivery" | "pickup";
  location?: string | null;
  orderPreferences: string[];
  notes?: string | null;
}): { message: string; whatsappUrl: string } {
  const lines: string[] = [
    "🎉 *NICE ICE CREAMS — PARTY & BULK BOOKING ENQUIRY*",
    `🔖 *Enquiry Ref:* ${params.enquiryReference}`,
    "Status: Pending Business Confirmation",
    "────────────────────────",
    `👤 *Host Name:* ${params.customerName}`,
    `📞 *Phone:* ${params.customerPhone}`,
    `🎊 *Event Type:* ${params.eventType}`,
    `📅 *Event Date:* ${params.eventDate}`,
    `👥 *Estimated Guests:* ${params.guestCount}`,
    `🚚 *Service Mode:* ${params.deliveryPreference === "delivery" ? "Venue Delivery / Catering" : "Store Pickup"}`,
  ];

  if (params.location) {
    lines.push(`📍 *Venue / Location:* ${params.location}`);
  }
  if (params.budget) {
    lines.push(`💼 *Estimated Budget:* ${params.budget}`);
  }
  if (params.orderPreferences.length > 0) {
    lines.push("────────────────────────");
    lines.push(`🍨 *Desired Flavours & Desserts:*`);
    lines.push(params.orderPreferences.map((p) => `• ${p}`).join("\n"));
  }
  if (params.notes && params.notes.trim()) {
    lines.push("────────────────────────");
    lines.push(`📝 *Additional Requirements:* ${params.notes.trim()}`);
  }

  lines.push("────────────────────────");
  lines.push("Please let us know package options and availability for our event!");

  const message = lines.join("\n");
  const businessNumber = getConfiguredWhatsAppNumber();
  const whatsappUrl = `https://wa.me/${businessNumber}?text=${encodeURIComponent(message)}`;

  return { message, whatsappUrl };
}

