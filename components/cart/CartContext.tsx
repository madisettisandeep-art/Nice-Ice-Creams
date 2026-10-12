"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Product } from "@/lib/db/types";
import { INITIAL_PRODUCTS } from "@/lib/db/seed-data";
import { trackEvent } from "@/lib/analytics/tracker";

export interface CartItem {
  key: string; // `${productId}::${variantId}`
  productId: string;
  productSlug: string;
  productName: string;
  categoryName: string;
  imageUrl: string;
  variantId: string;
  variantName: string;
  servingSize?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  fees: number;
  discount: number;
  total: number;
  isCartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  activeProductModal: { product: Product; autoPlayExploded: boolean } | null;
  openProductModal: (product: Product, autoPlayExploded?: boolean) => void;
  closeProductModal: () => void;
  addItem: (product: Product, variantId: string, quantity?: number) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  changeVariant: (
    productId: string,
    oldVariantId: string,
    newVariantId: string,
    catalogue?: Product[]
  ) => void;
  removeItem: (productId: string, variantId: string) => void;
  clearCart: () => void;
  syncWithCatalogue: (catalogue: Product[]) => void;
}

const STORAGE_KEY = "nice_ice_creams_cart_v1";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isCartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState<{
    product: Product;
    autoPlayExploded: boolean;
  } | null>(null);

  // Hydrate cart from localStorage and listen for cross-tab storage events
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // Ignore invalid localStorage state
    } finally {
      setHydrated(true);
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setItems(JSON.parse(e.newValue));
        } catch {
          // Ignore
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Persist cart changes
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore quota errors
    }
  }, [items, hydrated]);

  const syncWithCatalogue = useCallback((catalogue: Product[]) => {
    setItems((prev) => {
      let changed = false;
      const next: CartItem[] = [];
      for (const item of prev) {
        const prod = catalogue.find(
          (p) => p.id === item.productId || p.slug === item.productSlug
        );
        if (!prod || !prod.availability) {
          changed = true;
          continue;
        }
        const variant =
          prod.variants.find((v) => v.id === item.variantId) || prod.variants[0];
        if (!variant || !variant.available) {
          changed = true;
          continue;
        }
        const newLineTotal = Math.round(variant.price * item.quantity * 100) / 100;
        if (
          variant.price !== item.unitPrice ||
          prod.name !== item.productName ||
          variant.name !== item.variantName
        ) {
          changed = true;
          next.push({
            ...item,
            productName: prod.name,
            variantId: variant.id,
            variantName: variant.name,
            servingSize: variant.servingSize,
            unitPrice: variant.price,
            lineTotal: newLineTotal,
          });
        } else {
          next.push(item);
        }
      }
      return changed ? next : prev;
    });
  }, []);

  const addItem = useCallback(
    (product: Product, variantId: string, quantity = 1) => {
      if (!product.availability) return;
      const variant =
        product.variants.find((v) => v.id === variantId) || product.variants[0];
      if (!variant || !variant.available) return;

      const safeQty = Math.max(1, Math.min(100, Math.floor(quantity)));
      const key = `${product.id}::${variant.id}`;

      setItems((prev) => {
        const existingIdx = prev.findIndex((i) => i.key === key);
        if (existingIdx >= 0) {
          const updated = [...prev];
          const newQty = Math.min(100, updated[existingIdx].quantity + safeQty);
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: newQty,
            unitPrice: variant.price,
            lineTotal: Math.round(variant.price * newQty * 100) / 100,
          };
          return updated;
        }
        return [
          ...prev,
          {
            key,
            productId: product.id,
            productSlug: product.slug,
            productName: product.name,
            categoryName: product.category_name,
            imageUrl: product.image_url,
            variantId: variant.id,
            variantName: variant.name,
            servingSize: variant.servingSize,
            unitPrice: variant.price,
            quantity: safeQty,
            lineTotal: Math.round(variant.price * safeQty * 100) / 100,
          },
        ];
      });

      trackEvent("product_added_to_cart", {
        product_slug: product.slug,
        variant_id: variant.id,
        quantity: safeQty,
        unit_price: variant.price,
      });
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: string, variantId: string, quantity: number) => {
      const key = `${productId}::${variantId}`;
      setItems((prev) => {
        if (quantity <= 0) {
          return prev.filter((i) => i.key !== key);
        }
        const safeQty = Math.min(100, Math.floor(quantity));
        return prev.map((item) =>
          item.key === key
            ? {
                ...item,
                quantity: safeQty,
                lineTotal: Math.round(item.unitPrice * safeQty * 100) / 100,
              }
            : item
        );
      });
      trackEvent("cart_updated", {
        product_id: productId,
        variant_id: variantId,
        quantity,
      });
    },
    []
  );

  const changeVariant = useCallback(
    (
      productId: string,
      oldVariantId: string,
      newVariantId: string,
      catalogue: Product[] = INITIAL_PRODUCTS
    ) => {
      if (oldVariantId === newVariantId) return;
      const product = catalogue.find((p) => p.id === productId);
      if (!product) return;
      const newVariant = product.variants.find((v) => v.id === newVariantId);
      if (!newVariant || !newVariant.available) return;

      const oldKey = `${productId}::${oldVariantId}`;
      const newKey = `${productId}::${newVariantId}`;

      setItems((prev) => {
        const oldItem = prev.find((i) => i.key === oldKey);
        if (!oldItem) return prev;
        const targetExisting = prev.find((i) => i.key === newKey);

        if (targetExisting) {
          const combinedQty = Math.min(100, targetExisting.quantity + oldItem.quantity);
          return prev
            .filter((i) => i.key !== oldKey)
            .map((i) =>
              i.key === newKey
                ? {
                    ...i,
                    quantity: combinedQty,
                    unitPrice: newVariant.price,
                    lineTotal: Math.round(newVariant.price * combinedQty * 100) / 100,
                  }
                : i
            );
        }

        return prev.map((i) =>
          i.key === oldKey
            ? {
                ...i,
                key: newKey,
                variantId: newVariant.id,
                variantName: newVariant.name,
                servingSize: newVariant.servingSize,
                unitPrice: newVariant.price,
                lineTotal: Math.round(newVariant.price * i.quantity * 100) / 100,
              }
            : i
        );
      });
    },
    []
  );

  const removeItem = useCallback((productId: string, variantId: string) => {
    const key = `${productId}::${variantId}`;
    setItems((prev) => prev.filter((i) => i.key !== key));
    trackEvent("cart_updated", {
      product_id: productId,
      variant_id: variantId,
      quantity: 0,
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openProductModal = useCallback(
    (product: Product, autoPlayExploded = false) => {
      setActiveProductModal({ product, autoPlayExploded });
      trackEvent("product_viewed", {
        product_slug: product.slug,
        category: product.category_slug,
        auto_exploded: autoPlayExploded,
      });
    },
    []
  );

  const closeProductModal = useCallback(() => {
    setActiveProductModal(null);
  }, []);

  const { itemCount, subtotal, fees, discount, total } = useMemo(() => {
    const count = items.reduce((acc, item) => acc + item.quantity, 0);
    const sub =
      Math.round(items.reduce((acc, item) => acc + item.lineTotal, 0) * 100) /
      100;
    return {
      itemCount: count,
      subtotal: sub,
      fees: 0,
      discount: 0,
      total: sub,
    };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      fees,
      discount,
      total,
      isCartDrawerOpen,
      setCartDrawerOpen,
      activeProductModal,
      openProductModal,
      closeProductModal,
      addItem,
      updateQuantity,
      changeVariant,
      removeItem,
      clearCart,
      syncWithCatalogue,
    }),
    [
      items,
      itemCount,
      subtotal,
      fees,
      discount,
      total,
      isCartDrawerOpen,
      activeProductModal,
      openProductModal,
      closeProductModal,
      addItem,
      updateQuantity,
      changeVariant,
      removeItem,
      clearCart,
      syncWithCatalogue,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}

