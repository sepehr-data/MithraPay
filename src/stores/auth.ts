// src/stores/auth.ts
import { defineStore } from "pinia"
import { useCartStore } from "@/stores/cart"
import { useUiStore } from "@/stores/ui"

const TOKEN_KEY = "access_token"
const USER_KEY = "auth_user"

interface User {
    id?: number | string
    phone?: string
    name?: string
    role?: string
}

export const useAuthStore = defineStore("auth", {
    state: () => ({
        token: (localStorage.getItem(TOKEN_KEY) as string | null),
        user: (localStorage.getItem(USER_KEY)
            ? JSON.parse(localStorage.getItem(USER_KEY) as string)
            : null) as User | null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
    },

    actions: {
        login(payload: { token: string; user: User }) {
            this.token = payload.token
            this.user = payload.user

            localStorage.setItem(TOKEN_KEY, payload.token)
            localStorage.setItem(USER_KEY, JSON.stringify(payload.user))
        },

        logout() {
            // 1) پاک کردن auth
            this.token = null
            this.user = null
            localStorage.removeItem(TOKEN_KEY)
            localStorage.removeItem(USER_KEY)

            // 2) پاک کردن سبد خرید + بستن cart drawer
            try {
                const cart = useCartStore()

                // اگر متد clear داری استفاده کن
                if (typeof (cart as any).clear === "function") (cart as any).clear()
                // اگر از $reset استفاده می‌کنی
                else if (typeof cart.$reset === "function") cart.$reset()
                // fallback در صورت نبودن این‌ها
                else if ("items" in cart) (cart as any).items = []
            } catch {}

            try {
                const ui = useUiStore()
                if (typeof (ui as any).closeCart === "function") (ui as any).closeCart()
                else if (typeof (ui as any).closeCartDrawer === "function") (ui as any).closeCartDrawer()
            } catch {}
        },
    },
})
