// src/stores/auth.ts
import { defineStore } from "pinia"
import { useCartStore } from "@/stores/cart"
import { useUiStore } from "@/stores/ui"

const TOKEN_KEY = "access_token"
const USER_KEY = "auth_user"

type JwtPayload = {
    sub?: string | number
    phone?: string
    roles?: string[]
    exp?: number
    iat?: number
    is_phone_verified?: boolean
}

function parseJwt(token: string): JwtPayload | null {
    try {
        const part = token.split(".")[1]
        if (!part) return null
        const base64 = part.replace(/-/g, "+").replace(/_/g, "/")
        const json = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        )
        return JSON.parse(json)
    } catch {
        return null
    }
}

function normalizeRoles(v: any): string[] {
    if (!Array.isArray(v)) return []
    return v
        .map((x) => String(x ?? "").trim().toLowerCase())
        .filter(Boolean)
}

interface User {
    id?: number | string
    phone?: string
    name?: string

    // ✅ قبلی (ممکنه تو UI استفاده شده باشه)
    role?: string

    // ✅ جدید
    roles?: string[]
}

export const useAuthStore = defineStore("auth", {
    state: () => ({
        token: (localStorage.getItem(TOKEN_KEY) as string | null),
        user: (localStorage.getItem(USER_KEY)
            ? (JSON.parse(localStorage.getItem(USER_KEY) as string) as User)
            : null) as User | null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,

        // ✅ جدید: roles
        roles: (state) => state.user?.roles || [],

        // ✅ جدید: admin check
        isAdmin: (state) => (state.user?.roles || []).includes("admin"),
    },

    actions: {
        login(payload: { token: string; user?: User }) {
            // ✅ token normalize
            const cleanToken = String(payload.token || "").replace(/^"+|"+$/g, "").trim()

            this.token = cleanToken
            localStorage.setItem(TOKEN_KEY, cleanToken)

            // ✅ decode roles from JWT
            const jwt = cleanToken ? parseJwt(cleanToken) : null
            const roles = normalizeRoles(jwt?.roles)

            // ✅ merge user (keep backward compat fields)
            const mergedUser: User = {
                ...(payload.user || {}),
                // اگر بک phone رو تو JWT گذاشته بود و payload.user نداشت، از JWT بردار
                phone: (payload.user?.phone ?? jwt?.phone) as any,
                roles,
                // برای سازگاری با کدهای قدیمی: role = اولین نقش
                role: roles[0] || payload.user?.role,
            }

            this.user = mergedUser
            localStorage.setItem(USER_KEY, JSON.stringify(mergedUser))
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
                if (typeof (cart as any).clear === "function") (cart as any).clear()
                else if (typeof cart.$reset === "function") cart.$reset()
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
