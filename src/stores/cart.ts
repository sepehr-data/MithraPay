import { defineStore } from "pinia"
import type { ID, Product } from "@/services/types"
import type { CartResponse, CartItemDto } from "@/types/api_client_types/cart.dto"
import products from "@/mocks/products.json"

type UiCartItem = { productId: ID; qty: number; meta?: CartItemDto }

const list = products as Product[]

function removePersistedCart() {
    const keys = ["cart", "pinia-cart", "pinia:cart", "cart-store", "auth_cart"]
    for (const k of keys) {
        try { localStorage.removeItem(k) } catch {}
    }
}

export const useCartStore = defineStore("cart", {
    state: () => ({
        // ✅ منبع حقیقت: هم‌شکل بک‌اند
        cart_id: null as number | null,
        status: "ACTIVE" as string,
        items: [] as CartItemDto[],
        total: 0 as number,
        count: 0 as number,
    }),

    getters: {
        // ✅ برای اینکه Drawer/ProductCard کمترین تغییر را بخورد
        uiItems(state): UiCartItem[] {
            return (state.items || []).map(i => ({
                productId: String(i.product_id),
                qty: Number(i.quantity || 1),
                meta: i,
            }))
        },

        // اگر جایی هنوز cart.items می‌خواستی به شکل قبلی:
        // می‌تونی در کامپوننت‌ها از cart.uiItems استفاده کنی

        detailed(state): Array<UiCartItem & { product: Product; lineTotal: number }> {
            return (state.items || []).map((i) => {
                const pid = String(i.product_id)
                const qty = Number(i.quantity || 1)
                const p = list.find(x => String(x.id) === pid)

                const fallbackProduct =
                    ({ id: pid, title: i.title ?? "در حال دریافت...", price: Number(i.unit_price ?? 0) } as unknown as Product)

                const product = p ?? fallbackProduct

                const lineTotal =
                    Number.isFinite(Number(i.line_total)) ? Number(i.line_total) : qty * Number((product as any).price ?? 0)

                return { productId: pid, qty, meta: i, product, lineTotal }
            })
        },

        // تعداد کل آیتم‌ها (جمع qty)
        qtyCount(state): number {
            return (state.items || []).reduce((sum, it) => sum + Number(it.quantity || 0), 0)
        },
    },

    actions: {
        // ✅ sync از بک‌اند
        setCart(data: CartResponse) {
            this.cart_id = data.cart_id ?? null
            this.status = data.status ?? "ACTIVE"
            this.items = data.items ?? []
            this.total = Number(data.total ?? 0)
            this.count = Number(data.count ?? (data.items?.length ?? 0))
        },

        clearLocal() {
            this.cart_id = null
            this.status = "ACTIVE"
            this.items = []
            this.total = 0
            this.count = 0
            removePersistedCart()
        },

        reset() {
            this.$reset()
            removePersistedCart()
        },

        // ⚠️ این‌ها فقط UI را تغییر می‌دهند (چون endpoint update qty نداری)
        // اگر update endpoint اضافه کردی، بهتره این‌ها مستقیم API صدا بزنند و بعد setCart(res)
        setQty(productId: ID, qty: number) {
            const pid = Number(productId)
            if (!Number.isFinite(pid)) return
            const item = this.items.find(i => Number(i.product_id) === pid)
            if (!item) return
            item.quantity = Math.max(1, qty)
            // line_total را هم برای UI آپدیت کن (اختیاری)
            const up = Number(item.unit_price ?? 0)
            item.line_total = up * Number(item.quantity || 1)
        },

        removeByItemId(itemId: number) {
            this.items = this.items.filter(i => Number(i.id) !== Number(itemId))
        },

        removeByProductId(productId: ID) {
            const pid = Number(productId)
            this.items = this.items.filter(i => Number(i.product_id) !== pid)
        },
    },

    persist: true,
})
