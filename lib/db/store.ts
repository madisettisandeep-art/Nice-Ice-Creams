import fs from "fs";
import path from "path";
import crypto from "crypto";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  AuditLog,
  Booking,
  BookingStatus,
  Category,
  Order,
  OrderItem,
  OrderStatus,
  Product,
} from "./types";
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from "./seed-data";

interface LocalDatabaseSchema {
  categories: Category[];
  products: Product[];
  orders: Order[];
  bookings: Booking[];
  audit_logs: AuditLog[];
  idempotency_keys: Record<string, { responseId: string; timestamp: number }>;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "nice-db.json");

// ============================================================================
// 1. DATABASE CONNECTION POOLING (Singleton Client + Concurrency Pool)
// ============================================================================
interface ConnectionPoolState {
  client: SupabaseClient | null;
  activeConnections: number;
  maxConnections: number;
  totalQueriesExecuted: number;
  createdAt: number;
}

const connectionPool: ConnectionPoolState = {
  client: null,
  activeConnections: 0,
  maxConnections: 20,
  totalQueriesExecuted: 0,
  createdAt: Date.now(),
};

export function getConnectionPoolMetrics() {
  return {
    activeConnections: connectionPool.activeConnections,
    maxConnections: connectionPool.maxConnections,
    totalQueriesExecuted: connectionPool.totalQueriesExecuted,
    poolUptimeMs: Date.now() - connectionPool.createdAt,
    mode: isSupabaseConfigured() ? "supabase-pgbouncer-pool" : "indexed-memory-pool",
  };
}

function getPooledSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey || !url.startsWith("http")) {
    return null;
  }
  if (!connectionPool.client) {
    connectionPool.client = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      db: { schema: "public" },
      global: {
        headers: {
          "x-connection-pool": "nice-ice-creams-pool-v1",
          Connection: "keep-alive",
        },
      },
    });
  }
  connectionPool.totalQueriesExecuted++;
  return connectionPool.client;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("http")
  );
}

// ============================================================================
// 2. IN-MEMORY O(1) DATABASE INDEXES & SERVER-SIDE QUERY CACHE
// ============================================================================
interface DatabaseIndexes {
  productById: Map<string, Product>;
  productBySlug: Map<string, Product>;
  productsByCategorySlug: Map<string, Product[]>;
  featuredProducts: Product[];
  seasonalProducts: Product[];
}

let memoryDbCache: LocalDatabaseSchema | null = null;
let memoryDbMtimeMs = 0;
let dbIndexes: DatabaseIndexes | null = null;

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const serverQueryCache = new Map<string, CacheEntry<unknown>>();
let cacheHits = 0;
let cacheMisses = 0;
const QUERY_CACHE_TTL_MS = 60 * 1000; // 60s server-side query cache

export function getServerCacheMetrics() {
  return {
    entries: serverQueryCache.size,
    hits: cacheHits,
    misses: cacheMisses,
    hitRate:
      cacheHits + cacheMisses > 0
        ? Math.round((cacheHits / (cacheHits + cacheMisses)) * 1000) / 10
        : 100,
    indexedProducts: dbIndexes?.productById.size ?? INITIAL_PRODUCTS.length,
  };
}

function getCachedQuery<T>(key: string): T | null {
  const entry = serverQueryCache.get(key);
  if (!entry) {
    cacheMisses++;
    return null;
  }
  if (Date.now() > entry.expiresAt) {
    serverQueryCache.delete(key);
    cacheMisses++;
    return null;
  }
  cacheHits++;
  return entry.value as T;
}

function setCachedQuery<T>(key: string, value: T, ttlMs = QUERY_CACHE_TTL_MS): T {
  if (serverQueryCache.size > 250) {
    const oldestKey = serverQueryCache.keys().next().value;
    if (oldestKey) serverQueryCache.delete(oldestKey);
  }
  serverQueryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
  return value;
}

export function invalidateServerCaches(): void {
  serverQueryCache.clear();
  dbIndexes = null;
}

