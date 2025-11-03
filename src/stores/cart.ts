import { defineStore } from 'pinia'
import type { CartItem, ID, Product } from '@/services/types'
import products from '@/mocks/products.json'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[]
  }),
  getters: {
    count: (s) => s.items.reduce((a, i) => a + i.qty, 0),
    detailed: (s) => s.items.map(i => {
      const p = (products as Product[]).find(x => x.id === i.productId)!
      return { ...i, product: p, lineTotal: i.qty * p.price }
    }),
    total(): number {
      // @ts-ignore
      return this.detailed.reduce((a, x) => a + x.lineTotal, 0)
    }
  },
  actions: {
    add(productId: ID, qty = 1) {
      const existing = this.items.find(i => i.productId == productId)
      if (existing) existing.qty += qty
      else this.items.push({ productId, qty })
    },
    remove(productId: ID) {
      this.items = this.items.filter(i => i.productId !== productId)
    },
    setQty(productId: ID, qty: number) {
      const item = this.items.find(i => i.productId === productId)
      if (!item) return
      item.qty = Math.max(1, qty)
    },
    clear() { this.items = [] }
  },
  persist: false
})
