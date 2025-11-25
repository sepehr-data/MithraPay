// Simple mock API using local JSON. Replace with real HTTP calls later.
import productsJson from '@/mocks/products.json'
import categoriesJson from '@/mocks/categories.json'
import postsJson from '@/mocks/posts.json'
import type { Product, Category, BlogPost, ID, Order } from './types'
import { http } from './http'

const delay = (ms = 250) => new Promise(res => setTimeout(res, ms))

export async function listCategories(): Promise<Category[]> {
  await delay()
  return categoriesJson as Category[]
}

export async function listProducts(categorySlug?: string): Promise<Product[]> {
  await delay()
  const cats = categoriesJson as Category[]
  const items = (productsJson as Product[])
  if (!categorySlug) return items
  const cat = cats.find(c => c.slug === categorySlug)
  return items.filter(p => p.categoryId === cat?.id)
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  await delay()
  return (productsJson as Product[]).find(p => p.slug === slug)
}

export async function listPosts(): Promise<BlogPost[]> {
  await delay()
  return postsJson as BlogPost[]
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  await delay()
  return (postsJson as BlogPost[]).find(p => p.slug === slug)
}

export async function getTopWeeklyProducts(limit = 8): Promise<Product[] | { items: Product[] }> {
  const res = await http.get('/products/top-weekly', {
    params: { limit }
  })
  return res.data
}

export async function requestOtp(phone: string) {
  // adjust field name if backend uses "mobile" or "phone_number"
  const res = await http.post('/auth/request-otp', {
    phone
  })
  return res.data
}

export async function verifyOtp(phone: string, code: string) {
  const res = await http.post('/auth/verify-otp', {
    phone,
    code
  })
  // expected response: { access_token: '...', user: {...} }
  return res.data
}

// ---- ORDERS ----
export async function listOrders(): Promise<Order[]> {
  const res = await http.get('/orders/')
  return res.data as Order[]
}