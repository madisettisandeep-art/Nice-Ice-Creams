import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  getCategories,
  getProducts,
  invalidateServerCaches,
  upsertProduct,
} from "@/lib/db/store";
import { verifyAdminRequest } from "@/lib/security/auth";
import { AdminProductInputSchema } from "@/lib/validation/schemas";

const UPSTREAM_NODES = ["nice-edge-in-hyd-1", "nice-edge-in-hyd-2", "nice-edge-in-blr-1"];
let rrIndex = 0;

function selectLoadBalancedNode(): string {
  const node = UPSTREAM_NODES[rrIndex % UPSTREAM_NODES.length];
  rrIndex = (rrIndex + 1) % UPSTREAM_NODES.length;
  return node;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;
  const featured = searchParams.get("featured") === "true";
  const seasonal = searchParams.get("seasonal") === "true";
  const compact = searchParams.get("compact") === "true";

  // Optional Pagination parameters (?page=1&limit=24)
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");

  const [categories, allFilteredProducts] = await Promise.all([
    getCategories(),
    getProducts({
      categorySlug: category,
      search,
      featuredOnly: featured || undefined,
      seasonalOnly: seasonal || undefined,
      includeUnavailable: true,
    }),
  ]);

  let products = allFilteredProducts;
  let pagination:
    | {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasMore: boolean;
      }
    | undefined;

  if (pageParam || limitParam) {
    const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(limitParam || "24", 10) || 24));
    const start = (page - 1) * limit;
    products = allFilteredProducts.slice(start, start + limit);
    const totalPages = Math.max(1, Math.ceil(allFilteredProducts.length / limit));
    pagination = {
      page,
      limit,
      total: allFilteredProducts.length,
      totalPages,
      hasMore: page < totalPages,
    };
  }

  // Payload compression: strip only unused cutout_url when compact=true, preserving exploded_spec.layers for the product modal
  const serializedProducts = compact
    ? products.map(({ cutout_url: _cutout, ...rest }) => rest)
    : products;

  const payloadObj = pagination
    ? { categories, products: serializedProducts, pagination }
    : { categories, products: serializedProducts };

  const bodyString = JSON.stringify(payloadObj);
  const etag = `W/"${crypto.createHash("sha1").update(bodyString).digest("hex").slice(0, 20)}"`;
  const upstreamNode = selectLoadBalancedNode();

  // ETag conditional request check -> instant 304 Not Modified with zero payload transfer
  const ifNoneMatch = req.headers.get("if-none-match");
  if (ifNoneMatch && ifNoneMatch === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        ETag: etag,
        "Cache-Control": "public, max-age=30, s-maxage=120, stale-while-revalidate=300",
        "CDN-Cache-Control": "public, max-age=120, stale-while-revalidate=600",
        "X-Upstream-Node": upstreamNode,
      },
    });
  }

  return new NextResponse(bodyString, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ETag: etag,
      Vary: "Accept-Encoding",
      "Cache-Control": "public, max-age=30, s-maxage=120, stale-while-revalidate=300",
      "CDN-Cache-Control": "public, max-age=120, stale-while-revalidate=600",
      "X-Upstream-Node": upstreamNode,
    },
  });
}

export async function POST(req: NextRequest) {
  const admin = verifyAdminRequest(req);
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized. Admin authentication required." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const parsed = AdminProductInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const saved = await upsertProduct(parsed.data, admin.actor);
    invalidateServerCaches();
    return NextResponse.json({ product: saved }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  }
}
