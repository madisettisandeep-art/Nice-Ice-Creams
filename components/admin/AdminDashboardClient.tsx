"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  AuditLog,
  Booking,
  BookingStatus,
  Category,
  Order,
  OrderStatus,
  Product,
} from "@/lib/db/types";
import {
  CheckCircle2,
  Download,
  Lock,
  LogOut,
  Package,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Upload,
  Users,
} from "lucide-react";

const ORDER_STATUSES: OrderStatus[] = [
  "Draft",
  "Awaiting WhatsApp confirmation",
  "Confirmed",
  "Preparing",
  "Ready for pickup",
  "Out for delivery",
  "Completed",
  "Cancelled",
];

const BOOKING_STATUSES: BookingStatus[] = ["Pending", "Confirmed", "Declined"];

export function AdminDashboardClient() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [actor, setActor] = useState("");
  const [supabaseConnected, setSupabaseConnected] = useState(false);

  // Login form state
  const [email, setEmail] = useState("owner@niceicecreams.com");
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  // Dashboard state
  const [activeTab, setActiveTab] = useState<
    "orders" | "products" | "bookings" | "audit"
  >("orders");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Product Form Modal / Drawer state
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdCat, setNewProdCat] = useState("cat-classic");
  const [newProdPrice, setNewProdPrice] = useState("60");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdImage, setNewProdImage] = useState("/menu/vanilla.webp");
  const [newProdSeasonal, setNewProdSeasonal] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  const loadAdminData = useCallback(async () => {
    try {
      const [authRes, prodRes, ordRes, bookRes] = await Promise.all([
        fetch("/api/admin/auth"),
        fetch("/api/products"),
        fetch("/api/orders"),
        fetch("/api/bookings"),
      ]);

      if (!authRes.ok) {
        setAuthenticated(false);
        setCheckingAuth(false);
        return;
      }

      const authData = await authRes.json();
      setAuthenticated(true);
      setActor(authData.actor || "admin");
      setSupabaseConnected(Boolean(authData.supabaseConfigured));
      setAuditLogs(authData.auditLogs || []);

      if (prodRes.ok) {
        const pData = await prodRes.json();
        setCategories(pData.categories || []);
        setProducts(pData.products || []);
      }
      if (ordRes.ok) {
        const oData = await ordRes.json();
        setOrders(oData.orders || []);
      }
      if (bookRes.ok) {
        const bData = await bookRes.json();
        setBookings(bData.bookings || []);
      }
    } catch {
      // Ignore network error
    } finally {
      setCheckingAuth(false);
    }
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const notify = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3200);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, passcode }),
    });
    const data = await res.json();
    if (!res.ok) {
      setLoginError(data?.error || "Authentication failed.");
      return;
    }
    setPasscode("");
    await loadAdminData();
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    status: OrderStatus
  ) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      notify(`Order status updated to "${status}".`);
      await loadAdminData();
    }
  };

  const handleUpdateBookingStatus = async (
    bookingId: string,
    status: BookingStatus
  ) => {
    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      notify(`Party booking status updated to "${status}".`);
      await loadAdminData();
    }
  };

  const handleToggleProductField = async (
    product: Product,
    patch: Partial<Product>
  ) => {
    const res = await fetch(`/api/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      notify(`Updated "${product.name}".`);
      await loadAdminData();
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    const res = await fetch(`/api/products/${product.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      notify(`Deleted "${product.name}".`);
      await loadAdminData();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setNewProdImage(data.url);
        notify("Uploaded product image successfully.");
      } else {
        notify(data.error || "Upload failed.");
      }
    } finally {
      setUploadingImg(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newProdName,
        category_id: newProdCat,
        price: Number(newProdPrice),
        description:
          newProdDesc ||
          "Handcrafted NICE ICE CREAMS specialty made with pure milk and fresh cream.",
        image_url: newProdImage,
        cutout_url: newProdImage,
        seasonal: newProdSeasonal,
        availability: true,
      }),
    });
    if (res.ok) {
      setNewProdName("");
      setNewProdDesc("");
      setShowNewProductForm(false);
      notify("Created new menu item.");
      await loadAdminData();
    }
  };

  const handleExportOrdersCsv = () => {
    const headers = [
      "Order Reference",
      "Created At",
      "Customer Name",
      "Phone",
      "Order Type",
      "Status",
      "Total (INR)",
      "Items",
    ];
    const rows = orders.map((o) => [
      o.order_reference,
      o.created_at,
      `"${o.customer_name.replace(/"/g, '""')}"`,
      o.customer_phone,
      o.order_type,
      o.status,
      o.total,
      `"${o.items
        .map((i) => `${i.quantity}x ${i.product_name_snapshot} (${i.variant_snapshot})`)
        .join("; ")}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `nice-ice-creams-orders-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    link.click();
  };

  if (checkingAuth) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-sm font-bold text-cinema-800">
          Verifying Admin Session...
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto my-12 rounded-3xl bg-white border border-ivory-300 p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center">
            <Lock className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-brand-blue">
              Role-Based Access Control
            </div>
            <h1 className="font-display text-2xl font-bold text-cinema-900">
              NICE Admin Portal
            </h1>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-cinema-800/75 leading-relaxed">
          Sign in with your administrator passcode to manage menu products, prices, stock availability, WhatsApp order statuses, and party bookings.
        </p>

        {loginError && (
          <div
            role="alert"
            className="rounded-xl bg-red-50 border border-red-300 p-3 text-xs font-bold text-red-800"
          >
            {loginError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-bold text-cinema-900 mb-1"
            >
              Staff Identifier / Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-ivory-300 bg-ivory-50 px-3.5 py-2.5 text-sm text-cinema-900"
            />
          </div>

          <div>
            <label
              htmlFor="admin-passcode"
              className="block text-xs font-bold text-cinema-900 mb-1"
            >
              Server Admin Passcode *
            </label>
            <input
              id="admin-passcode"
              type="password"
              required
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter ADMIN_PASSCODE"
              className="w-full rounded-xl border border-ivory-300 bg-white px-3.5 py-2.5 text-sm text-cinema-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
            <p className="text-[11px] text-cinema-800/60 mt-1">
              Configured via server env <code>ADMIN_PASSCODE</code> (Default dev passcode: <code>nice1986-admin</code>)
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-brand-blue hover:bg-brand-indigo text-white py-3 text-sm font-extrabold shadow transition"
          >
            Sign In to Admin Dashboard
          </button>
        </form>
      </div>
    );
  }

  const confirmedRevenue = orders
    .filter(
      (o) =>
        o.status !== "Draft" &&
        o.status !== "Awaiting WhatsApp confirmation" &&
        o.status !== "Cancelled"
    )
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-8">
      {/* Top Admin Bar */}
      <div className="rounded-3xl bg-cinema-950 text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3.5">
          <img
            src="/brand/nice_ice_cream_logo.png"
            alt="NICE ICE CREAMS"
            className="h-12 w-12 rounded-xl bg-white p-0.5 object-contain"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                Authenticated: {actor}
              </span>
              <span className="text-[11px] text-ivory-300/75">
                DB Mode: {supabaseConnected ? "Supabase PostgreSQL" : "Local Persistent Store"}
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold mt-0.5">
              NICE ICE CREAMS — Operations &amp; Catalogue Control
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadAdminData}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold text-white transition"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-full bg-red-600/90 hover:bg-red-600 px-4 py-2 text-xs font-bold text-white transition"
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-300 px-4 py-3 text-xs font-bold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white border border-ivory-300 p-4 shadow-sm">
          <div className="text-xs font-bold text-cinema-800/65">
            Menu Products
          </div>
          <div className="text-2xl font-black text-cinema-900 mt-1">
            {products.length}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
            {products.filter((p) => p.availability).length} In Stock •{" "}
            {products.filter((p) => !p.availability).length} Out of Stock
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-ivory-300 p-4 shadow-sm">
          <div className="text-xs font-bold text-cinema-800/65">
            Order Enquiries
          </div>
          <div className="text-2xl font-black text-brand-blue mt-1">
            {orders.length}
          </div>
          <div className="text-[11px] text-amber-800 font-semibold mt-0.5">
            {
              orders.filter(
                (o) => o.status === "Awaiting WhatsApp confirmation"
              ).length
            }{" "}
            Awaiting WhatsApp Confirmation
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-ivory-300 p-4 shadow-sm">
          <div className="text-xs font-bold text-cinema-800/65">
            Confirmed Order Value
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            ₹{confirmedRevenue}
          </div>
          <div className="text-[11px] text-cinema-800/65 mt-0.5">
            Excludes unconfirmed drafts
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-ivory-300 p-4 shadow-sm">
          <div className="text-xs font-bold text-cinema-800/65">
            Party &amp; Bulk Bookings
          </div>
          <div className="text-2xl font-black text-purple-700 mt-1">
            {bookings.length}
          </div>
          <div className="text-[11px] text-cinema-800/65 mt-0.5">
            {bookings.filter((b) => b.status === "Pending").length} Pending Review
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ivory-300 pb-3">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "orders", label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: "products", label: `Products (${products.length})`, icon: Package },
            { id: "bookings", label: `Party Bookings (${bookings.length})`, icon: Users },
            { id: "audit", label: `Audit Logs (${auditLogs.length})`, icon: ShieldCheck },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() =>
                  setActiveTab(
                    t.id as "orders" | "products" | "bookings" | "audit"
                  )
                }
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold transition ${
                  activeTab === t.id
                    ? "bg-brand-blue text-white shadow"
                    : "bg-white text-cinema-800 border border-ivory-300 hover:border-brand-blue"
                }`}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === "orders" && orders.length > 0 && (
          <button
            type="button"
            onClick={handleExportOrdersCsv}
            className="inline-flex items-center gap-1.5 rounded-full bg-white border border-ivory-300 hover:border-brand-blue px-4 py-2 text-xs font-bold text-cinema-900"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Export Orders CSV</span>
          </button>
        )}

        {activeTab === "products" && (
          <button
            type="button"
            onClick={() => setShowNewProductForm((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue hover:bg-brand-indigo text-white px-4 py-2 text-xs font-extrabold shadow"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{showNewProductForm ? "Cancel" : "Add New Menu Product"}</span>
          </button>
        )}
      </div>

      {/* TAB 1: ORDERS */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="rounded-3xl bg-white border border-ivory-300 p-10 text-center text-sm text-cinema-800/75">
              No order enquiries recorded yet. Place a test order from the cart to inspect live status management.
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl bg-white border border-ivory-300 p-5 shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ivory-200 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-brand-blue">
                        {order.order_reference}
                      </span>
                      <span className="rounded-full bg-ivory-200 px-2.5 py-0.5 text-[11px] font-bold text-cinema-900 uppercase">
                        {order.order_type}
                      </span>
                    </div>
                    <div className="text-xs text-cinema-800/75 mt-0.5">
                      Customer: <strong>{order.customer_name}</strong> • Phone:{" "}
                      <strong>{order.customer_phone}</strong> • Preferred:{" "}
                      {order.preferred_time}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-lg font-black text-cinema-900">
                        ₹{order.total}
                      </div>
                      <div className="text-[10px] text-cinema-800/60">
                        {new Date(order.created_at).toLocaleString()}
                      </div>
                    </div>

                    <select
                      aria-label={`Change status for order ${order.order_reference}`}
                      value={order.status}
                      onChange={(e) =>
                        handleUpdateOrderStatus(
                          order.id,
                          e.target.value as OrderStatus
                        )
                      }
                      className="rounded-xl border border-ivory-300 bg-ivory-50 px-3 py-2 text-xs font-bold text-cinema-900 focus:ring-2 focus:ring-brand-blue"
                    >
                      {ORDER_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-bold text-cinema-800">Items:</span>{" "}
                    {order.items
                      .map(
                        (i) =>
                          `${i.quantity}× ${i.product_name_snapshot} (${i.variant_snapshot} @ ₹${i.unit_price_snapshot})`
                      )
                      .join(", ")}
                  </div>
                  {order.delivery_address && (
                    <div>
                      <span className="font-bold text-cinema-800">
                        Delivery Address:
                      </span>{" "}
                      {order.delivery_address}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: PRODUCTS */}
      {activeTab === "products" && (
        <div className="space-y-6">
          {showNewProductForm && (
            <form
              onSubmit={handleCreateProduct}
              className="rounded-3xl bg-white border-2 border-brand-blue/30 p-6 shadow-card space-y-4"
            >
              <h3 className="font-display text-lg font-bold text-cinema-900">
                Create New Menu Product
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-cinema-900 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="e.g. Kesar Pista Royal"
                    className="w-full rounded-xl border border-ivory-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cinema-900 mb-1">
                    Category *
                  </label>
                  <select
                    value={newProdCat}
                    onChange={(e) => setNewProdCat(e.target.value)}
                    className="w-full rounded-xl border border-ivory-300 px-3 py-2 text-sm"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-cinema-900 mb-1">
                    Base Price (₹ INR) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full rounded-xl border border-ivory-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-cinema-900 mb-1">
                    Description *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    placeholder="Short appetizing description..."
                    className="w-full rounded-xl border border-ivory-300 px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-cinema-900 mb-1">
                    Product Image Upload (WebP / PNG / JPEG, Max 5MB)
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 rounded-xl bg-ivory-200 hover:bg-ivory-300 px-3 py-2 text-xs font-bold text-cinema-900 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{uploadingImg ? "Uploading..." : "Upload File"}</span>
                      <input
                        type="file"
                        accept="image/webp,image/png,image/jpeg"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-xs text-cinema-800/70 truncate">
                      {newProdImage}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="inline-flex items-center gap-2 text-xs font-bold text-cinema-900">
                  <input
                    type="checkbox"
                    checked={newProdSeasonal}
                    onChange={(e) => setNewProdSeasonal(e.target.checked)}
                  />
                  <span>Mark as Seasonal Special</span>
                </label>

                <button
                  type="submit"
                  className="rounded-full bg-brand-blue text-white px-6 py-2.5 text-xs font-extrabold shadow"
                >
                  Save Product
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="flex items-center gap-3.5 rounded-2xl bg-white border border-ivory-300 p-3.5 shadow-sm"
              >
                <img
                  src={prod.image_url}
                  alt={prod.name}
                  className="h-16 w-16 rounded-xl object-cover shrink-0 bg-ivory-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-sm text-cinema-900 leading-snug break-words">
                      {prod.name}
                    </h4>
                    <span className="text-xs font-extrabold text-brand-blue shrink-0">
                      ₹{prod.price}
                    </span>
                  </div>
                  <p className="text-[11px] text-cinema-800/65 leading-snug">
                    {prod.category_name}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleProductField(prod, {
                          availability: !prod.availability,
                        })
                      }
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        prod.availability
                          ? "bg-emerald-100 text-emerald-900"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {prod.availability ? "✓ In Stock" : "✕ Out of Stock"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleToggleProductField(prod, {
                          seasonal: !prod.seasonal,
                        })
                      }
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        prod.seasonal
                          ? "bg-amber-100 text-amber-900"
                          : "bg-ivory-200 text-cinema-800"
                      }`}
                    >
                      <Sparkles className="w-3 h-3 inline mr-0.5" aria-hidden="true" />
                      Seasonal
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const nextPrice = window.prompt(
                          `Enter new price (INR) for ${prod.name}:`,
                          String(prod.price)
                        );
                        if (nextPrice && !Number.isNaN(Number(nextPrice))) {
                          handleToggleProductField(prod, {
                            price: Number(nextPrice),
                          });
                        }
                      }}
                      className="rounded-full bg-ivory-200 hover:bg-ivory-300 px-2.5 py-1 text-[11px] font-bold text-cinema-900"
                    >
                      Edit Price
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(prod)}
                      aria-label={`Delete ${prod.name}`}
                      className="ml-auto p-1 text-cinema-800/40 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PARTY BOOKINGS */}
      {activeTab === "bookings" && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="rounded-3xl bg-white border border-ivory-300 p-10 text-center text-sm text-cinema-800/75">
              No party booking enquiries submitted yet.
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b.id}
                className="rounded-2xl bg-white border border-ivory-300 p-5 shadow-sm space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-mono font-black text-sm text-purple-700">
                      {b.enquiry_reference}
                    </span>
                    <span className="ml-2 text-xs font-bold text-cinema-900">
                      {b.event_type} ({b.guest_count} guests on {b.event_date})
                    </span>
                  </div>
                  <select
                    aria-label={`Change status for booking ${b.enquiry_reference}`}
                    value={b.status}
                    onChange={(e) =>
                      handleUpdateBookingStatus(
                        b.id,
                        e.target.value as BookingStatus
                      )
                    }
                    className="rounded-xl border border-ivory-300 bg-ivory-50 px-3 py-1.5 text-xs font-bold"
                  >
                    {BOOKING_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-xs text-cinema-800">
                  Host: <strong>{b.customer_name}</strong> ({b.customer_phone}) •{" "}
                  Mode: {b.delivery_preference} {b.location ? `• Venue: ${b.location}` : ""}
                </div>
                <div className="text-xs text-cinema-800/80">
                  Desired Items: {b.order_preferences.join(", ")}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === "audit" && (
        <div className="rounded-3xl bg-white border border-ivory-300 overflow-hidden shadow-sm">
          <div className="divide-y divide-ivory-200">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-brand-blue mr-2">
                    [{log.action}]
                  </span>
                  <span className="text-cinema-900 font-medium">
                    {log.details}
                  </span>
                </div>
                <div className="text-cinema-800/60 font-mono shrink-0">
                  {log.actor} • {new Date(log.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