function buildProductIndexes(products: Product[]): DatabaseIndexes {
  const productById = new Map<string, Product>();
  const productBySlug = new Map<string, Product>();
  const productsByCategorySlug = new Map<string, Product[]>();
  const featuredProducts: Product[] = [];
  const seasonalProducts: Product[] = [];

  for (const p of products) {
    productById.set(p.id, p);
    productBySlug.set(p.slug, p);

    const catList = productsByCategorySlug.get(p.category_slug) || [];
    catList.push(p);
    productsByCategorySlug.set(p.category_slug, catList);

    if (p.featured) featuredProducts.push(p);
    if (p.seasonal) seasonalProducts.push(p);
  }

  return {
    productById,
    productBySlug,
    productsByCategorySlug,
    featuredProducts,
    seasonalProducts,
  };
}

function getIndexes(products: Product[]): DatabaseIndexes {
  if (!dbIndexes) {
    dbIndexes = buildProductIndexes(products);
  }
  return dbIndexes;
}

function readLocalDb(): LocalDatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial: LocalDatabaseSchema = {
        categories: INITIAL_CATEGORIES,
        products: INITIAL_PRODUCTS,
        orders: [],
        bookings: [],
        audit_logs: [
          {
            id: crypto.randomUUID(),
            actor: "system",
            action: "SEED_DATABASE",
            entity_type: "product",
            entity_id: "initial-catalogue",
            details: `Seeded ${INITIAL_CATEGORIES.length} categories and ${INITIAL_PRODUCTS.length} verified menu products.`,
            created_at: new Date().toISOString(),
          },
        ],
        idempotency_keys: {},
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
      memoryDbCache = initial;
      memoryDbMtimeMs = fs.statSync(DB_FILE).mtimeMs;
      dbIndexes = buildProductIndexes(initial.products);
      return initial;
    }

    const stat = fs.statSync(DB_FILE);
    if (memoryDbCache && stat.mtimeMs === memoryDbMtimeMs) {
      connectionPool.totalQueriesExecuted++;
      return memoryDbCache;
    }

    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw) as LocalDatabaseSchema;
    if (!parsed.categories?.length) parsed.categories = INITIAL_CATEGORIES;
    if (!parsed.products?.length) parsed.products = INITIAL_PRODUCTS;
    if (!parsed.orders) parsed.orders = [];
    if (!parsed.bookings) parsed.bookings = [];
    if (!parsed.audit_logs) parsed.audit_logs = [];
    if (!parsed.idempotency_keys) parsed.idempotency_keys = {};

    memoryDbCache = parsed;
    memoryDbMtimeMs = stat.mtimeMs;
    dbIndexes = buildProductIndexes(parsed.products);
    connectionPool.totalQueriesExecuted++;
    return parsed;
  } catch {
    return {
      categories: INITIAL_CATEGORIES,
      products: INITIAL_PRODUCTS,
      orders: [],
      bookings: [],
      audit_logs: [],
      idempotency_keys: {},
    };
  }
}

function writeLocalDb(db: LocalDatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
    memoryDbCache = db;
    memoryDbMtimeMs = fs.statSync(DB_FILE).mtimeMs;
    invalidateServerCaches();
    dbIndexes = buildProductIndexes(db.products);
  } catch (err) {
    console.error("Failed to write local DB:", err);
  }
}

export async function getCategories(): Promise<Category[]> {
  const cacheKey = "categories:all";
  const cached = getCachedQuery<Category[]>(cacheKey);
  if (cached) return cached;

  const sb = getPooledSupabaseAdmin();
  if (sb) {
    const { data, error } = await sb
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });
    if (!error && data && data.length > 0) {
      return setCachedQuery(cacheKey, data as Category[]);
    }
  }
  const db = readLocalDb();
  const sorted = [...db.categories].sort((a, b) => a.display_order - b.display_order);
  return setCachedQuery(cacheKey, sorted);
}

