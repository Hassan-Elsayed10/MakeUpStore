'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface WishlistItem {
  productId: number;
  nameEn: string;
  nameAr: string;
  price: number;
  image: string | null;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  toggleItem: (item: WishlistItem) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('glamour-wishlist');
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {}
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem('glamour-wishlist', JSON.stringify(items));
    }
  }, [items, loaded]);

  const addItem = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.productId === item.productId)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const isInWishlist = useCallback(
    (productId: number) => items.some((i) => i.productId === productId),
    [items]
  );

  const toggleItem = useCallback(
    (item: WishlistItem) => {
      if (isInWishlist(item.productId)) {
        removeItem(item.productId);
      } else {
        addItem(item);
      }
    },
    [isInWishlist, removeItem, addItem]
  );

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist, toggleItem }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
