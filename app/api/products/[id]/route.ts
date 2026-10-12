import { NextRequest, NextResponse } from "next/server";
import {
  deleteProduct,
  getProductBySlugOrId,
  upsertProduct,
} from "@/lib/db/store";
import { verifyAdminRequest } from "@/lib/security/auth";
import { AdminProductInputSchema } from "@/lib/validation/schemas";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const product = await getProductBySlugOrId(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ product });
}

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
  const existing = await getProductBySlugOrId(id);
  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const merged = {
      ...existing,
      ...body,
      id: existing.id,
      name: body.name ?? existing.name,
      category_id: body.category_id ?? existing.category_id,
      description: body.description ?? existing.description,
      price: body.price !== undefined ? Number(body.price) : existing.price,
    };

    const parsed = AdminProductInputSchema.safeParse(merged);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid product update payload",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // If base price changed and variants weren't explicitly overridden, sync standard/regular variant price
    let updatedVariants = parsed.data.variants || existing.variants;
    if (
      body.price !== undefined &&
      !body.variants &&
      updatedVariants.length > 0
    ) {
      updatedVariants = updatedVariants.map((v, idx) =>
        idx === 0 ? { ...v, price: Number(body.price) } : v
      );
    }

    const saved = await upsertProduct(
      {
        ...existing,
        ...parsed.data,
        variants: updatedVariants,
      },
      admin.actor
    );

    return NextResponse.json({ product: saved });
  } catch {
    return NextResponse.json(
      { error: "Failed to update product." },
      { status: 400 }
    );
  }
}

export async function DELETE(
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
  const deleted = await deleteProduct(id, admin.actor);
  if (!deleted) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ deleted: true });
}

