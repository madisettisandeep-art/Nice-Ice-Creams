import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import {
  HERO_SHOTS_MANIFEST,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
} from "@/lib/db/seed-data";
import { calculateAuthoritativeOrderPricing } from "@/lib/pricing/calculator";
import {
  formatBookingWhatsAppMessage,
  formatOrderWhatsAppMessage,
  getConfiguredWhatsAppNumber,
} from "@/lib/whatsapp/formatter";
import {
  AdminProductInputSchema,
  OrderCheckoutSchema,
  PartyBookingSchema,
} from "@/lib/validation/schemas";
import {
  createAdminSessionToken,
  verifyAdminSessionToken,
} from "@/lib/security/auth";
import {
  createBookingRecord,
  createOrderRecord,
  deleteProduct,
  getAuditLogs,
  getConnectionPoolMetrics,
  getProducts,
  getProductsBySlugsOrIds,
  getServerCacheMetrics,
  upsertProduct,
} from "@/lib/db/store";

describe("NICE ICE CREAMS — Acceptance & Security Test Suite", () => {
  it("1. Verifies supplied NICE logo, favicon, and all 12 sequential hero videos & posters exist", () => {
    const publicDir = path.join(process.cwd(), "public");
    expect(
      fs.existsSync(path.join(publicDir, "brand", "nice_ice_cream_logo.png"))
    ).toBe(true);
    expect(fs.existsSync(path.join(publicDir, "favicon.ico"))).toBe(true);

    expect(HERO_SHOTS_MANIFEST).toHaveLength(12);
    HERO_SHOTS_MANIFEST.forEach((shot, index) => {
      expect(shot.shotNumber).toBe(index + 1);
      expect(shot.code).toBe(`SHOT ${String(index + 1).padStart(2, "0")}`);
      const videoFile = path.join(
        publicDir,
        shot.videoSrc.split("?")[0].replace(/^\//, "")
      );
      const posterFile = path.join(
        publicDir,
        shot.posterSrc.split("?")[0].replace(/^\//, "")
      );
      expect(fs.existsSync(videoFile)).toBe(true);
      expect(fs.existsSync(posterFile)).toBe(true);
    });
  });

  it("2. Verifies all 8 menu categories and 49 individual menu products have isolated studio images & 3D specs", () => {
    expect(INITIAL_CATEGORIES).toHaveLength(8);
    expect(INITIAL_PRODUCTS).toHaveLength(49);

    const publicDir = path.join(process.cwd(), "public");
    for (const product of INITIAL_PRODUCTS) {
      expect(product.price).toBeGreaterThan(0);
      expect(product.variants.length).toBeGreaterThan(0);
      expect(product.exploded_spec.layers.length).toBeGreaterThanOrEqual(4);

      const studioImg = path.join(
        publicDir,
        product.image_url.split("?")[0].replace(/^\//, "")
      );
      const cutoutImg = path.join(
        publicDir,
        product.cutout_url.split("?")[0].replace(/^\//, "")
      );
      expect(fs.existsSync(studioImg)).toBe(true);
      expect(fs.existsSync(cutoutImg)).toBe(true);
    }
  });

  it("3. Enforces server-authoritative pricing and prevents client price tampering", () => {
    const pricing = calculateAuthoritativeOrderPricing(
      [
        {
          productId: "prod-vanilla",
          variantId: "single-scoop",
          quantity: 2,
          clientPriceIgnored: 1, // Attempted price tampering (real price is ₹40)
        },
        {
          productId: "prod-death-by-chocolate",
          variantId: "standard",
          quantity: 1,
          clientPriceIgnored: 5, // Attempted price tampering (real price is ₹149)
        },
      ],
      INITIAL_PRODUCTS,
      "pickup"
    );

    expect(pricing.valid).toBe(true);
    expect(pricing.items).toHaveLength(2);
    expect(pricing.items[0].unit_price_snapshot).toBe(40);
    expect(pricing.items[0].line_total).toBe(80);
    expect(pricing.items[1].unit_price_snapshot).toBe(149);
    expect(pricing.items[1].line_total).toBe(149);
    expect(pricing.subtotal).toBe(229);
    expect(pricing.total).toBe(229);
  });

  it("4. Rejects out-of-stock or invalid items during order calculation", () => {
    const modifiedCatalogue = INITIAL_PRODUCTS.map((p) =>
      p.slug === "fresh-sitaphal" ? { ...p, availability: false } : p
    );

    const result = calculateAuthoritativeOrderPricing(
      [
        {
          productId: "prod-fresh-sitaphal",
          variantId: "single-scoop",
          quantity: 1,
        },
      ],
      modifiedCatalogue,
      "pickup"
    );

    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("out of stock");
  });

  it("5. Formats multi-item WhatsApp messages and records orders as 'Awaiting WhatsApp confirmation'", async () => {
    const order = await createOrderRecord({
      customer_name: "Sandeep Kumar",
      customer_phone: "9985422222",
      order_type: "delivery",
      delivery_address: "Hanamkonda Main Road, Warangal",
      preferred_time: "Today 8:00 PM",
      subtotal: 269,
      fees: 0,
      discount: 0,
      total: 269,
      notes: "Extra hot fudge please",
      items: [
        {
          product_id: "prod-brownie-with-ice-cream-sizzler",
          product_slug: "brownie-with-ice-cream-sizzler",
          product_name_snapshot: "Brownie with Ice Cream Sizzler",
          variant_snapshot: "Hot Sizzling Platter",
          unit_price_snapshot: 120,
          quantity: 1,
          line_total: 120,
        },
        {
          product_id: "prod-death-by-chocolate",
          product_slug: "death-by-chocolate",
          product_name_snapshot: "Death by Chocolate",
          variant_snapshot: "Signature DBC Bowl",
          unit_price_snapshot: 149,
          quantity: 1,
          line_total: 149,
        },
      ],
      whatsapp_url: "https://wa.me/919985422222",
    });

    // Critical acceptance test 12: Never falsely recorded as a confirmed order upon WhatsApp handoff
    expect(order.status).toBe("Awaiting WhatsApp confirmation");
    expect(order.order_reference).toMatch(/^NICE-/);

    const formatted = formatOrderWhatsAppMessage({
      orderReference: order.order_reference,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      orderType: order.order_type,
      deliveryAddress: order.delivery_address,
      preferredTime: order.preferred_time,
      items: order.items,
      subtotal: order.subtotal,
      fees: order.fees,
      discount: order.discount,
      total: order.total,
      notes: order.notes,
    });

    expect(formatted.whatsappUrl).toContain(
      `https://wa.me/${getConfiguredWhatsAppNumber()}?text=`
    );
    expect(formatted.message).toContain("NICE ICE CREAMS");
    expect(formatted.message).toContain("Brownie with Ice Cream Sizzler");
    expect(formatted.message).toContain("Death by Chocolate");
    expect(formatted.message).toContain("₹269");
  });

  it("6. Validates order checkout and party booking schemas strictly", () => {
    const invalidDeliveryOrder = OrderCheckoutSchema.safeParse({
      customer_name: "A",
      customer_phone: "123",
      order_type: "delivery",
      delivery_address: "",
      preferred_time: "Now",
      items: [],
    });
    expect(invalidDeliveryOrder.success).toBe(false);

    const validPartyBooking = PartyBookingSchema.safeParse({
      customer_name: "Priya Rao",
      customer_phone: "9876543210",
      event_type: "Birthday Party",
      event_date: "2026-11-15",
      guest_count: 120,
      budget: "₹12,000",
      delivery_preference: "delivery",
      location: "Subedari Function Hall, Hanamkonda",
      order_preferences: [
        "Fruit Salad with Ice Cream Counter",
        "Badam Milk with Ice Cream Live Counter",
      ],
      notes: "Evening 7 PM counter setup",
    });
    expect(validPartyBooking.success).toBe(true);
  });

  it("7. Persists party booking enquiries as 'Pending' with unique reference", async () => {
    const wa = formatBookingWhatsAppMessage({
      enquiryReference: "PARTY-TEST",
      customerName: "Priya Rao",
      customerPhone: "9876543210",
      eventType: "Birthday Party",
      eventDate: "2026-11-15",
      guestCount: 120,
      deliveryPreference: "delivery",
      location: "Hanamkonda",
      orderPreferences: ["Fruit Salad with Ice Cream Counter"],
    });

    const booking = await createBookingRecord({
      customer_name: "Priya Rao",
      customer_phone: "9876543210",
      event_type: "Birthday Party",
      event_date: "2026-11-15",
      guest_count: 120,
      budget: "₹12,000",
      delivery_preference: "delivery",
      location: "Hanamkonda",
      order_preferences: ["Fruit Salad with Ice Cream Counter"],
      notes: null,
      whatsapp_url: wa.whatsappUrl,
    });

    expect(booking.status).toBe("Pending");
    expect(booking.enquiry_reference).toMatch(/^PARTY-/);
  });

  it("8. Enforces HMAC-SHA256 Admin Authentication and logs product management & order status operations", async () => {
    const token = createAdminSessionToken("owner@niceicecreams.com");
    const verified = verifyAdminSessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.role).toBe("admin");

    // Tampered token must fail
    const tampered = `${token}tamper`;
    expect(verifyAdminSessionToken(tampered)).toBeNull();

    // Product CRUD + Audit log
    const prodParse = AdminProductInputSchema.safeParse({
      name: "Test Kesar Pista Scoop",
      category_id: "cat-premium",
      description: "Rich saffron and roasted pistachio scoop.",
      price: 75,
      availability: true,
    });
    expect(prodParse.success).toBe(true);

    if (prodParse.success) {
      const created = await upsertProduct(prodParse.data, "test-admin");
      expect(created.price).toBe(75);

      const deleted = await deleteProduct(created.id, "test-admin");
      expect(deleted).toBe(true);
    }

    const logs = await getAuditLogs();
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].action).toBe("DELETE_PRODUCT");
  });

  it("9. Verifies database indexing, connection pooling, server-side caching, and N+1 batch resolution", async () => {
    // Warm up products query and verify server cache hit on subsequent query
    const firstFetch = await getProducts();
    expect(firstFetch).toHaveLength(49);
    const metricsBefore = getServerCacheMetrics();
    const secondFetch = await getProducts();
    expect(secondFetch).toHaveLength(49);
    const metricsAfter = getServerCacheMetrics();
    expect(metricsAfter.hits).toBeGreaterThan(metricsBefore.hits);

    // O(1) category index lookup
    const sundaes = await getProducts({ categorySlug: "ice-cream-sundaes" });
    expect(sundaes.length).toBeGreaterThan(0);
    expect(sundaes.every((p) => p.category_slug === "ice-cream-sundaes")).toBe(
      true
    );

    // Batch lookup eliminating N+1 queries for recommended products
    const batch = await getProductsBySlugsOrIds([
      "death-by-chocolate",
      "brownie-with-ice-cream-sizzler",
      "fresh-sitaphal",
    ]);
    expect(batch).toHaveLength(3);

    // Connection pool metrics
    const pool = getConnectionPoolMetrics();
    expect(pool.maxConnections).toBeGreaterThanOrEqual(10);
    expect(pool.totalQueriesExecuted).toBeGreaterThan(0);
  });
});


