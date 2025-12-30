import { defineStore } from 'pinia'
import type { ID, Product } from '@/services/types'
import type { CartDto, CartItemDto } from '@/api/cart.dto'
import { addCartItem, clearCart, getCart, removeCartItem, updateCartItem } from '@/services/cart'
import { getProduct } from '@/services/products'
import { useAuthStore } from '@/stores/auth'
import { useProductsStore } from '@/stores/products'
import { mapProductDto } from '@/services/mappers'

export type CartItemState = {
    id?: number
    productId: ID
    qty: number
    product?: Product
}

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [] as CartItemState[],
        loading: false,
        error: null as string | null,
    }),

    getters: {
        count(state): number {
            return state.items.reduce((sum, item) => sum + item.qty, 0)
        },

        detailed(state): Array<CartItemState & { product: Product; lineTotal: number }> {
            return state.items.map((i) => {
                const product = i.product ?? ({ id: i.productId, title: 'محصول', description: '', price: 0, slug: String(i.productId), categoryId: '' } as Product)
                return { ...i, product, lineTotal: i.qty * (product.price || 0) }
            })
        },

        total(state): number {
            return state.items.reduce((sum: number, i) => {
                const price = i.product?.price ?? 0
                return sum + i.qty * price
            }, 0)
        },
    },

    actions: {
        async loadCart() {
            const auth = useAuthStore()
            const userId = auth.user?.id
            if (!userId) return

            this.loading = true
            this.error = null
            try {
                const cart = await getCart(Number(userId))
                await this.applyCart(cart)
            } catch (err: any) {
                this.error = err?.message || 'خطا در دریافت سبد خرید'
            } finally {
                this.loading = false
            }
        },

        async add(productId: ID, qty = 1) {
            const auth = useAuthStore()
            const userId = auth.user?.id
            if (!userId) {
                this.localAdd(productId, qty)
                this.error = 'برای افزودن به سبد خرید ابتدا وارد شوید.'
                return
            }

            this.loading = true
            this.error = null
            try {
                const cart = await addCartItem({
                    user_id: Number(userId),
                    product_id: Number(productId),
                    quantity: qty,
                })
                await this.applyCart(cart)
            } catch (err: any) {
                this.error = err?.message || 'خطا در افزودن به سبد خرید'
                throw err
            } finally {
                this.loading = false
            }
        },

        async remove(productId: ID) {
            const auth = useAuthStore()
            const userId = auth.user?.id
            if (!userId) {
                this.localRemove(productId)
                return
            }

            const item = this.items.find((i) => String(i.productId) === String(productId))
            if (!item?.id) return

            this.loading = true
            this.error = null
            try {
                const cart = await removeCartItem(item.id)
                await this.applyCart(cart)
            } catch (err: any) {
                this.error = err?.message || 'خطا در حذف از سبد خرید'
                throw err
            } finally {
                this.loading = false
            }
        },

        async setQty(productId: ID, qty: number) {
            const nextQty = Math.max(1, qty)
            const auth = useAuthStore()
            const userId = auth.user?.id
            if (!userId) {
                this.localSetQty(productId, nextQty)
                return
            }

            const item = this.items.find((i) => String(i.productId) === String(productId))
            if (!item?.id) return

            this.loading = true
            this.error = null
            try {
                const cart = await updateCartItem(item.id, { quantity: nextQty })
                await this.applyCart(cart)
            } catch (err: any) {
                this.error = err?.message || 'خطا در بروزرسانی تعداد'
                throw err
            } finally {
                this.loading = false
            }
        },

        async clearCart() {
            const auth = useAuthStore()
            const userId = auth.user?.id
            if (!userId) {
                this.items = []
                return
            }

            this.loading = true
            this.error = null
            try {
                const cart = await clearCart(Number(userId))
                await this.applyCart(cart)
            } catch (err: any) {
                this.error = err?.message || 'خطا در پاک کردن سبد خرید'
                throw err
            } finally {
                this.loading = false
            }
        },

        reset() {
            this.items = []
            this.error = null
            this.loading = false
        },

        localAdd(productId: ID, qty = 1) {
            const productsStore = useProductsStore()
            const productMatch = productsStore.products.find((p) => String(p.id) === String(productId))
            const existing = this.items.find((i) => String(i.productId) === String(productId))
            if (existing) {
                existing.qty += qty
                if (!existing.product && productMatch) existing.product = productMatch
            } else {
                this.items.push({ productId, qty, product: productMatch })
            }
        },

        localRemove(productId: ID) {
            this.items = this.items.filter((i) => String(i.productId) !== String(productId))
        },

        localSetQty(productId: ID, qty: number) {
            const item = this.items.find((i) => String(i.productId) === String(productId))
            if (!item) return
            item.qty = Math.max(1, qty)
        },

        async applyCart(cart: CartDto) {
            const items = (cart.items || []) as CartItemDto[]
            const mapped: CartItemState[] = items.map((item) => {
                const product = item.product ? mapProductDto(item.product) : undefined
                return {
                    id: item.id,
                    productId: item.product_id,
                    qty: item.quantity,
                    product,
                }
            })

            this.items = mapped

            const missing = mapped.filter((i) => !i.product)
            if (!missing.length) return

            await Promise.all(
                missing.map(async (item) => {
                    try {
                        const data = await getProduct(Number(item.productId))
                        item.product = mapProductDto(data)
                    } catch {
                        item.product = {
                            id: item.productId,
                            slug: String(item.productId),
                            title: 'محصول',
                            description: '',
                            price: 0,
                            categoryId: '',
                        }
                    }
                }),
            )
            this.items = [...mapped]
        },
    },

    persist: true,
})
