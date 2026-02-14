"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product } from '@/lib/types';

interface WishlistItem {
  product: Product;
  addedAt: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  itemCount: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (product: Product) => void;
  clearWishlist: () => void;
  isOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'luxe-beauty-wishlist';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setItems(parsed);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Error saving wishlist:', error);
      }
    }
  }, [items, isInitialized]);

  const addItem = useCallback((product: Product) => {
    setItems((currentItems) => {
      // Check if item already exists
      const exists = currentItems.some(item => item.product.id === product.id);
      
      if (exists) {
        console.log('Product already in wishlist');
        return currentItems;
      }

      // Add new item
      return [
        ...currentItems,
        {
          product,
          addedAt: new Date().toISOString(),
        }
      ];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((currentItems) => 
      currentItems.filter(item => item.product.id !== productId)
    );
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return items.some(item => item.product.id === productId);
  }, [items]);

  const toggleItem = useCallback((product: Product) => {
    if (isInWishlist(product.id)) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  }, [isInWishlist, addItem, removeItem]);

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  const openWishlist = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeWishlist = useCallback(() => {
    setIsOpen(false);
  }, []);

  const itemCount = items.length;

  const value: WishlistContextType = {
    items,
    itemCount,
    addItem,
    removeItem,
    isInWishlist,
    toggleItem,
    clearWishlist,
    isOpen,
    openWishlist,
    closeWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  
  return context;
}