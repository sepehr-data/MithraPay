import { defineStore } from "pinia"
import type { ID, Product } from "@/services/types"
import products from "@/mocks/products.json"

type LocalCartItem = { productId: ID; qty: number }
type DetailedCartItem = LocalCartItem & { product: Product; lineTotal: number }

const list = products as Product[]

// ✅ تلاش برای پاک کردن کلیدهای احتمالی Persist (بسته به تنظیمات پلاگین)
function removePersistedCart() {
    const keys = [
        "cart",               // اگر خودت دستی گذاشته باشی
        "pinia-cart",         // رایج
        "pinia:cart",         // رایج
        "cart-store",         // احتمالی
        "auth_cart",          // احتمالی
    ]

    for (const k of keys) {
        try {
            localStorage.removeItem(k)
        } catch {
            // ignore
        }
    }

}

export const useCartStore = defineStore("cart", {
    state: () => ({
        items: [] as LocalCartItem[],
    }),

    getters: {
        count(state): number {
            return state.items.reduce((sum, item) => sum + item.qty, 0)
        },

        detailed(state): DetailedCartItem[] {
            return state.items.map((i) => {
                const p = list.find((x) => String(x.id) === String(i.productId))

                if (!p) {
                    return { ...i, product: { id: i.productId } as unknown as Product, lineTotal: 0 }
                }

                return { ...i, product: p, lineTotal: i.qty * p.price }
            })
        },

        total(state): number {
            return state.items.reduce((sum: number, i) => {
                const p = list.find((x) => String(x.id) === String(i.productId))
                const price = p?.price ?? 0
                return sum + i.qty * price
            }, 0)
        },
    },

    actions: {
        add(productId: ID, qty = 1) {
            const existing = this.items.find((i) => String(i.productId) === String(productId))
            if (existing) existing.qty += qty
            else this.items.push({ productId, qty })
        },

        remove(productId: ID) {
            this.items = this.items.filter((i) => String(i.productId) !== String(productId))
        },

        setQty(productId: ID, qty: number) {
            const item = this.items.find((i) => String(i.productId) === String(productId))
            if (!item) return
            item.qty = Math.max(1, qty)
        },

        clear() {
            // ✅ 1) پاک کردن state
            this.items = []

            // ✅ 2) پاک کردن persisted storage (برای اینکه بعد از logout برنگرده)
            removePersistedCart()
        },

        reset() {
            // اگر خواستی در لاگ‌اوت استفاده کنی
            this.$reset()
            removePersistedCart()
        },
    },

    persist: true,
})