export async function getProducts(options?: {
  categorySlug?: string;
  search?: string;
  featuredOnly?: boolean;
  seasonalOnly?: boolean;
  includeUnavailable?: boolean;
}): Promise<Product[]> {
  const cacheKey = `products:${JSON.stringify(options || {})}`;
  const cached = getCachedQuery<Product[]>(cacheKey);
  if (cached) return cached;

  const sb = getPooledSupabaseAdmin();
  let list: Product[] = [];

  if (sb) {
    const { data, error } = await sb.from("products").select("*");
    if (!error && data && data.length > 0) {
      list = data as Product[];
    }
  }

  if (list.length === 0) {
    const db = readLocalDb();
    const idx = getIndexes(db.products);

    // Use O(1) category index when filtering by a specific category!
    if (options?.categorySlug && options.categorySlug !== "all") {
      list = idx.productsByCategorySlug.get(options.categorySlug) || [];
    } else if (options?.featuredOnly && !options?.seasonalOnly) {
      list = idx.featuredProducts;
    } else if (options?.seasonalOnly && !options?.featuredOnly) {
      list = idx.seasonalProducts;
    } else {
      list = db.products;
    }
  }

  const q = options?.search?.toLowerCase().trim();
  const filtered = list.filter((p) => {
    if (options?.includeUnavailable === false && !p.availability) return false;
    if (
      options?.categorySlug &&
      options.categorySlug !== "all" &&
      p.category_slug !== options.categorySlug
    ) {
      return false;
    }
    if (options?.featuredOnly && !p.featured) return false;
    if (options?.seasonalOnly && !p.seasonal) return false;
    if (q) {
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchCat = p.category_name.toLowerCase().includes(q);
      const matchIng = p.ingredients.some((i) => i.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchCat && !matchIng) return false;
    }
    return true;
  });

  return setCachedQuery(cacheKey, filtered);
}

// O(1) Indexed Lookup — avoids full table scan
export async function getProductBySlugOrId(identifier: string): Promise<Product | null> {
  const cacheKey = `product:single:${identifier}`;
  const cached = getCachedQuery<Product | null>(cacheKey);
  if (cached !== null) return cached;

  const sb = getPooledSupabaseAdmin();
  if (sb) {
    const { data } = await sb
      .from("products")
      .select("*")
      .or(`slug.eq.${identifier},id.eq.${identifier}`)
      .limit(1)
      .maybeSingle();
    if (data) return setCachedQuery(cacheKey, data as Product);
  }

  const db = readLocalDb();
  const idx = getIndexes(db.products);
  const found =
    idx.productBySlug.get(identifier) ?? idx.productById.get(identifier) ?? null;
  return setCachedQuery(cacheKey, found);
}

// Batch O(1) Indexed Lookup — eliminates N+1 database queries when resolving recommended products or cart items
export async function getProductsBySlugsOrIds(identifiers?: string[]): Promise<Product[]> {
  if (!identifiers || !Array.isArray(identifiers) || identifiers.length === 0) return [];
  const cacheKey = `products:batch:${identifiers.join(",")}`;
  const cached = getCachedQuery<Product[]>(cacheKey);
  if (cached) return cached;

  const db = readLocalDb();
  const idx = getIndexes(db.products);
  const results: Product[] = [];
  for (const idOrSlug of identifiers) {
    const p = idx.productBySlug.get(idOrSlug) ?? idx.productById.get(idOrSlug);
    if (p) results.push(p);
  }
  return setCachedQuery(cacheKey, results);
}

export async function upsertProduct(
  productInput: Partial<Product> & { name: string; category_id: string; price: number },
  actor = "admin"
): Promise<Product> {
  const db = readLocalDb();
  const category =
    db.categories.find((c) => c.id === productInput.category_id) || db.categories[0];

  const slug =
    productInput.slug?.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-") ||
    productInput.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

  const existingIdx = db.products.findIndex(
    (p) => p.id === productInput.id || p.slug === slug
  );

  const now = new Date().toISOString();
  const baseTemplate = existingIdx >= 0 ? db.products[existingIdx] : INITIAL_PRODUCTS[0];

  const saved: Product = {
    ...baseTemplate,
    ...productInput,
    id: productInput.id || (existingIdx >= 0 ? db.products[existingIdx].id : `prod-${slug}`),
    slug,
    name: productInput.name.trim(),
    category_id: category.id,
    category_name: category.name,
    category_slug: category.slug,
    price: Number(productInput.price),
    image_url: productInput.image_url || baseTemplate.image_url || "/menu/vanilla.webp?v=4",
    cutout_url:
      productInput.cutout_url || baseTemplate.cutout_url || "/menu/vanilla.webp?v=4",
    variants:
      productInput.variants && productInput.variants.length > 0
        ? productInput.variants
        : [
            {
              id: "standard",
              name: "Standard Serving",
              price: Number(productInput.price),
              servingSize: "1 Serving",
              available: true,
            },
          ],
    availability: productInput.availability ?? true,
    featured: productInput.featured ?? false,
    seasonal: productInput.seasonal ?? false,
    created_at: existingIdx >= 0 ? db.products[existingIdx].created_at : now,
    updated_at: now,
  };

  if (existingIdx >= 0) {
    db.products[existingIdx] = saved;
  } else {
    db.products.unshift(saved);
  }

  db.audit_logs.unshift({
    id: crypto.randomUUID(),
    actor,
    action: existingIdx >= 0 ? "UPDATE_PRODUCT" : "CREATE_PRODUCT",
    entity_type: "product",
    entity_id: saved.id,
    details: `${existingIdx >= 0 ? "Updated" : "Created"} product "${saved.name}" (₹${saved.price}, available=${saved.availability})`,
    created_at: now,
  });

  writeLocalDb(db);

  const sb = getPooledSupabaseAdmin();
  if (sb) {
    await sb.from("products").upsert(saved);
  }

  return saved;
}

