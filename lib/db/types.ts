export type OrderStatus =
  | "Draft"
  | "Awaiting WhatsApp confirmation"
  | "Confirmed"
  | "Preparing"
  | "Ready for pickup"
  | "Out for delivery"
  | "Completed"
  | "Cancelled";

export type BookingStatus = "Pending" | "Confirmed" | "Declined";

export type OrderType = "pickup" | "delivery" | "party_enquiry";

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  servingSize?: string;
  available: boolean;
}

export interface ExplodedScoopPalette {
  vesselType: "wooden-bowl" | "glass-coupe" | "waffle-cone" | "sizzler-pan" | "tall-glass" | "sundae-boat";
  vesselColor: string;
  primaryScoopColor: string;
  secondaryScoopColor: string;
  sauceColor: string;
  toppingType: "almonds-cashews" | "choco-chips" | "berries-fruit" | "pistachio-crumb" | "caramel-praline" | "oreo-cookie";
  toppingColor: string;
  ambientGlow: string;
  layers: {
    id: string;
    label: string;
    detail: string;
    elevationY: number;
  }[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category_id: string;
  category_name: string;
  category_slug: string;
  description: string;
  image_url: string;
  cutout_url: string;
  price: number;
  variants: ProductVariant[];
  ingredients: string[];
  allergens: string[];
  availability: boolean;
  featured: boolean;
  seasonal: boolean;
  recommended_slugs: string[];
  exploded_spec: ExplodedScoopPalette;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  accent_color: string;
  display_order: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_slug: string;
  product_name_snapshot: string;
  variant_snapshot: string;
  unit_price_snapshot: number;
  quantity: number;
  line_total: number;
}

export interface Order {
  id: string;
  order_reference: string;
  customer_name: string;
  customer_phone: string;
  order_type: OrderType;
  delivery_address: string | null;
  preferred_time: string;
  subtotal: number;
  fees: number;
  discount: number;
  total: number;
  notes: string | null;
  party_date?: string | null;
  guest_count?: number | null;
  status: OrderStatus;
  items: OrderItem[];
  whatsapp_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  enquiry_reference: string;
  customer_name: string;
  customer_phone: string;
  event_type: string;
  event_date: string;
  guest_count: number;
  budget: string | null;
  delivery_preference: "delivery" | "pickup";
  location: string | null;
  order_preferences: string[];
  status: BookingStatus;
  notes: string | null;
  whatsapp_url?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  entity_type: "product" | "order" | "booking" | "category" | "auth";
  entity_id: string;
  details: string;
  created_at: string;
}

export interface HeroShotSpec {
  shotNumber: number;
  code: string;
  title: string;
  subtitle: string;
  caption: string;
  videoSrc: string;
  posterSrc: string;
  accentColor: string;
  scrollStart: number;
  scrollEnd: number;
}

