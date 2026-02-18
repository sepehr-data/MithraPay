// src/types/endpoints.ts
export const endpoints = {
    auth: {
        register: "/auth/register",
        requestOtp: "/auth/request-otp",
        verifyOtp: "/auth/verify-otp",
    },

    user: {
        me: "/users/me",
    },

    admin: {
        admins: "/admin/admins",
        products: "/admin/products",
        productById: (id: number) => `/admin/products/${id}`,
        blogs: "/admin/blogs",
        blogById: (id: number) => `/admin/blogs/${id}`,
        users: "/admin/users",
        banners: "/admin/banners",
        bannerById: (id: number) => `/admin/banners/${id}`,
        tickets: "/admin/tickets",
        ticketById: (id: number) => `/admin/tickets/${id}`,
        orders: "/admin/orders",
        orderById: (id: number) => `/admin/orders/${id}`,
    },

    orders: {
        create: "/orders/create",
        list: "/orders/",
        my: "/orders/my",
        byId: (orderId: number) => `/orders/${orderId}`,
    },

    banners: {
        list: "/banners",
        byId: (id: number) => `/banners/${id}`,
    },

    products: {
        create: "/products/",
        list: "/products/",
        topWeekly: "/products/top-weekly",
        byId: (productId: number) => `/products/${productId}`,
    },

    blog: {
        list: "/blogs/",
        bySlug: (slug: string) => `/blogs/${encodeURIComponent(slug)}`,
    },

    cart: {
        getCart: "/carts/",
        addItem: "/carts/add",
        removeItem: (itemId: number) => `/carts/remove/${itemId}`,
        clear: "/carts/clear",

        // ✅ new: update qty
        updateItemQty: (itemId: number) => `/carts/items/${itemId}`,
    },

    tickets: {
        create: "/tickets/",
    },
} as const
