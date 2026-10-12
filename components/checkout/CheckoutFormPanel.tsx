"use client";

import React, { useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import { INITIAL_PRODUCTS } from "@/lib/db/seed-data";
import { trackEvent } from "@/lib/analytics/tracker";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

export function CheckoutFormPanel({
  onCloseDrawer,
}: {
  onCloseDrawer?: () => void;
}) {
  const {
    items,
    subtotal,
    total,
    updateQuantity,
    changeVariant,
    removeItem,
    clearCart,
  } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderType, setOrderType] = useState<
    "pickup" | "delivery" | "party_enquiry"
  >("pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [preferredTime, setPreferredTime] = useState("Within 30–45 mins");
  const [partyDate, setPartyDate] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [copiedMessage, setCopiedMessage] = useState(false);

  const [orderResult, setOrderResult] = useState<{
    orderReference: string;
    status: string;
    total: number;
    whatsappUrl: string;
    whatsappMessage: string;
    notice: string;
  } | null>(null);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    if (items.length === 0) {
      setErrorMessage("Your cart is empty. Please add flavours before ordering.");
      return;
    }

    setSubmitting(true);
    trackEvent("checkout_started", {
      item_count: items.length,
      order_type: orderType,
      subtotal,
    });

    try {
      const idempotencyKey = `${customerPhone.replace(/\D/g, "")}-${items
        .map((i) => `${i.productId}:${i.variantId}:${i.quantity}`)
        .join(",")}-${Math.floor(Date.now() / 30000)}`;

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName,
          customer_phone: customerPhone,
          order_type: orderType,
          delivery_address:
            orderType === "delivery" ? deliveryAddress : undefined,
          preferred_time: preferredTime,
          party_date:
            orderType === "party_enquiry" && partyDate ? partyDate : undefined,
          guest_count:
            orderType === "party_enquiry" && guestCount
              ? Number(guestCount)
              : undefined,
          notes: notes || undefined,
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          idempotency_key: idempotencyKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data?.error || "Please check your order details.");
        if (data?.issues) {
          setFieldErrors(data.issues);
        }
        setSubmitting(false);
        return;
      }

      const resultPayload = {
        orderReference: data.order.order_reference,
        status: data.order.status,
        total: data.order.total,
        whatsappUrl: data.whatsapp.url,
        whatsappMessage: data.whatsapp.message,
        notice: data.whatsapp.notice,
      };
      setOrderResult(resultPayload);

      // Track WhatsApp handoff (explicitly distinct from confirmed order)
      trackEvent("whatsapp_opened", {
        order_reference: data.order.order_reference,
        order_type: orderType,
        total: data.order.total,
      });

      // Attempt to open WhatsApp click-to-chat in a new tab; fallback UI handles popup blockers
      try {
        window.open(data.whatsapp.url, "_blank", "noopener,noreferrer");
      } catch {
        // Fallback link is rendered prominently in the confirmation card
      }
    } catch {
      setErrorMessage(
        "Network error while validating your order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (orderResult) {
    return (
      <div className="rounded-3xl bg-white border-2 border-brand-blue/30 p-6 sm:p-8 shadow-card space-y-5">
        <div className="flex items-start gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 text-amber-900 px-3 py-0.5 text-xs font-extrabold">
              Status: {orderResult.status}
            </div>
            <h3 className="font-display text-2xl font-bold text-cinema-900">
              Order Draft Prepared: {orderResult.orderReference}
            </h3>
            <p className="text-xs sm:text-sm text-cinema-800/80 leading-relaxed">
              {orderResult.notice}
            </p>
          </div>
        </div>

        {/* Important Reminder Box */}
        <div className="rounded-2xl bg-amber-50 border border-amber-300/80 p-4 text-xs sm:text-sm text-amber-950 space-y-2">
          <div className="font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" aria-hidden="true" />
            <span>Action Required: Press &ldquo;Send&rdquo; in WhatsApp</span>
          </div>
          <p className="leading-relaxed">
            Opening WhatsApp does not automatically submit or confirm your order. Please tap the button below to open WhatsApp and press{" "}
            <strong>Send</strong> so the NICE ICE CREAMS team receives your order.
          </p>
        </div>

        {/* Primary WhatsApp Launch Button + Copy Fallback */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={orderResult.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent("whatsapp_opened", {
                order_reference: orderResult.orderReference,
                retry: true,
              })
            }
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1EBE5B] text-white px-6 py-3.5 text-sm sm:text-base font-extrabold shadow-lg transition"
          >
            <MessageCircle className="w-5 h-5" aria-hidden="true" />
            <span>Open WhatsApp &amp; Send Order (₹{orderResult.total})</span>
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(orderResult.whatsappMessage);
              setCopiedMessage(true);
              setTimeout(() => setCopiedMessage(false), 2000);
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-ivory-300 bg-ivory-100 hover:bg-ivory-200 px-4 py-3 text-xs font-bold text-cinema-900 transition"
          >
            <Copy className="w-4 h-4" aria-hidden="true" />
            <span>{copiedMessage ? "Copied Order Text!" : "Copy Message"}</span>
          </button>
        </div>

        {/* Message Preview */}
        <details className="rounded-2xl bg-ivory-100 border border-ivory-300 p-3.5 text-xs">
          <summary className="font-bold text-cinema-900 cursor-pointer">
            Preview Formatted WhatsApp Order Message
          </summary>
          <pre className="mt-2 whitespace-pre-wrap break-words font-mono text-[11px] text-cinema-800 bg-white p-3 rounded-xl border border-ivory-200 max-h-60 overflow-y-auto custom-scrollbar">
            {orderResult.whatsappMessage}
          </pre>
        </details>

        <div className="flex items-center justify-between pt-2 border-t border-ivory-200 text-xs">
          <button
            type="button"
            onClick={() => setOrderResult(null)}
            className="font-semibold text-brand-blue hover:underline"
          >
            ← Edit Order Details
          </button>
          <button
            type="button"
            onClick={() => {
              clearCart();
              setOrderResult(null);
              if (onCloseDrawer) onCloseDrawer();
            }}
            className="font-bold text-cinema-800 hover:text-red-700"
          >
            Clear Cart &amp; Start New Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cart Items List */}
      <div className="space-y-3">
        {items.map((item) => {
          const prod = INITIAL_PRODUCTS.find((p) => p.id === item.productId);
          const availableVariants = prod?.variants.filter((v) => v.available) || [];

          return (
            <div
              key={item.key}
              className="flex items-start gap-3.5 rounded-2xl bg-white border border-ivory-300 p-3.5 shadow-sm"
            >
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="h-16 w-16 rounded-xl object-cover shrink-0 bg-ivory-100"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-display font-bold text-sm sm:text-base text-cinema-900 leading-snug break-words">
                      {item.productName}
                    </h4>
                    <p className="text-[11px] text-cinema-800/65">
                      ₹{item.unitPrice} each
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-extrabold text-sm sm:text-base text-brand-blue">
                      ₹{item.lineTotal}
                    </div>
                  </div>
                </div>

                {/* Variant Switcher & Quantity Controls */}
                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                  {availableVariants.length > 1 ? (
                    <select
                      aria-label={`Change size or variant for ${item.productName}`}
                      value={item.variantId}
                      onChange={(e) =>
                        changeVariant(item.productId, item.variantId, e.target.value)
                      }
                      className="rounded-lg border border-ivory-300 bg-ivory-50 px-2 py-1 text-xs font-semibold text-cinema-900 focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    >
                      {availableVariants.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} (₹{v.price})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-xs font-medium text-cinema-800/75">
                      {item.variantName}
                    </span>
                  )}

                  <div className="flex items-center gap-1.5">
                    <div className="inline-flex items-center rounded-full border border-ivory-300 bg-ivory-50 p-0.5">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.variantId,
                            item.quantity - 1
                          )
                        }
                        aria-label={`Decrease quantity of ${item.productName}`}
                        className="h-6 w-6 inline-flex items-center justify-center rounded-full hover:bg-ivory-200 text-cinema-900"
                      >
                        <Minus className="w-3 h-3" aria-hidden="true" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-cinema-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.variantId,
                            item.quantity + 1
                          )
                        }
                        aria-label={`Increase quantity of ${item.productName}`}
                        className="h-6 w-6 inline-flex items-center justify-center rounded-full hover:bg-ivory-200 text-cinema-900"
                      >
                        <Plus className="w-3 h-3" aria-hidden="true" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.productId, item.variantId)}
                      aria-label={`Remove ${item.productName} from cart`}
                      className="p-1.5 text-cinema-800/50 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Summary Breakdown */}
      <div className="rounded-2xl bg-ivory-100 border border-ivory-300 p-4 space-y-2 text-sm">
        <div className="flex justify-between text-cinema-800">
          <span>Items Subtotal</span>
          <span className="font-bold">₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-xs text-cinema-800/70">
          <span>Delivery / Packing Charges</span>
          <span>Confirmed on WhatsApp if applicable</span>
        </div>
        <div className="pt-2 border-t border-ivory-300 flex justify-between items-baseline text-base font-extrabold text-cinema-900">
          <span>Estimated Grand Total</span>
          <span className="text-xl text-brand-blue">₹{total}</span>
        </div>
      </div>

      {/* Customer Details & WhatsApp Order Form */}
      <form onSubmit={handleCheckoutSubmit} className="space-y-4" noValidate>
        <h3 className="font-display text-lg font-bold text-cinema-900">
          Customer &amp; Order Details
        </h3>

        {errorMessage && (
          <div
            role="alert"
            className="rounded-xl bg-red-50 border border-red-300 p-3 text-xs font-semibold text-red-800"
          >
            {errorMessage}
          </div>
        )}

        {/* Order Type Selector */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "pickup", label: "Store Pickup" },
            { id: "delivery", label: "Home Delivery" },
            { id: "party_enquiry", label: "Party / Bulk" },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() =>
                setOrderType(
                  mode.id as "pickup" | "delivery" | "party_enquiry"
                )
              }
              className={`rounded-xl border py-2.5 px-2 text-xs font-bold transition ${
                orderType === mode.id
                  ? "border-brand-blue bg-brand-blue text-white shadow-sm"
                  : "border-ivory-300 bg-white text-cinema-800 hover:border-brand-blue"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="checkout-name"
              className="block text-xs font-bold text-cinema-900 mb-1"
            >
              Your Name *
            </label>
            <input
              id="checkout-name"
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full rounded-xl border border-ivory-300 bg-white px-3.5 py-2.5 text-sm text-cinema-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
            {fieldErrors.customer_name && (
              <p className="text-[11px] text-red-600 mt-1">
                {fieldErrors.customer_name[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="checkout-phone"
              className="block text-xs font-bold text-cinema-900 mb-1"
            >
              Phone / WhatsApp Number *
            </label>
            <input
              id="checkout-phone"
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="e.g. 98765 43210"
              className="w-full rounded-xl border border-ivory-300 bg-white px-3.5 py-2.5 text-sm text-cinema-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
            {fieldErrors.customer_phone && (
              <p className="text-[11px] text-red-600 mt-1">
                {fieldErrors.customer_phone[0]}
              </p>
            )}
          </div>
        </div>

        {orderType === "delivery" && (
          <div>
            <label
              htmlFor="checkout-address"
              className="block text-xs font-bold text-cinema-900 mb-1"
            >
              Complete Delivery Address *
            </label>
            <textarea
              id="checkout-address"
              rows={2}
              required
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="House/Flat No, Street, Landmark, Area..."
              className="w-full rounded-xl border border-ivory-300 bg-white px-3.5 py-2 text-sm text-cinema-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
            {fieldErrors.delivery_address && (
              <p className="text-[11px] text-red-600 mt-1">
                {fieldErrors.delivery_address[0]}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="checkout-time"
              className="block text-xs font-bold text-cinema-900 mb-1"
            >
              Preferred Pickup / Delivery Time *
            </label>
            <input
              id="checkout-time"
              type="text"
              required
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              placeholder="e.g. Today 7:30 PM or Within 45 mins"
              className="w-full rounded-xl border border-ivory-300 bg-white px-3.5 py-2.5 text-sm text-cinema-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          {orderType === "party_enquiry" && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="checkout-party-date"
                  className="block text-xs font-bold text-cinema-900 mb-1"
                >
                  Event Date
                </label>
                <input
                  id="checkout-party-date"
                  type="date"
                  value={partyDate}
                  onChange={(e) => setPartyDate(e.target.value)}
                  className="w-full rounded-xl border border-ivory-300 bg-white px-2.5 py-2 text-xs text-cinema-900"
                />
              </div>
              <div>
                <label
                  htmlFor="checkout-guests"
                  className="block text-xs font-bold text-cinema-900 mb-1"
                >
                  Guests
                </label>
                <input
                  id="checkout-guests"
                  type="number"
                  min={1}
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  placeholder="50"
                  className="w-full rounded-xl border border-ivory-300 bg-white px-2.5 py-2 text-xs text-cinema-900"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="checkout-notes"
            className="block text-xs font-bold text-cinema-900 mb-1"
          >
            Special Instructions / Notes (Optional)
          </label>
          <input
            id="checkout-notes"
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Extra hot fudge on sizzler, less nuts, extra spoons..."
            className="w-full rounded-xl border border-ivory-300 bg-white px-3.5 py-2 text-sm text-cinema-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1EBE5B] disabled:opacity-60 text-white px-6 py-4 text-sm sm:text-base font-extrabold shadow-lg transition"
        >
          <MessageCircle className="w-5 h-5" aria-hidden="true" />
          <span>
            {submitting
              ? "Validating Prices & Preparing WhatsApp Order..."
              : `Order on WhatsApp • ₹${total}`}
          </span>
        </button>

        <p className="text-[11px] text-center text-cinema-800/65 leading-relaxed">
          Your order will be validated against official menu prices and opened in WhatsApp (+91 99854 22222). Press <strong>Send</strong> in WhatsApp to complete submission.
        </p>
      </form>
    </div>
  );
}

