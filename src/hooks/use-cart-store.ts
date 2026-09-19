import { create } from "zustand";
import type { CartItemData } from "@/types";

type CartStore = {
  items: CartItemData[];
  itemCount: number;
  subtotal: number;
  isLoading: boolean;
  setCart: (items: CartItemData[]) => void;
  setLoading: (loading: boolean) => void;
};

function computeTotals(items: CartItemData[]) {
  return {
    itemCount: items.reduce((n, i) => n + i.quantity, 0),
    subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  };
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  itemCount: 0,
  subtotal: 0,
  isLoading: false,
  setCart: (items) => set({ items, ...computeTotals(items) }),
  setLoading: (isLoading) => set({ isLoading }),
}));
