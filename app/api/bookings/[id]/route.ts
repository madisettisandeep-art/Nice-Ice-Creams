import { NextRequest, NextResponse } from "next/server";
import { updateBookingStatus } from "@/lib/db/store";
import { BookingStatus } from "@/lib/db/types";
import { verifyAdminRequest } from "@/lib/security/auth";

const ALLOWED: BookingStatus[] = ["Pending", "Confirmed", "Declined"];

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const admin = verifyAdminRequest(req);
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized. Admin authentication required." },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  try {
    const body = await req.json();
    const status = body?.status as BookingStatus;
    if (!ALLOWED.includes(status)) {
      return NextResponse.json(
        { error: "Invalid booking status." },
        { status: 400 }
      );
    }

    const updated = await updateBookingStatus(id, status, admin.actor);
    if (!updated) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }
    return NextResponse.json({ booking: updated });
  } catch {
    return NextResponse.json(
      { error: "Failed to update booking status." },
      { status: 400 }
    );
  }
}

