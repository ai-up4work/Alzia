"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { Product } from "@/lib/types"

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product
  quantity: number
  // Locked-in wholesale unit price at the time of adding to cart
  unit_price: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product; quantity: number; unit_price: number }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "LOAD_CART"; items: CartItem[] }

// ── Context shape ─────────────────────────────────────────────────────────────

interface WholesaleCartContextValue {
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addItem: (product: Product, quantity: number, unit_price: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  totalItems: number
  // Subtotal uses locked-in wholesale unit_price, never retail_price
  subtotal: number
}

const WholesaleCartContext = createContext<WholesaleCartContextValue | null>(null)

// ── Reducer ───────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === action.product.id
      )

      if (existingIndex > -1) {
        // Item already in cart — update quantity and re-lock the new unit_price
        const newItems = [...state.items]
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + action.quantity,
          unit_price: action.unit_price,
        }
        return { ...state, items: newItems }
      }

      return {
        ...state,
        items: [
          ...state.items,
          { product: action.product, quantity: action.quantity, unit_price: action.unit_price },
        ],
      }
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== action.productId),
      }

    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.product.id !== action.productId),
        }
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.productId
            ? { ...item, quantity: action.quantity }
            : item
        ),
      }
    }

    case "CLEAR_CART":
      return { ...state, items: [] }

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen }

    case "OPEN_CART":
      return { ...state, isOpen: true }

    case "CLOSE_CART":
      return { ...state, isOpen: false }

    case "LOAD_CART":
      return { ...state, items: action.items }

    default:
      return state
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function WholesaleCartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false })

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wholesale-cart")
      if (saved) {
        const items = JSON.parse(saved) as CartItem[]
        dispatch({ type: "LOAD_CART", items })
      }
    } catch {
      console.error("Failed to load wholesale cart from localStorage")
    }
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem("wholesale-cart", JSON.stringify(state.items))
  }, [state.items])

  const addItem = (product: Product, quantity: number, unit_price: number) => {
    dispatch({ type: "ADD_ITEM", product, quantity, unit_price })
  }

  const removeItem = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", productId })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity })
  }

  const clearCart = () => dispatch({ type: "CLEAR_CART" })
  const toggleCart = () => dispatch({ type: "TOGGLE_CART" })
  const openCart = () => dispatch({ type: "OPEN_CART" })
  const closeCart = () => dispatch({ type: "CLOSE_CART" })

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)

  // Subtotal uses locked-in wholesale unit_price — completely isolated from retail
  const subtotal = state.items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  )

  return (
    <WholesaleCartContext.Provider
      value={{
        state,
        dispatch,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </WholesaleCartContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useCart() {
  const context = useContext(WholesaleCartContext)
  if (!context) {
    throw new Error("useCart must be used within a WholesaleCartProvider")
  }
  return context
}