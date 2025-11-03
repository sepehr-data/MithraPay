import { defineStore } from 'pinia'
import { listProducts, listCategories, getProduct } from '@/services/api'
import type { Product, Category } from '@/services/types'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [] as Product[],
    categories: [] as Category[],
    loading: false
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
    }
  }
})