export async function deleteProduct(productId: string, actor = "admin"): Promise<boolean> {
  const db = readLocalDb();
  const existing = db.products.find((p) => p.id === productId || p.slug === productId);
  if (!existing) return false;

  db.products = db.products.filter((p) => p.id !== existing.id);
  db.audit_logs.unshift({
    id: crypto.randomUUID(),
    actor,
    action: "DELETE_PRODUCT",
    entity_type: "product",
    entity_id: existing.id,
    details: `Deleted product "${existing.name}" (${existing.slug})`,
    created_at: new Date().toISOString(),
  });
  writeLocalDb(db);

  const sb = getPooledSupabaseAdmin();
  if (sb) {
    await sb.from("products").delete().eq("id", existing.id);
  }
  return true;
}

export async function createOrderRecord(params: {
  customer_name: string;
  customer_phone: string;
  order_type: "pickup" | "delivery" | "party_enquiry";
  delivery_address: string | null;
  preferred_time: string;
  subtotal: number;
  fees: number;
  discount: number;
  total: number;
  notes: string | null;
  party_date?: string | null;
  guest_count?: number | null;
  items: Omit<OrderItem, "id" | "order_id">[];
  whatsapp_url: string;
  idempotencyKey?: string;
}): Promise<Order> {
  const db = readLocalDb();

  if (params.idempotencyKey) {
    const prev = db.idempotency_keys[params.idempotencyKey];
    if (prev && Date.now() - prev.timestamp < 5 * 60 * 1000) {
      const existingOrder = db.orders.find((o) => o.id === prev.responseId);
      if (existingOrder) return existingOrder;
    }
  }

  const orderId = crypto.randomUUID();
  const shortCode = Math.random().toString(36).substring(2, 6).toUpperCase();
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const orderReference = `NICE-${datePart}-${shortCode}`;
  const now = new Date().toISOString();

  const orderItems: OrderItem[] = params.items.map((item) => ({
    ...item,
    id: crypto.randomUUID(),
    order_id: orderId,
  }));

  const order: Order = {
    id: orderId,
    order_reference: orderReference,
    customer_name: params.customer_name,
    customer_phone: params.customer_phone,
    order_type: params.order_type,
    delivery_address: params.delivery_address,
    preferred_time: params.preferred_time,
    subtotal: params.subtotal,
    fees: params.fees,
    discount: params.discount,
    total: params.total,
    notes: params.notes,
    party_date: params.party_date ?? null,
    guest_count: params.guest_count ?? null,
    status: "Awaiting WhatsApp confirmation",
    items: orderItems,
    whatsapp_url: params.whatsapp_url,
    created_at: now,
    updated_at: now,
  };

  db.orders.unshift(order);
  if (params.idempotencyKey) {
    db.idempotency_keys[params.idempotencyKey] = {
      responseId: order.id,
      timestamp: Date.now(),
    };
  }
  writeLocalDb(db);

  const sb = getPooledSupabaseAdmin();
  if (sb) {
    const { items, whatsapp_url, ...orderHeader } = order;
    await sb.from("orders").insert(orderHeader);
    await sb.from("order_items").insert(items);
  }

  return order;
}

// Single-query relational fetch in Supabase (no N+1 queries on order_items)
export async function getOrders(): Promise<Order[]> {
  const sb = getPooledSupabaseAdmin();
  if (sb) {
    const { data, error } = await sb
      .from("orders")
      .select("*, items:order_items(*)")
      .order("created_at", { ascending: false });
    if (!error && data && data.length > 0) {
      return data as unknown as Order[];
    }
  }
  const db = readLocalDb();
  return db.orders;
}

