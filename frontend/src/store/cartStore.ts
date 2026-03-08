import { create } from 'zustand'

interface CartProduct {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  stock: number
}

interface CartItem {
  id: string
  productId: string
  quantity: number
  product: CartProduct
}

interface Cart {
  id: string
  items: CartItem[]
}

interface CartState {
  cart: Cart | null
  isOpen: boolean
  setCart: (cart: Cart | null) => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  itemCount: () => number
  total: () => number
}

export const useCartStore = create<CartState>()((set, get) => ({
  cart: null,
  isOpen: false,
  setCart: (cart) => set({ cart }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
  itemCount: () => get().cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0,
  total: () =>
    get().cart?.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0) ?? 0,
}))
