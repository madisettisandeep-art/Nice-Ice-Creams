import { OrderItem, Product } from "../db/types";

export interface ClientCartLineInput {
  productId: string;
  variantId: string;
  quantity: number;
  // Note: Any client-supplied price is intentionally ignored by the server!
  clientPriceIgnored?: number;
}

export interface ValidatedPricingResult {
  valid: boolean;
  errors: string[];
  items: Omit<OrderItem, "id" | "order_id">[];
  subtotal: number;
  fees: number;
  discount: number;
  total: number;
  feeConfigured: boolean;
  taxConfigured: boolean;
}

/**
 * Server-authoritative cart & order calculation.
 * Never trusts client-supplied unit prices or totals.
 */
export function calculateAuthoritativeOrderPricing(
  lines: ClientCartLineInput[],
  catalogue: Product[],
  orderType: "pickup" | "delivery" | "party_enquiry" = "pickup"
): ValidatedPricingResult {
  const errors: string[] = [];
  const validatedItems: Omit<OrderItem, "id" | "order_id">[] = [];

  if (!Array.isArray(lines) || lines.length === 0) {
    return {
      valid: false,
      errors: ["Your cart is empty. Please add at least one item before ordering."],
      items: [],
      subtotal: 0,
      fees: 0,
      discount: 0,
      total: 0,
      feeConfigured: false,
      taxConfigured: false,
    };
  }

  let subtotal = 0;

  for (const line of lines) {
    const qty = Math.floor(Number(line.quantity));
    if (!Number.isFinite(qty) || qty < 1 || qty > 100) {
      errors.push(`Invalid quantity (${line.quantity}) for product ${line.productId}.`);
      continue;
    }

    const product = catalogue.find(
      (p) => p.id === line.productId || p.slug === line.productId
    );
    if (!product) {
      errors.push(`Product "${line.productId}" was not found in the official menu.`);
      continue;
    }

    if (!product.availability) {
      errors.push(`"${product.name}" is currently out of stock and cannot be ordered.`);
      continue;
    }

    const variant =
      product.variants.find((v) => v.id === line.variantId) ||
      (line.variantId === "default" ? product.variants[0] : undefined);

    if (!variant) {
      errors.push(
        `Please select a valid serving size/variant for "${product.name}".`
      );
      continue;
    }

    if (!variant.available) {
      errors.push(
        `The variant "${variant.name}" for "${product.name}" is currently unavailable.`
      );
      continue;
    }

    const unitPrice = Number(variant.price);
    const lineTotal = Math.round(unitPrice * qty * 100) / 100;
    subtotal = Math.round((subtotal + lineTotal) * 100) / 100;

    validatedItems.push({
      product_id: product.id,
      product_slug: product.slug,
      product_name_snapshot: product.name,
      variant_snapshot: variant.name,
      unit_price_snapshot: unitPrice,
      quantity: qty,
      line_total: lineTotal,
    });
  }

  // Only apply delivery fee or tax if explicitly configured in server env
  const configuredDeliveryFee = Number(process.env.ORDER_DELIVERY_FEE_INR || 0);
  const configuredTaxPercent = Number(process.env.ORDER_TAX_PERCENT || 0);

  const feeConfigured = configuredDeliveryFee > 0;
  const taxConfigured = configuredTaxPercent > 0;

  let fees = 0;
  if (orderType === "delivery" && feeConfigured) {
    fees += configuredDeliveryFee;
  }
  if (taxConfigured) {
    fees += Math.round(subtotal * (configuredTaxPercent / 100) * 100) / 100;
  }

  const discount = 0;
  const total = Math.max(0, Math.round((subtotal + fees - discount) * 100) / 100);

  return {
    valid: errors.length === 0 && validatedItems.length > 0,
    errors,
    items: validatedItems,
    subtotal,
    fees,
    discount,
    total,
    feeConfigured,
    taxConfigured,
  };
}

