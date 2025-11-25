import { defineStore } from 'pinia'
import { listProducts, listCategories, getProduct, getTopWeeklyProducts } from '@/services/api'
import type { Product, Category } from '@/services/types'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [] as Product[],
    categories: [] as Category[],
    loading: false,
    topWeeklyProducts: [] as Product[],
    topWeeklyLoading: false,
    topWeeklyError: null as string | null
  }),
  actions: {
    async load(categorySlug?: string) {
      this.loading = true
      try {
        this.categories = await listCategories()
        this.products = await listProducts(categorySlug)
      } finally {
        this.loading = false
      }
    },
    async find(slug: string) {
      this.loading = true
      try {
        return await getProduct(slug)
      } finally {
        this.loading = false
      }
    },
    async fetchTopWeeklyProducts(limit = 8) {
      this.topWeeklyLoading = true
      this.topWeeklyError = null
      try {
        const data = await getTopWeeklyProducts(limit)
        this.topWeeklyProducts = (data as { items?: Product[] }).items ?? (data as Product[])
      } catch (err: any) {
        this.topWeeklyError = err?.message || 'خطا در دریافت پرفروش‌های این هفته'
      } finally {
        this.topWeeklyLoading = false
      }
    }
  }
})
