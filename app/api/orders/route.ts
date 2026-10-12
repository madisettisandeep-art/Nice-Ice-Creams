import { NextRequest, NextResponse } from "next/server";
import {
  createOrderRecord,
  getOrders,
  getProducts,
} from "@/lib/db/store";
import { calculateAuthoritativeOrderPricing } from "@/lib/pricing/calculator";
import { verifyAdminRequest } from "@/lib/security/auth";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { OrderCheckoutSchema } from "@/lib/validation/schemas";
import { formatOrderWhatsAppMessage } from "@/lib/whatsapp/formatter";

export async function GET(req: NextRequest) {
  const admin = verifyAdminRequest(req);
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized. Admin access required to view orders." },
      { status: 401 }
    );
  }
  const orders = await getOrders();
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local-client";

  const rl = checkRateLimit(`order:${ip}`, 12, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error: `Too many order requests. Please wait ${rl.retryAfterSeconds} seconds before trying again.`,
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = OrderCheckoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please check your order form details.",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const catalogue = await getProducts({ includeUnavailable: true });
    const pricing = calculateAuthoritativeOrderPricing(
      data.items,
      catalogue,
      data.order_type
    );

    if (!pricing.valid) {
      return NextResponse.json(
        {
          error: pricing.errors[0] || "Cart validation failed.",
          errors: pricing.errors,
        },
        { status: 422 }
      );
    }

    // Create draft order record first with "Awaiting WhatsApp confirmation"
    const tempFormatted = formatOrderWhatsAppMessage({
      orderReference: "PENDING",
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      orderType: data.order_type,
      deliveryAddress: data.delivery_address,
      preferredTime: data.preferred_time,
      items: pricing.items,
      subtotal: pricing.subtotal,
      fees: pricing.fees,
      discount: pricing.discount,
      total: pricing.total,
      notes: data.notes,
      partyDate: data.party_date,
      guestCount: data.guest_count,
    });

    const created = await createOrderRecord({
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      order_type: data.order_type,
      delivery_address: data.delivery_address ?? null,
      preferred_time: data.preferred_time,
      subtotal: pricing.subtotal,
      fees: pricing.fees,
      discount: pricing.discount,
      total: pricing.total,
      notes: data.notes ?? null,
      party_date: data.party_date ?? null,
      guest_count: data.guest_count ?? null,
      items: pricing.items,
      whatsapp_url: tempFormatted.whatsappUrl,
      idempotencyKey: data.idempotency_key,
    });

    // Format final WhatsApp message with actual order_reference
    const finalWhatsApp = formatOrderWhatsAppMessage({
      orderReference: created.order_reference,
      customerName: created.customer_name,
      customerPhone: created.customer_phone,
      orderType: created.order_type,
      deliveryAddress: created.delivery_address,
      preferredTime: created.preferred_time,
      items: created.items,
      subtotal: created.subtotal,
      fees: created.fees,
      discount: created.discount,
      total: created.total,
      notes: created.notes,
      partyDate: created.party_date,
      guestCount: created.guest_count,
    });

    return NextResponse.json(
      {
        order: {
          id: created.id,
          order_reference: created.order_reference,
          status: created.status, // Always "Awaiting WhatsApp confirmation"
          subtotal: created.subtotal,
          fees: created.fees,
          discount: created.discount,
          total: created.total,
          items: created.items,
          created_at: created.created_at,
        },
        whatsapp: {
          url: finalWhatsApp.whatsappUrl,
          message: finalWhatsApp.message,
          notice:
            "Important: Opening WhatsApp does not automatically submit your order. Please press Send inside WhatsApp to transmit your order to NICE ICE CREAMS.",
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to process order request." },
      { status: 400 }
    );
  }
}

