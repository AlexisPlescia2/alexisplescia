import { Product } from './product'

export interface CartItem {
  id: string
  cartId: string
  productId: string
  product: Product
  quantity: number
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
}
