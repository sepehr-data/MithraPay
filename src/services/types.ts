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
