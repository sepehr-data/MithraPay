// src/api/endpoints.ts
export const endpoints = {
    auth: {
        register: "/auth/register",
        requestOtp: "/auth/request-otp",
        verifyOtp: "/auth/verify-otp",
        // login is disabled on backend (405) -> intentionally not exposed
    },
    user: {
        me: "/users/me",
    },
    admin: {
        products: "/admin/products",
        productById: (id: number) => `/admin/products/${id}`,
    },
    orders: {
        create: "/orders/",
        byId: (orderId: number) => `/orders/${orderId}`,
    },
    products: {
        create: "/products/",
        list: "/products/",
        topWeekly: "/products/top-weekly",
        byId: (productId: number) => `/products/${productId}`,
    },
    blog: {
        list: "/blog/",
        bySlug: (slug: string) => `/blog/${encodeURIComponent(slug)}`,
    },
    cart: {
        byUserId: (userId: number) => `/cart/${userId}`,
        addItem: "/cart/items",
        itemById: (itemId: number) => `/cart/items/${itemId}`,
        clearByUserId: (userId: number) => `/cart/${userId}`,
    },
} as const
