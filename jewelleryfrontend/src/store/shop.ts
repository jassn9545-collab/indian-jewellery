"use client";
import { products } from "@/lib/catalog";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
type BagItem = { id: string; quantity: number };
type ShopState = {
  bag: BagItem[];
  wishlist: string[];
  add: (id: string, quantity?: number) => void;
  quantity: (id: string, value: number) => void;
  remove: (id: string) => void;
  toggleWishlist: (id: string) => void;
};
export const useShop = create<ShopState>()(
  persist(
    (set) => ({
      bag: [],
      wishlist: [],
      add: (id, quantity = 1) =>
        set((s) => ({
          bag:
            !products.some((p) => p.id === id && p.available) ||
            !Number.isInteger(quantity) ||
            quantity < 1
              ? s.bag
              : s.bag.some((i) => i.id === id)
                ? s.bag.map((i) =>
                    i.id === id
                      ? { ...i, quantity: Math.min(10, i.quantity + quantity) }
                      : i,
                  )
                : [...s.bag, { id, quantity: Math.min(10, quantity) }],
        })),
      quantity: (id, value) =>
        set((s) => ({
          bag: s.bag.map((i) =>
            i.id === id
              ? {
                  ...i,
                  quantity: Number.isFinite(value)
                    ? Math.max(1, Math.min(10, Math.floor(value)))
                    : i.quantity,
                }
              : i,
          ),
        })),
      remove: (id) => set((s) => ({ bag: s.bag.filter((i) => i.id !== id) })),
      toggleWishlist: (id) =>
        set((s) => ({
          wishlist: s.wishlist.includes(id)
            ? s.wishlist.filter((i) => i !== id)
            : [...s.wishlist, id],
        })),
    }),
    {
      name: "techglock-shop",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
