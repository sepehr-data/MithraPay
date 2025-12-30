import { defineStore } from 'pinia'
import { listProducts, getProduct, getTopWeeklyProducts } from '@/services/products'
import type { Product, Category } from '@/services/types'
import type { ProductDto } from '@/api/products.dto'
import { mapProductDto } from '@/services/mappers'

function mapCategories(items: Product[]): Category[] {
  const seen = new Map<string, Category>()

  items.forEach((product) => {
    const raw = product.categoryId
    if (!raw && raw !== 0) return

    const slug = String(raw)
    if (seen.has(slug)) return

    seen.set(slug, {
      id: raw,
      slug,
      title: slug,
    })
  })

  return Array.from(seen.values())
}

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [] as Product[],
    categories: [] as Category[],
    loading: false,
    error: null as string | null,
    topWeeklyProducts: [] as Product[],
    topWeeklyLoading: false,
    topWeeklyError: null as string | null,
  }),
  actions: {
    async load(categorySlug?: string) {
      this.loading = true
      this.error = null
      try {
        const data = await listProducts(categorySlug ? { category: categorySlug } : undefined)
        this.products = (data as ProductDto[]).map(mapProductDto)
        this.categories = mapCategories(this.products)
      } catch (err: any) {
        this.error = err?.message || 'خطا در دریافت محصولات'
        this.products = []
        this.categories = []
      } finally {
        this.loading = false
      }
    },
    async find(slugOrId: string) {
      this.loading = true
      this.error = null
      try {
        const local = this.products.find(
          (p) => p.slug === slugOrId || String(p.id) === slugOrId,
        )
        if (local) return local

        const numericId = Number(slugOrId)
        if (!Number.isNaN(numericId) && Number.isFinite(numericId)) {
          const data = await getProduct(numericId)
          const mapped = mapProductDto(data as ProductDto)
          this.products = [mapped, ...this.products.filter((p) => p.id !== mapped.id)]
          return mapped
        }

        const list = await listProducts({ search: slugOrId })
        const mappedList = (list as ProductDto[]).map(mapProductDto)
        const match = mappedList.find((p) => p.slug === slugOrId)
        if (match) {
          this.products = [match, ...this.products.filter((p) => p.id !== match.id)]
        }
        return match
      } catch (err: any) {
        this.error = err?.message || 'خطا در دریافت محصول'
        return undefined
      } finally {
        this.loading = false
      }
    },
    async fetchTopWeeklyProducts(limit = 8) {
      this.topWeeklyLoading = true
      this.topWeeklyError = null
      try {
        const data = await getTopWeeklyProducts(limit)
        const items = (data as { items?: ProductDto[] }).items ?? (data as ProductDto[])
        this.topWeeklyProducts = items.map(mapProductDto)
      } catch (err: any) {
        this.topWeeklyError = err?.message || 'خطا در دریافت پرفروش‌های این هفته'
      } finally {
        this.topWeeklyLoading = false
      }
    },
  },
})