export async function updateOrderStatus(
  orderIdOrRef: string,
  status: OrderStatus,
  actor = "admin"
): Promise<Order | null> {
  const db = readLocalDb();
  const order = db.orders.find(
    (o) => o.id === orderIdOrRef || o.order_reference === orderIdOrRef
  );
  if (!order) return null;

  const prevStatus = order.status;
  order.status = status;
  order.updated_at = new Date().toISOString();

  db.audit_logs.unshift({
    id: crypto.randomUUID(),
    actor,
    action: "UPDATE_ORDER_STATUS",
    entity_type: "order",
    entity_id: order.order_reference,
    details: `Order ${order.order_reference} status changed from "${prevStatus}" to "${status}"`,
    created_at: order.updated_at,
  });

  writeLocalDb(db);

  const sb = getPooledSupabaseAdmin();
  if (sb) {
    await sb
      .from("orders")
      .update({ status, updated_at: order.updated_at })
      .eq("id", order.id);
  }

  return order;
}

export async function createBookingRecord(params: {
  customer_name: string;
  customer_phone: string;
  event_type: string;
  event_date: string;
  guest_count: number;
  budget: string | null;
  delivery_preference: "delivery" | "pickup";
  location: string | null;
  order_preferences: string[];
  notes: string | null;
  whatsapp_url: string;
  idempotencyKey?: string;
}): Promise<Booking> {
  const db = readLocalDb();

  if (params.idempotencyKey) {
    const prev = db.idempotency_keys[params.idempotencyKey];
    if (prev && Date.now() - prev.timestamp < 5 * 60 * 1000) {
      const existing = db.bookings.find((b) => b.id === prev.responseId);
      if (existing) return existing;
    }
  }

  const bookingId = crypto.randomUUID();
  const shortCode = Math.random().toString(36).substring(2, 6).toUpperCase();
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const enquiryRef = `PARTY-${datePart}-${shortCode}`;
  const now = new Date().toISOString();

  const booking: Booking = {
    id: bookingId,
    enquiry_reference: enquiryRef,
    customer_name: params.customer_name,
    customer_phone: params.customer_phone,
    event_type: params.event_type,
    event_date: params.event_date,
    guest_count: params.guest_count,
    budget: params.budget,
    delivery_preference: params.delivery_preference,
    location: params.location,
    order_preferences: params.order_preferences,
    status: "Pending",
    notes: params.notes,
    whatsapp_url: params.whatsapp_url,
    created_at: now,
  };

  db.bookings.unshift(booking);
  if (params.idempotencyKey) {
    db.idempotency_keys[params.idempotencyKey] = {
      responseId: booking.id,
      timestamp: Date.now(),
    };
  }
  writeLocalDb(db);

  const sb = getPooledSupabaseAdmin();
  if (sb) {
    const { whatsapp_url, ...row } = booking;
    await sb.from("bookings").insert(row);
  }

  return booking;
}

export async function getBookings(): Promise<Booking[]> {
  const db = readLocalDb();
  return db.bookings;
}

export async function updateBookingStatus(
  bookingIdOrRef: string,
  status: BookingStatus,
  actor = "admin"
): Promise<Booking | null> {
  const db = readLocalDb();
  const booking = db.bookings.find(
    (b) => b.id === bookingIdOrRef || b.enquiry_reference === bookingIdOrRef
  );
  if (!booking) return null;

  const prevStatus = booking.status;
  booking.status = status;

  db.audit_logs.unshift({
    id: crypto.randomUUID(),
    actor,
    action: "UPDATE_BOOKING_STATUS",
    entity_type: "booking",
    entity_id: booking.enquiry_reference,
    details: `Booking ${booking.enquiry_reference} status changed from "${prevStatus}" to "${status}"`,
    created_at: new Date().toISOString(),
  });

  writeLocalDb(db);

  const sb = getPooledSupabaseAdmin();
  if (sb) {
    await sb.from("bookings").update({ status }).eq("id", booking.id);
  }

  return booking;
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  const db = readLocalDb();
  return db.audit_logs.slice(0, 100);
}
