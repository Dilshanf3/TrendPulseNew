import { create } from "zustand";
import type { CartItemData } from "@/types";

/**
 * Client-side cart: the drawer's open state plus a cache of the server cart.
 * The server stays the source of truth — every mutation re-reads /api/cart afterwards.
 */

export class SignInRequiredError extends Error {}

type CartState = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;

  items: CartItemData[];
  itemCount: number;
  subtotal: number;
  status: "idle" | "loading" | "ready";
  pendingItemId: string | null;

  load: () => Promise<void>;
  addItem: (input: { productId: string; variantId: string | null; quantity: number }) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
};

function totals(items: CartItemData[]) {
  return {
    itemCount: items.reduce((n, i) => n + i.quantity, 0),
    subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  };
}

export const useCart = create<CartState>((set, get) => ({
  isOpen: false,
  setOpen: (isOpen) => {
    set({ isOpen });
    if (isOpen) void get().load();
  },

  items: [],
  itemCount: 0,
  subtotal: 0,
  status: "idle",
  pendingItemId: null,

  load: async () => {
    // Only show a loading state the first time; later refreshes update in place.
    if (get().status === "idle") set({ status: "loading" });
    try {
      const res = await fetch("/api/cart");
      const data = res.ok ? await res.json() : { items: [] };
      const items: CartItemData[] = data.items ?? [];
      set({ items, ...totals(items) });
    } finally {
      set({ status: "ready" });
    }
  },

  addItem: async (input) => {
    const res = await fetch("/api/cart/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (res.status === 401) throw new SignInRequiredError();
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "Could not add to bag");
    }
    await get().load();
  },

  updateQuantity: async (itemId, quantity) => {
    if (quantity < 1) return get().removeItem(itemId);
    set({ pendingItemId: itemId });
    try {
      await fetch(`/api/cart/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      await get().load();
    } finally {
      set({ pendingItemId: null });
    }
  },

  removeItem: async (itemId) => {
    set({ pendingItemId: itemId });
    try {
      await fetch(`/api/cart/items/${itemId}`, { method: "DELETE" });
      await get().load();
    } finally {
      set({ pendingItemId: null });
    }
  },
}));
