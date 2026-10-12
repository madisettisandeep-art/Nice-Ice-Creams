-- ============================================================================
-- NICE ICE CREAMS (Est. 1986) — PostgreSQL / Supabase Production Schema
-- Includes tables, constraints, indexes, triggers, and Row-Level Security (RLS)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  subtitle TEXT NOT NULL DEFAULT '',
  accent_color TEXT NOT NULL DEFAULT '#0064B5',
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_categories_display_order ON public.categories(display_order);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  category_name TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  cutout_url TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  variants JSONB NOT NULL DEFAULT '[]'::jsonb,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  allergens JSONB NOT NULL DEFAULT '[]'::jsonb,
  availability BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
  seasonal BOOLEAN NOT NULL DEFAULT false,
  recommended_slugs JSONB NOT NULL DEFAULT '[]'::jsonb,
  exploded_spec JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_category_slug_avail ON public.products(category_slug, availability);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_products_seasonal ON public.products(seasonal) WHERE seasonal = true;
CREATE INDEX IF NOT EXISTS idx_products_availability ON public.products(availability);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_ingredients_gin ON public.products USING GIN (ingredients);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_reference TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  order_type TEXT NOT NULL CHECK (order_type IN ('pickup', 'delivery', 'party_enquiry')),
  delivery_address TEXT,
  preferred_time TEXT NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  fees NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (fees >= 0),
  discount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  notes TEXT,
  party_date TEXT,
  guest_count INTEGER,
  status TEXT NOT NULL DEFAULT 'Awaiting WhatsApp confirmation' CHECK (
    status IN (
      'Draft',
      'Awaiting WhatsApp confirmation',
      'Confirmed',
      'Preparing',
      'Ready for pickup',
      'Out for delivery',
      'Completed',
      'Cancelled'
    )
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_reference ON public.orders(order_reference);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 4. ORDER ITEMS TABLE (Preserves historical snapshots)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_slug TEXT NOT NULL,
  product_name_snapshot TEXT NOT NULL,
  variant_snapshot TEXT NOT NULL,
  unit_price_snapshot NUMERIC(10, 2) NOT NULL CHECK (unit_price_snapshot >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0 AND quantity <= 200),
  line_total NUMERIC(10, 2) NOT NULL CHECK (line_total >= 0)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- 5. PARTY BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enquiry_reference TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date TEXT NOT NULL,
  guest_count INTEGER NOT NULL CHECK (guest_count > 0),
  budget TEXT,
  delivery_preference TEXT NOT NULL DEFAULT 'delivery' CHECK (delivery_preference IN ('delivery', 'pickup')),
  location TEXT,
  order_preferences JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Declined')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_reference ON public.bookings(enquiry_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);

-- 6. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public read-only access for categories and products
CREATE POLICY "Public can read categories"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Public can read products"
  ON public.products FOR SELECT
  USING (true);

-- Orders, Order Items, Bookings, and Audit Logs are strictly restricted to
-- server-side Service Role API routes (no direct client table mutations).

