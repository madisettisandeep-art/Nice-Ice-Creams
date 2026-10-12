import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/db/store";
import { calculateAuthoritativeOrderPricing } from "@/lib/pricing/calculator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const lines = Array.isArray(body?.items) ? body.items : [];
    const orderType =
      body?.order_type === "delivery" || body?.order_type === "party_enquiry"
        ? body.order_type
        : "pickup";

    const catalogue = await getProducts({ includeUnavailable: true });
    const result = calculateAuthoritativeOrderPricing(lines, catalogue, orderType);

    return NextResponse.json(result, { status: result.valid ? 200 : 422 });
  } catch {
    return NextResponse.json(
      { valid: false, errors: ["Invalid cart validation request."] },
      { status: 400 }
    );
  }
}

