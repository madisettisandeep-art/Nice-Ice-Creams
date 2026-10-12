import { NextRequest, NextResponse } from "next/server";
import { createBookingRecord, getBookings } from "@/lib/db/store";
import { verifyAdminRequest } from "@/lib/security/auth";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { PartyBookingSchema } from "@/lib/validation/schemas";
import { formatBookingWhatsAppMessage } from "@/lib/whatsapp/formatter";

export async function GET(req: NextRequest) {
  const admin = verifyAdminRequest(req);
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized. Admin authentication required." },
      { status: 401 }
    );
  }
  const bookings = await getBookings();
  return NextResponse.json({ bookings });
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local-client";

  const rl = checkRateLimit(`booking:${ip}`, 8, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error: `Too many booking requests. Please wait ${rl.retryAfterSeconds} seconds.`,
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = PartyBookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please review your party booking details.",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const tempWa = formatBookingWhatsAppMessage({
      enquiryReference: "PENDING",
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      eventType: data.event_type,
      eventDate: data.event_date,
      guestCount: data.guest_count,
      budget: data.budget,
      deliveryPreference: data.delivery_preference,
      location: data.location,
      orderPreferences: data.order_preferences,
      notes: data.notes,
    });

    const created = await createBookingRecord({
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      event_type: data.event_type,
      event_date: data.event_date,
      guest_count: data.guest_count,
      budget: data.budget ?? null,
      delivery_preference: data.delivery_preference,
      location: data.location ?? null,
      order_preferences: data.order_preferences,
      notes: data.notes ?? null,
      whatsapp_url: tempWa.whatsappUrl,
      idempotencyKey: data.idempotency_key,
    });

    const finalWa = formatBookingWhatsAppMessage({
      enquiryReference: created.enquiry_reference,
      customerName: created.customer_name,
      customerPhone: created.customer_phone,
      eventType: created.event_type,
      eventDate: created.event_date,
      guestCount: created.guest_count,
      budget: created.budget,
      deliveryPreference: created.delivery_preference,
      location: created.location,
      orderPreferences: created.order_preferences,
      notes: created.notes,
    });

    return NextResponse.json(
      {
        booking: {
          id: created.id,
          enquiry_reference: created.enquiry_reference,
          status: created.status, // Always "Pending" until business confirms
          event_type: created.event_type,
          event_date: created.event_date,
          guest_count: created.guest_count,
          created_at: created.created_at,
        },
        whatsapp: {
          url: finalWa.whatsappUrl,
          message: finalWa.message,
          notice:
            "Your enquiry is recorded as Pending. Please press Send in WhatsApp so our team can confirm availability and pricing for your event.",
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to process party booking enquiry." },
      { status: 400 }
    );
  }
}

