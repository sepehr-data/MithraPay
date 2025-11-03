// Simple mock API using local JSON. Replace with real HTTP calls later.
import productsJson from '@/mocks/products.json'
import categoriesJson from '@/mocks/categories.json'
import postsJson from '@/mocks/posts.json'
import type { Product, Category, BlogPost, ID } from './types'

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
