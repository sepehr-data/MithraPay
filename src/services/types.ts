export type ID = string

export interface Category {
  id: ID
  slug: string
  title: string
}

export interface Product {
  id: ID
  slug: string
  title: string
  description: string
  price: number  // in Toman
  compareAt?: number
  rating?: number
  image?: string
  categoryId: ID
  isDigital?: boolean
  tags?: string[]
}

export interface BlogPost {
  id: ID
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  cover?: string
}

export interface CartItem {
  productId: ID
  qty: number
}

export type OrderStatus = 'pending' | 'paid' | 'completed' | 'canceled'

export interface OrderItemSummary {
  productTitle: string
  quantity: number
  // you can extend this later with price, etc.
}

export interface Order {
  id: ID
  code: string            // e.g. "OR0000951660A"
  status: OrderStatus
  createdAt: string       // ISO date string
  items: OrderItemSummary[]
  totalAmount?: number    // optional
}