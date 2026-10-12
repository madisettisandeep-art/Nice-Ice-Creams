import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/db/store";
import { OrderStatus } from "@/lib/db/types";
import { verifyAdminRequest } from "@/lib/security/auth";

const ALLOWED_STATUSES: OrderStatus[] = [
  "Draft",
  "Awaiting WhatsApp confirmation",
  "Confirmed",
  "Preparing",
  "Ready for pickup",
  "Out for delivery",
  "Completed",
  "Cancelled",
];

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
    const status = body?.status as OrderStatus;
    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid order status value." },
        { status: 400 }
      );
    }

    const updated = await updateOrderStatus(id, status, admin.actor);
    if (!updated) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ order: updated });
  } catch {
    return NextResponse.json(
      { error: "Failed to update order status." },
      { status: 400 }
    );
  }
}

