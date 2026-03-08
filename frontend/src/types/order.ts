import { Product } from './product'

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  product: Product
  quantity: number
  price: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  address: string
  phone?: string
  notes?: string
  createdAt: string
  updatedAt: string
}
